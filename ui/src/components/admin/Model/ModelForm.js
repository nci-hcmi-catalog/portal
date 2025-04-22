import React from 'react';
import Component from 'react-component-component';
import { withFormik, Field } from 'formik';
import { ModelSingleContext } from './ModelSingleController';
import MatchedModelsFormComponent from './MatchedModelsFormComponent';
import {
  FormComponent,
  FormInput,
  FormDateInput,
  FormSelect,
  FormRadioSelect,
  FormMultiCheckbox,
  FormAutoComplete,
} from 'components/FormComponents';
import { FormContainer, FormHeader, FormSection, FormCol } from 'theme/adminFormStyles';
import { schemaObj } from '@hcmi-portal/cms/src/schemas/descriptions/model';
import TabHeader from './TabHeader';
const booleanChoice = [
  { label: 'Yes', value: true },
  { label: 'No', value: false },
];

const isClinicalTumorDiagnosisSelected = (values) =>
  !values.clinical_tumor_diagnosis || values.clinical_tumor_diagnosis === '0';

// All labels/keys from model schema
const {
  name,
  type,
  split_ratio,
  time_to_split,
  growth_rate,
  primary_site,
  neoadjuvant_therapy,
  tnm_stage,
  molecular_characterizations,
  chemotherapeutic_drugs,
  tissue_type,
  clinical_tumor_diagnosis,
  site_of_sample_acquisition,
  histological_type,
  tumor_histological_grade,
  clinical_stage_grouping,
  age_at_diagnosis,
  age_at_sample_acquisition,
  vital_status,
  disease_status,
  gender,
  race,
  therapy,
  date_of_availability,
  licensing_required,
  distributor_part_number,
  source_model_url,
  source_sequence_url,
  somatic_maf_url,
  proteomics_url,
  expanded,
  updatedAt,
} = schemaObj;

const ModelFormTemplate = ({
  values,
  touched,
  dirty,
  errors,
  setTouched,
  otherModelOptions,
  dictionary,
}) => {
  const {
    clinicalTumorDiagnosisDependent,
    clinicalTumorDiagnosisOptions,
    modelTypeOptions,
    molecularCharacterizationsOptions,
    splitRatioOptions,
    genderOptions,
    raceOptions,
    neoadjuvantTherapyOptions,
    diseaseStatusOptions,
    vitalStatusOptions,
    therapyOptions,
    primarySitesOptions,
    tissueTypesOptions,
  } = dictionary;

  const makeClinicalTumorDiagnosisDependentOptions = (
    clinical_tumor_diagnosis = '',
    fieldName = '',
  ) =>
    (clinicalTumorDiagnosisDependent[fieldName.toLowerCase()] &&
      clinicalTumorDiagnosisDependent[fieldName.toLowerCase()][
        clinical_tumor_diagnosis.toLowerCase()
      ]) ||
    [];

  return (
    <ModelSingleContext.Consumer>
      {({
        state: {
          data: { didLoad },
        },
        syncFormState,
      }) => (
        <Component
          didMount={() => {
            if (Object.keys(values).length > 0) {
              // Initiate all fields as touched if the form is loading values
              const touchedKeys = Object.keys(schemaObj) || [];
              const touchedValues = touchedKeys.reduce((acc, curr) => {
                acc[curr] = true;
                return acc;
              }, {});
              setTouched(touchedValues);

              // Sync form values and set form save into edit mode
              syncFormState({
                values,
                touched,
                dirty,
                errors,
                isUpdate: true,
              });
            }
          }}
          values={values}
          touched={touched}
          dirty={dirty}
          errors={errors}
          didUpdate={({ props, prevProps }) => {
            // Sync form values on change
            if (props.values !== prevProps.values) {
              syncFormState({
                values,
                touched,
                dirty,
                errors,
              });
            }

            // Sync form touched/dirty/error state on changes to errors (validation)
            if (Object.keys(props.errors).length !== Object.keys(prevProps.errors).length) {
              syncFormState({
                values,
                touched,
                dirty,
                errors,
              });
            }
          }}
        >
          <FormContainer>
            <TabHeader
              title={`Model Admin`}
              updatedAt={
                Object.keys(values).length > 0 && values[updatedAt.accessor]
                  ? values[updatedAt.accessor]
                  : undefined
              }
            />
            <FormSection>
              <FormCol>
                <FormComponent labelText={name.displayName}>
                  <Field
                    name={name.accessor}
                    disabled={didLoad}
                    component={FormInput}
                    errorText="This model already exists"
                  />
                </FormComponent>

                <FormComponent labelText={expanded.displayName}>
                  <Field
                    name={expanded.accessor}
                    component={FormRadioSelect}
                    options={booleanChoice}
                  />
                </FormComponent>
              </FormCol>
              <FormCol noBorder>
                <MatchedModelsFormComponent
                  currentModel={values.name}
                  modelsData={otherModelOptions}
                />
              </FormCol>
            </FormSection>

            <FormHeader>
              <h2>Model Details</h2>
            </FormHeader>
            <FormSection>
              <FormCol>
                <FormComponent labelText={type.displayName}>
                  <Field name={type.accessor} component={FormSelect} options={modelTypeOptions} />
                </FormComponent>

                <FormComponent labelText={split_ratio.displayName}>
                  <Field
                    name={split_ratio.accessor}
                    component={FormRadioSelect}
                    options={splitRatioOptions}
                  />
                </FormComponent>

                <FormComponent labelText={time_to_split.displayName}>
                  <Field name={time_to_split.accessor} component={FormInput} />
                </FormComponent>

                <FormComponent
                  labelText={growth_rate.displayName}
                  description="This must be a number between 1 and 99"
                >
                  <Field name={growth_rate.accessor} component={FormInput} type="number" step={1} />
                </FormComponent>
              </FormCol>

              <FormCol>
                <FormComponent labelText={molecular_characterizations.displayName}>
                  <Field
                    name={molecular_characterizations.accessor}
                    component={FormMultiCheckbox}
                    options={molecularCharacterizationsOptions}
                  />
                </FormComponent>
              </FormCol>
            </FormSection>

            <FormHeader>
              <h2>Patient Details</h2>
            </FormHeader>
            <FormSection>
              <FormCol>
                <FormComponent labelText={gender.displayName}>
                  <Field
                    name={gender.accessor}
                    component={genderOptions.length > 5 ? FormSelect : FormRadioSelect}
                    options={genderOptions}
                  />
                </FormComponent>

                <FormComponent labelText={race.displayName}>
                  <Field name={race.accessor} component={FormSelect} options={raceOptions} />
                </FormComponent>

                <FormComponent labelText={age_at_diagnosis.displayName}>
                  <Field
                    name={age_at_diagnosis.accessor}
                    component={FormInput}
                    type="number"
                    step={1}
                  />
                </FormComponent>

                <FormComponent labelText={age_at_sample_acquisition.displayName}>
                  <Field
                    name={age_at_sample_acquisition.accessor}
                    component={FormInput}
                    type="number"
                    step={1}
                  />
                </FormComponent>

                <FormComponent labelText={disease_status.displayName}>
                  <Field
                    name={disease_status.accessor}
                    component={FormRadioSelect}
                    options={diseaseStatusOptions}
                  />
                </FormComponent>

                <FormComponent labelText={vital_status.displayName}>
                  <Field
                    name={vital_status.accessor}
                    component={FormRadioSelect}
                    options={vitalStatusOptions}
                  />
                </FormComponent>

                <FormComponent labelText={neoadjuvant_therapy.displayName}>
                  <Field
                    name={neoadjuvant_therapy.accessor}
                    component={FormRadioSelect}
                    options={neoadjuvantTherapyOptions}
                  />
                </FormComponent>

                <FormComponent labelText={chemotherapeutic_drugs.displayName}>
                  <Field
                    name={chemotherapeutic_drugs.accessor}
                    component={FormRadioSelect}
                    options={booleanChoice}
                  />
                </FormComponent>
              </FormCol>

              <FormCol>
                <FormComponent labelText={therapy.displayName}>
                  <Field
                    name={therapy.accessor}
                    component={FormMultiCheckbox}
                    options={therapyOptions}
                  />
                </FormComponent>

                <FormComponent labelText={clinical_tumor_diagnosis.displayName}>
                  <Field
                    name={clinical_tumor_diagnosis.accessor}
                    component={FormSelect}
                    options={clinicalTumorDiagnosisOptions}
                  />
                </FormComponent>

                <FormComponent labelText={histological_type.displayName}>
                  <Field
                    name={histological_type.accessor}
                    component={FormSelect}
                    disabled={isClinicalTumorDiagnosisSelected(values)}
                    options={makeClinicalTumorDiagnosisDependentOptions(
                      values.clinical_tumor_diagnosis,
                      'histological type',
                    )}
                  />
                </FormComponent>

                <FormComponent labelText={clinical_stage_grouping.displayName}>
                  <Field
                    name={clinical_stage_grouping.accessor}
                    component={FormSelect}
                    disabled={isClinicalTumorDiagnosisSelected(values)}
                    options={makeClinicalTumorDiagnosisDependentOptions(
                      values.clinical_tumor_diagnosis,
                      'clinical stage grouping',
                    )}
                  />
                </FormComponent>

                <FormComponent labelText={tumor_histological_grade.displayName}>
                  <Field
                    name={tumor_histological_grade.accessor}
                    component={FormSelect}
                    disabled={isClinicalTumorDiagnosisSelected(values)}
                    options={makeClinicalTumorDiagnosisDependentOptions(
                      values.clinical_tumor_diagnosis,
                      'tumor histological grade',
                    )}
                  />
                </FormComponent>

                <FormComponent labelText={site_of_sample_acquisition.displayName}>
                  <Field
                    name={site_of_sample_acquisition.accessor}
                    component={FormSelect}
                    disabled={isClinicalTumorDiagnosisSelected(values)}
                    options={makeClinicalTumorDiagnosisDependentOptions(
                      values.clinical_tumor_diagnosis,
                      'site of sample acquisition',
                    )}
                  />
                </FormComponent>

                <FormComponent labelText={tissue_type.displayName}>
                  <Field
                    name={tissue_type.accessor}
                    component={FormSelect}
                    options={tissueTypesOptions}
                  />
                </FormComponent>

                <FormComponent
                  labelText={primary_site.displayName}
                  description="Start typing for valid options"
                >
                  <Field
                    name={primary_site.accessor}
                    component={FormAutoComplete}
                    options={primarySitesOptions}
                    errorText="Values must match a predefined primary site"
                  />
                </FormComponent>

                <FormComponent labelText={tnm_stage.displayName}>
                  <Field name={tnm_stage.accessor} component={FormInput} />
                </FormComponent>
              </FormCol>
            </FormSection>

            <FormHeader>
              <h2>Repository Status</h2>
            </FormHeader>
            <FormSection>
              <FormCol>
                <FormComponent labelText={date_of_availability.displayName}>
                  <Field name={date_of_availability.accessor} component={FormDateInput} />
                </FormComponent>
              </FormCol>

              <FormCol>
                <FormComponent labelText={licensing_required.displayName}>
                  <Field
                    name={licensing_required.accessor}
                    component={FormRadioSelect}
                    options={booleanChoice}
                  />
                </FormComponent>
              </FormCol>
            </FormSection>
            <FormHeader>
              <h2>External Resources</h2>
            </FormHeader>
            <FormSection>
              <FormCol>
                <FormComponent
                  labelText={distributor_part_number.displayName}
                  description="Please provide the ATCC ID, e.g. PDM-146"
                >
                  <Field
                    name={distributor_part_number.accessor}
                    component={FormInput}
                    placeholder="PDM-146"
                  />
                </FormComponent>
                {values[distributor_part_number] && (
                  <a href={`https://www.atcc.org/products/all/${values[distributor_part_number]}`}>
                    {values[distributor_part_number]}
                  </a>
                )}

                <FormComponent
                  labelText={source_model_url.displayName}
                  description="Please provide a model url to GDC or EGA"
                >
                  <Field
                    name={source_model_url.accessor}
                    component={FormInput}
                    placeholder={`http://model_url.example.com`}
                  />
                </FormComponent>

                <FormComponent
                  labelText={proteomics_url.displayName}
                  description="Please provide a url to the GDC webpage containing Proteomics data for this model."
                >
                  <Field
                    name={proteomics_url.accessor}
                    component={FormInput}
                    placeholder={`http://proteomics_url.example.com`}
                  />
                </FormComponent>
              </FormCol>

              <FormCol>
                <FormComponent
                  labelText={source_sequence_url.displayName}
                  description="Please provide a sequence url to GDC or EGA"
                >
                  <Field
                    name={source_sequence_url.accessor}
                    component={FormInput}
                    placeholder={`http://sequence_url.example.com`}
                  />
                </FormComponent>

                <FormComponent
                  labelText={somatic_maf_url.displayName}
                  description="Please provide a url to GDC filtered on the open somatic MAF."
                >
                  <Field
                    name={somatic_maf_url.accessor}
                    component={FormInput}
                    placeholder={`http://maf_url.example.com`}
                  />
                </FormComponent>
              </FormCol>
            </FormSection>
          </FormContainer>
        </Component>
      )}
    </ModelSingleContext.Consumer>
  );
};

export default withFormik({
  mapPropsToValues: ({ data }) => data || {},
  validate: (values, { validator }) => {
    try {
      validator.validateSync(values, { abortEarly: false });
    } catch (error) {
      return error.inner.reduce((acc, inner) => ({ ...acc, [inner.path]: inner.message }), {});
    }
  },
  displayName: 'ModelForm',
})(ModelFormTemplate);
