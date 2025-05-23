// @ts-check

import express from 'express';
import Model from '../schemas/model';
import getPublishValidation from '../validation/model';
import { runYupValidatorFailFast } from '../helpers';
import { publishModel } from '../services/elastic-search/publish';
import { unpublishModel } from '../services/elastic-search/unpublish';
import { backupFields } from '../schemas/descriptions/modelVariant';
import csvStream from '../helpers/streamAsCSV';

import getLogger from '../logger';
const logger = getLogger('routes/action');

const actionRouter = express.Router();

actionRouter.post('/publish/:name', async (req, res) => {
  const { name } = req.params;

  const validation = await getPublishValidation();
  Model.find({
    name,
  })
    .populate('variants.variant')
    .then(models => runYupValidatorFailFast(validation, models))
    .then(() => publishModel({ name }))
    .then(() => res.json({ success: `${name} has been successfully published` }))
    .catch(error => {
      logger.error(error);
      res.status(500).json({
        error: error,
      });
    });
});

actionRouter.post('/unpublish/:name', async (req, res) => {
  const { name } = req.params;
  try {
    await unpublishModel(name);
    res.json({ success: `${name} has been successfully unpublished` });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      error: error,
    });
  }
});

actionRouter.get('/backup-variants/:name', async (req, res) => {
  const { name } = req.params;
  Model.findOne({
    name,
  })
    .populate('variants.variant')
    .exec((err, data) =>
      err
        ? res.status(500).send(err)
        : csvStream({
            data: JSON.parse(JSON.stringify(data.variants)), // mongoose objects are not json -> this converts data to pure json object that can be used by json2csv parser
            fields: [{ label: 'Model Name', value: () => name }].concat(backupFields),
            writeHeaders: true,
            exportFileName: `${name}-Variants`,
            response: res,
          }),
    );
});

export default actionRouter;
