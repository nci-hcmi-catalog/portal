import { argv } from 'yargs';
import exportMapping from '../utils/export-mapping';

// TODO: cli argument help / error handling

let mapping = exportMapping({
  name: argv.name || 'doc',
  properties: require(`../${argv._}/properties.mapping`).default(),
  settings: require(`../${argv._}/settings.index`).default(),
});

console.log(JSON.stringify(mapping, null, 2));
