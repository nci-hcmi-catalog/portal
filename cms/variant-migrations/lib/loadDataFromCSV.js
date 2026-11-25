import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const loadDataFromCSV = async (filename) => {
  const data = await csv().fromFile(__dirname + '/../data/' + filename);

  return data.map((variant) => ({
    name: variant.name,
    type: variant.type,
    category: variant.category,
    genes:
      variant.genes.length > 0
        ? variant.genes.split(',').map((gene) => (typeof gene === 'string' ? gene.trim() : gene))
        : [],
  }));
};

module.exports = loadDataFromCSV;
