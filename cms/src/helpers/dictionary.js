import Dictionary from '../schemas/dictionary';
import Draft from '../schemas/dictionaryDraft';

// const dictToDraft = dict => {
//   const { name, displayName, dependentValues } = dict;
//   const values = dict.values.map(val => {
//     return { value: val.value, dependents: [] };
//   });
//   const draft = { name, displayName, dependentValues, values };
//   return draft;
// };

export const resetDraft = async () => {
  await Draft.deleteMany();
  const dictionaries = await Dictionary.find();
  await Draft.insertMany(dictionaries);
  return await Draft.find();
};
