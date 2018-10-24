// @ts-check

import express from 'express';
import Model from '../schemas/model';
import publishValidation from '../validation/model';
import { runYupValidatorFailFast, modelStatus } from '../helpers';
import { indexOneToES } from '../services/elastic-search/publish';
import { unpublishOneFromES } from '../services/elastic-search/unpublish';
import { backupFields } from '../schemas/descriptions/modelVariant';
import csvStream from '../helpers/streamAsCSV';

const actionRouter = express.Router();

actionRouter.post('/publish/:name', async (req, res) => {
  const { name } = req.params;
  Model.find({
    name,
  })
    .then(models => runYupValidatorFailFast(publishValidation, models))
    .then(() => indexOneToES({ name }))
    .then(() =>
      Model.updateOne(
        {
          name,
        },
        { status: modelStatus.published },
      ),
    )
    .then(() => res.json({ success: `${name} has been successfully published` }))
    .catch(error =>
      res.status(500).json({
        error: error,
      }),
    );
});

actionRouter.post('/unpublish/:name', async (req, res) => {
  const { name } = req.params;
  Model.find({
    name,
  })
    .then(() => unpublishOneFromES(name))
    .then(() =>
      Model.updateOne(
        {
          name,
        },
        { status: modelStatus.unpublished },
      ),
    )
    .then(() => res.json({ success: `${name} has been successfully unpublished` }))
    .catch(error =>
      res.status(500).json({
        error: error,
      }),
    );
});

actionRouter.get('/backup-variants/:name', async (req, res) => {
  const { name } = req.params;
  Model.findOne({
    name,
  })
    .populate('variants.variant')
    .exec(
      (err, data) =>
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
