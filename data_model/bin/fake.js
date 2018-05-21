import elasticsearch from 'elasticsearch';
import { flattenDeep, range } from 'lodash';
import { argv } from 'yargs';
import ora from 'ora';
import uuid from 'uuid/v4';
import exportMapping from '../utils/export-mapping';
import fake from '../utils/mapping-faker';

if (!argv.length || typeof argv.length !== 'number') {
  console.log(`missing or invalid --length argument`);
  process.exit();
}

if (!argv.index || !argv.type) {
  console.log(`missing --index / --type arguments`);
  process.exit();
}

let es = new elasticsearch.Client({
  host: argv.host || 'http://localhost:9200',
});

let model_properties = require(`../model/properties.mapping`).default();
let model_settings = require(`../model/settings.index`).default();
let variant_properties = require(`../variant/properties.mapping`).default();
let variant_settings = require(`../variant/settings.index`).default();

let main = async () => {
  let spinner = ora(`Creating model and variant indices`).start();

  try {
    // model index
    await es.indices.create({
      index: argv.index,
      body: exportMapping({
        name: argv.type,
        properties: model_properties,
        settings: model_settings,
      }),
    });

    // variant index
    await es.indices.create({
      index: `variant_from_${argv.index}`,
      body: exportMapping({
        name: `variant_from_${argv.type}`,
        properties: variant_properties,
        settings: variant_settings,
      }),
    });

    spinner.succeed();
    spinner.start(`Loading ${argv.length} documents into the ${argv.index} index`);

    let models = range(argv.length).map(() => fake(model_properties));

    await es.bulk({
      body: flattenDeep(
        models.map(model => [
          {
            index: {
              _index: argv.index,
              _type: argv.type,
              _id: uuid(),
            },
          },
          model,
        ]),
      ),
    });

    spinner.succeed();
  } catch (error) {
    spinner.fail();
    console.log(error);
  }
};

main();
