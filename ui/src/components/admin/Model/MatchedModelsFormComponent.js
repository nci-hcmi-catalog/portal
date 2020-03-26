import React, { useState } from 'react';
import { Field } from 'formik';

import config from '../config';
import { FormAutoComplete, FormComponent } from 'components/FormComponents';
import { getMatchedModelSet } from '../helpers';
import ModelIcon from '../../../icons/ModelIcon';

const LinkedModelsText = ({ children }) => (
  <div
    css={`
      display: flex;
      flex-direction: row;
      margin-left: 3px;
      align-items: center;
      margin-bottom: 15px;
    `}
  >
    <ModelIcon height={24} width={24} />
    <span
      css={`
        font-size: 14px;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.71;
      `}
    >
      {children}
    </span>
  </div>
);

const LinkedModelDetails = ({ model }) => (
  <div
    css={`
      width: 159px;
      height: 50px;
      border: solid 1px #d4d7dd;
      padding: 5px 14px;
      margin-right: 6px;
      margin-bottom: 6px;
    `}
  >
    <span
      css={`
        font-size: 11px;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.64;
        letter-spacing: normal;
        color: #900000;
        display: flex;
      `}
    >
      {model.name}
    </span>
    <span
      css={`
        font-size: 10px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.64;
        letter-spacing: normal;
      `}
    >
      {model.status}
    </span>
  </div>
);

const MatchedModelsFormComponent = ({ currentModel, linkedModels, modelsData }) => {
  const [matches, setMatches] = useState(linkedModels || []);

  const fetchMatchedModels = async selectedName => {
    const selected = modelsData.find(model => model.name === selectedName);

    const outputItem = data => ({ name: data.name, status: data.status });
    const output = [];

    if (selected.matchedModels) {
      try {
        const response = await getMatchedModelSet(config.urls.cmsBase, selected.matchedModels);
        if (response.status === 200) {
          response.data.models.forEach(model => output.push(outputItem(model)));
        }
      } catch (e) {
        // TODO:
        console.error(
          `Failed to get details of the modles in the matched set for ${selected.name}:\n${e}`,
        );
      }
    }
    return output;
  };

  return (
    <div>
      <FormComponent
        labelText="Link to Existing Model"
        description="Start typing model name to look up existing models."
      >
        <Field
          name="modelToConnect"
          options={(modelsData || []).map(other => other.name)}
          errorText="No existing model with the given name"
          component={FormAutoComplete}
          onSelect={async value => {
            if (value) {
              const response = await fetchMatchedModels(value);
              setMatches(response);
            } else {
              setMatches([]);
            }
          }}
        />
      </FormComponent>
      {matches.length > 0 && (
        <>
          <LinkedModelsText>This model is linked to:</LinkedModelsText>
          <div
            css={`
              display: flex;
              flex-direction: row;
              flex-wrap: wrap;
            `}
          >
            {matches.map(match => (
              <LinkedModelDetails key={match.name} model={match} />
            ))}
          </div>
        </>
      )}
      {matches.length === 0 && (
        <LinkedModelsText>This model is not linked to other models.</LinkedModelsText>
      )}
    </div>
  );
};

export default MatchedModelsFormComponent;
