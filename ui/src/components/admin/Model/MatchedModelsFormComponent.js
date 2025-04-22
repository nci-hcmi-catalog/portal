import React, { useState } from 'react';
import { Field } from 'formik';
import { css } from '@emotion/react';

import { ModelSingleContext } from './ModelSingleController';
import config from '../config';
import { FormAutoComplete, FormComponent } from 'components/FormComponents';
import { getMatchedModelSet } from '../helpers';
import ModelIcon from '../../../icons/ModelIcon';

const LinkedModelsText = ({ children }) => (
  <div
    css={css`
      display: flex;
      flex-direction: row;
      margin-left: 3px;
      align-items: center;
      margin-bottom: 15px;
    `}
  >
    <ModelIcon height={'24px'} width={'24px'} />
    <span
      css={css`
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
    css={css`
      width: 159px;
      height: 50px;
      border: solid 1px #d4d7dd;
      padding: 5px 14px;
      margin-right: 6px;
      margin-bottom: 6px;
    `}
  >
    <a
      css={css`
        font-size: 11px;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.64;
        letter-spacing: normal;
        color: #900000;
        display: flex;
        text-decoration: underline;
      `}
      href={`/admin/model/${model.name}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {model.name}
    </a>

    <span
      css={css`
        font-size: 10px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.64;
        letter-spacing: normal;
      `}
    >
      {model.status.charAt(0).toUpperCase() + model.status.slice(1)}
    </span>
  </div>
);

const MatchedModelsFormComponent = ({ currentModel, modelsData }) => {
  const [warning, setWarning] = useState(false);
  const fetchMatchedModels = async (selectedName) => {
    const selected = modelsData.find((model) => model.name === selectedName);

    const outputItem = (data) => ({ name: data.name, status: data.status });
    const output = [];

    if (selected.matchedModels) {
      try {
        const response = await getMatchedModelSet(config.urls.cmsBase, selected.matchedModels);
        if (response.status === 200) {
          response.data.models.forEach((model) => output.push(outputItem(model)));
        }
      } catch (e) {
        // TODO:
        console.error(
          `Failed to get details of the models in the matched set for ${selected.name}:\n${e}`,
        );
      }
    }
    return output;
  };

  return (
    <ModelSingleContext.Consumer>
      {({ setMatchedModels, state: { matchedModels } }) => (
        <div>
          <FormComponent
            labelText="Link to Existing Model"
            description="Start typing model name to look up existing models. You only need to link to one model in the set."
          >
            <Field
              name="modelToConnect"
              options={(modelsData || []).map((other) => other.name)}
              errorText="No existing model with the given name"
              component={FormAutoComplete}
              clearable={true}
              warning={warning}
              warningText={'Warning: the model you are linking to is from a different center.'}
              onSelect={async (value) => {
                if (value) {
                  const response = await fetchMatchedModels(value);
                  setMatchedModels(response);
                  setWarning(currentModel.split('-')[1] !== value.split('-')[1]);
                } else {
                  setMatchedModels([]);
                  setWarning(false);
                }
              }}
            />
          </FormComponent>
          {matchedModels.length > 0 && (
            <>
              <LinkedModelsText>This model is linked to:</LinkedModelsText>
              <div
                css={css`
                  display: flex;
                  flex-direction: row;
                  flex-wrap: wrap;
                `}
              >
                {matchedModels.map((match) => (
                  <LinkedModelDetails key={match.name} model={match} />
                ))}
              </div>
            </>
          )}
          {matchedModels.length === 0 && (
            <LinkedModelsText>This model is not linked to other models.</LinkedModelsText>
          )}
        </div>
      )}
    </ModelSingleContext.Consumer>
  );
};

export default MatchedModelsFormComponent;
