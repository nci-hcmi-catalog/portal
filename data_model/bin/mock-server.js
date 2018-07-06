import fake from '../utils/mapping-faker';
import createVariants from '../utils/createVariants';
import { range } from 'lodash';
import {argv} from 'yargs';
let model_properties = require(`../model/properties.mapping`).default();

let main = async => {
  let models = range(argv.length || 100).map(() => fake(model_properties));
  let variants = createVariants(models);
  let fs = require('fs');

  const data = {
    models,
    variants,
  };

  fs.writeFile('./bin/db.json', JSON.stringify(data), err => {
    err
      ? console.log('Error saving database.', err)
      : console.log('Database generated successfully.');
  });
};

main();
