import mongoose from 'mongoose';
import express from 'express';

import * as DictionaryHelper from '../helpers/dictionary';

import Dictionary from '../schemas/dictionary';
import Draft, { draftStatus } from '../schemas/dictionaryDraft';
const dictionaryRouter = express.Router();
const draftRouter = express.Router();

dictionaryRouter.use('/draft', draftRouter);

/* Dictionary Routes: */

dictionaryRouter.get('/', async (req, res) => {
  try {
    const dictionary = await DictionaryHelper.getDictionaryOptions();
    res.json(dictionary);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
});

/* Draft Routes: */

draftRouter.get('/', async (req, res) => {
  try {
    let draft = await DictionaryHelper.getDictionaryDraft();
    if (!draft || draft.fields.length < 1) {
      draft = await DictionaryHelper.resetDraft();
    }
    res.json(draft);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
});

// Use DELETE method on draft to reset it
draftRouter.delete('/', async (req, res) => {
  try {
    const output = await DictionaryHelper.resetDraft();
    res.json(output);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
});

// EDIT EXISTING VALUE
//TODO: Need to check uniqueness of new values
draftRouter.patch('/', async (req, res) => {
  try {
    const { field, parent, dependentName, original, updated } = req.body;
    if (!(field && original && updated)) {
      res.status(400).json({
        err: `Missing required parameter(s): 'field', 'original', and 'updated' are all mandatory.`,
      });
      return;
    }
    if (parent && !dependentName) {
      res
        .status(400)
        .json({ err: `Value for parameter 'parent' was provided but no 'dependentName' value.` });
      return;
    }

    const draftDoc = await DictionaryHelper.getDictionaryDraft();
    const draft = draftDoc.fields.find(i => i.name === field);

    if (!draft) {
      res.status(400).json({ err: `No dictionary field found named: ${field}` });
      return;
    }

    if (parent) {
      // handle dependent field case

      const hasDependencies = draft.dependentValues && draft.dependentValues.length > 0;
      if (!hasDependencies) {
        res.status(400).json({
          err: `Attempting to change dependent value for a field that has no dependencies`,
        });
        return;
      }

      if (!draft.dependentValues.includes(dependentName)) {
        res.status(400).json({
          err: `Specified field does not include dependents of the name: ${dependentName}`,
        });
        return;
      }

      const parentValue = draft.values.find(val =>
        val.original ? val.original === parent : val.value === parent,
      );

      if (!parentValue) {
        res.status(400).json({ err: `No value found that matches the provided parent value.` });
        return;
      }

      const dependent = parentValue.dependents.find(dep => dep.name === dependentName);

      if (!dependent) {
        res.status(400).json({ err: `Parent value has no values for this dependent name` });
        return;
      }

      const editValue = dependent.values.find(val =>
        val.original ? val.original === original : val.value === original,
      );

      if (!editValue) {
        res.status(400).json({ err: `No item found with original value: ${original}` });
        return;
      }
      if (DictionaryHelper.valueExists(dependent.values, updated)) {
        res.status(400).json({ err: 'This value already exists in the specified field.' });
        return;
      }

      editValue.original = editValue.original ? editValue.original : original;

      editValue.value = updated;
      editValue.status = editValue.value === original ? draftStatus.published : draftStatus.edited;
    } else {
      // handle basic case
      const editValue = draft.values.find(val =>
        val.original ? val.original === original : val.value === original,
      );
      if (!editValue) {
        res.status(400).json({ err: `No item found with original value: ${original}` });
        return;
      }
      if (DictionaryHelper.valueExists(draft.values, updated)) {
        res.status(400).json({ err: 'This value already exists in the specified field.' });
        return;
      }
      editValue.original = editValue.original ? editValue.original : original;

      editValue.value = updated;
      editValue.status = editValue.value === original ? draftStatus.published : draftStatus.edited;
    }

    draft.stats = DictionaryHelper.countDraftStats(draft);
    await draftDoc.save();

    // const output = await DictionaryHelper.getDictionaryDraft();
    res.json(draftDoc);
  } catch (err) {
    console.log('err', err);
    res.status(500).json({ err: err.message });
  }
});

// ADD NEW VALUE
draftRouter.post('/', async (req, res) => {
  try {
    const { field, parent, dependentName, value } = req.body;

    const valueObject = { value, dependents: [], status: draftStatus.new };

    if (!(field && value)) {
      res
        .status(400)
        .json({ err: `Missing required parameter(s): 'field', and 'value' are both mandatory.` });
      return;
    }
    if (parent && !dependentName) {
      res
        .status(400)
        .json({ err: `Value for parameter 'parent' was provided but no 'dependentName' value.` });
      return;
    }

    const draftDoc = await DictionaryHelper.getDictionaryDraft();
    const draft = draftDoc.fields.find(i => i.name === field);

    if (!draft) {
      res.status(400).json({ err: `No dictionary field found named: ${field}` });
      return;
    }

    if (parent) {
      // handle dependent field case

      const hasDependencies = draft.dependentValues && draft.dependentValues.length > 0;
      if (!hasDependencies) {
        res.status(400).json({
          err: `Attempting to changge dependent value for a field that has no dependencies`,
        });
        return;
      }

      if (!draft.dependentValues.includes(dependentName)) {
        res.status(400).json({
          err: `Specified field does not include dependents of the name: ${dependentName}`,
        });
        return;
      }

      const parentValue = draft.values.find(val =>
        val.original ? val.original === parent : val.value === parent,
      );

      if (!parentValue) {
        res.status(400).json({ err: `No value found that matches the provided parent value.` });
        return;
      }

      let dependent = parentValue.dependents.find(dep => dep.name === dependentName);

      if (!dependent) {
        dependent = {
          name: dependentName,
          // displayName has a replace that does: To Title Case
          displayName: dependentName.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
          }),
          values: [],
          dependentValues: [],
        };
        parentValue.values.push(dependent);
      }
      if (DictionaryHelper.valueExists(dependent.values, value)) {
        res.status(400).json({ err: 'This value already exists in the specified field.' });
        return;
      }
      dependent.values.push(valueObject);
    } else {
      // handle basic field case
      if (DictionaryHelper.valueExists(draft.values, value)) {
        res.status(400).json({ err: 'This value already exists in the specified field.' });
        return;
      }
      draft.values.push(valueObject);

      // draft.status = DictionaryHelper.checkDraftStatus(draft);
    }
    draft.stats = DictionaryHelper.countDraftStats(draft);
    await draftDoc.save();

    // const output = await DictionaryHelper.getDictionaryDraft();
    res.json(draftDoc);
  } catch (err) {
    console.log('err', err);
    res.status(500).json({ err: err.message });
  }
});

draftRouter.post('/publish', async (req, res) => {
  try {
    const dictionary = await DictionaryHelper.publishDraft();
    const output = await DictionaryHelper.resetDraft();
    res.json(output);
  } catch (err) {
    console.log('err', err);
    res.status(500).json({ err: err.message });
  }
});

export default dictionaryRouter;
