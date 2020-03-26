// @ts-check

import express from 'express';
import Model from '../schemas/model';
import publishValidation from '../validation/model';
import { runYupValidatorFailFast, modelStatus } from '../helpers';
import { publishModel, indexMatchedModelsToES } from '../services/elastic-search/publish';
import { unpublishModel, unpublishOneFromES } from '../services/elastic-search/unpublish';
import { backupFields } from '../schemas/descriptions/modelVariant';
import csvStream from '../helpers/streamAsCSV';

const actionRouter = express.Router();

actionRouter.post('/publish/:name', async (req, res) => {
  const { name } = req.params;
  Model.find({
    name,
  })
    .then(models => runYupValidatorFailFast(publishValidation, models))
    .then(() => publishModel({ name }))
    .then(() => res.json({ success: `${name} has been successfully published` }))
    .catch(error => {
      console.log(error);
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
    console.log(error);
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
