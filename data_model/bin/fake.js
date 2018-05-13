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

let properties = require(`../${argv._}/properties.mapping`).default();
let settings = require(`../${argv._}/settings.index`).default();

let main = async () => {
  let spinner = ora(`Creating ${argv.index} index from ${argv._} data model`).start();

  try {
    await es.indices.create({
      index: argv.index,
      body: exportMapping({
        name: argv.type,
        properties,
        settings,
      }),
    });

    spinner.succeed();

    spinner.start('test?');

    await es.bulk({
      body: flattenDeep(
        range(argv.length).map(() => [
          {
            index: {
              _index: argv.index,
              _type: argv.type,
              _id: uuid(),
            },
          },
          fake(properties),
        ]),
      ),
    });

    spinner.succeed('worked?');
  } catch (error) {
    // console.log();
    spinner.fail(error.message);
  }
};

main();
