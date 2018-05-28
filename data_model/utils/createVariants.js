import { omit, differenceBy, intersectionBy } from 'lodash';

let toId = v => [v.category, v.name].join('-');

export default models =>
  models.reduce((acc, model) => {
    let variantsWithIds = model.variants.map(v => ({
      ...v,
      variant_id: toId(v),
      models: [omit(model, 'variants')],
    }));

    let difference = differenceBy(variantsWithIds, acc, 'variant_id');
    let intersection = intersectionBy(variantsWithIds, acc, 'variant_id');

    return [
      ...acc.map(v => ({
        ...v,
        models: [
          ...v.models,
          ...(intersection.find(i => i.variant_id === v.variant_id)
            ? [omit(model, 'variants')]
            : []),
        ],
      })),
      ...difference,
    ];
  }, []);
