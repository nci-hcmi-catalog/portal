import React from 'react';
import { withFormik, Field } from 'formik';
import {
  FormComponent,
  FormTextInput,
  FormSelect,
  FormRadioSelect,
  FormMultiCheckbox,
} from 'components/FormComponents';
import { ModelForm, FormHeader, FormSection, FormCol } from 'theme/adminModelFormStyles';
import modelValidation from '@hcmi-portal/cms/src/validation/model';
import { schemaObj } from '../schema/model';
import {
  clinicalTumorDiagnosisDependent,
  clinicalTumorDiagnosis as clinicalTumorDiagnosisOptions,
  modelType as modelTypeOptions,
  molecularCharacterizations as molecularCharacterizationsOptions,
  splitRatio as splitRatioOptions,
  gender as genderOptions,
  race as raceOptions,
  neoadjuvantTherapy as neoadjuvantTherapyOptions,
  diseaseStatus as diseaseStatusOptions,
  vitalStatus as vitalStatusOptions,
  therapy as therapyOptions,
} from '@hcmi-portal/cms/src/schemas/constants';

const booleanChoice = [{ name: 'Yes', value: true }, { name: 'No', value: false }];

const makeClinicalTumorDiagnosisDependentOptions = (clinical_tumor_diagnosis, fieldName) =>
  (clinicalTumorDiagnosisDependent[fieldName][clinical_tumor_diagnosis] || []).map(v =>
    v.toLowerCase(),
  );

const isClinicalTumorDiagnosisSelected = values =>
  !values.clinical_tumor_diagnosis || values.clinical_tumor_diagnosis === '0';

// All labels/keys from model schema
const {
  model_name,
  model_type,
  split_ratio,
  growth_rate,
  primary_site,
  neoadjuvant_therapy,
  tmn_stage,
  molecular_characterizations,
  chemotherapeutic_drugs,
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
  source_model_url,
  source_sequence_url,
} = schemaObj;

const modelFormTemplate = ({
  values,
  //touched,
  //errors,
  //dirty,
  //isSubmitting,
  //handleChange,
  //handleBlur,
  //handleSubmit,
  //handleReset,
}) => (
  <ModelForm>
    <FormHeader>
      <h2>Model Details</h2>
    </FormHeader>
    <FormSection>
      <FormCol>
        <FormComponent
          labelText={model_name.displayName}
          description="Optional description of form field."
        >
          <Field name={model_name.accessor} component={FormTextInput} />
        </FormComponent>

        <FormComponent labelText={model_type.displayName}>
          <Field name={model_type.accessor} component={FormSelect} options={modelTypeOptions} />
        </FormComponent>

        <FormComponent labelText={split_ratio.displayName}>
          <Field
            name={split_ratio.accessor}
            component={FormRadioSelect}
            options={splitRatioOptions}
          />
        </FormComponent>

        <FormComponent
          labelText={growth_rate.displayName}
          description="This must be a number between 5 and 90"
        >
          <Field name={growth_rate.accessor} component={FormTextInput} />
        </FormComponent>

        <FormComponent labelText={primary_site.displayName}>
          <Field name={primary_site.accessor} component={FormTextInput} />
        </FormComponent>

        <FormComponent labelText={neoadjuvant_therapy.displayName}>
          <Field
            name={neoadjuvant_therapy.accessor}
            component={FormRadioSelect}
            options={neoadjuvantTherapyOptions}
          />
        </FormComponent>

        <FormComponent labelText={tmn_stage.displayName}>
          <Field name={tmn_stage.accessor} component={FormTextInput} />
        </FormComponent>
      </FormCol>

      <FormCol>
        <FormComponent labelText={molecular_characterizations.displayName}>
          <Field
            name={molecular_characterizations.accessor}
            component={FormMultiCheckbox}
            options={molecularCharacterizationsOptions}
            values={values}
          />
        </FormComponent>

        <FormComponent labelText={chemotherapeutic_drugs.displayName}>
          <Field
            name={chemotherapeutic_drugs.accessor}
            component={FormRadioSelect}
            options={booleanChoice}
          />
        </FormComponent>

        <FormComponent labelText={clinical_tumor_diagnosis.displayName}>
          <Field
            name={clinical_tumor_diagnosis.accessor}
            component={FormSelect}
            options={clinicalTumorDiagnosisOptions}
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
      </FormCol>
    </FormSection>

    <FormHeader>
      <h2>Patient Details</h2>
    </FormHeader>
    <FormSection>
      <FormCol>
        <FormComponent labelText={age_at_diagnosis.displayName}>
          <Field name={age_at_diagnosis.accessor} component={FormTextInput} />
        </FormComponent>

        <FormComponent labelText={age_at_sample_acquisition.displayName}>
          <Field name={age_at_sample_acquisition.accessor} component={FormTextInput} />
        </FormComponent>

        <FormComponent labelText={vital_status.displayName}>
          <Field
            name={vital_status.accessor}
            component={FormRadioSelect}
            options={vitalStatusOptions}
          />
        </FormComponent>

        <FormComponent labelText={disease_status.displayName}>
          <Field
            name={disease_status.accessor}
            component={FormRadioSelect}
            options={diseaseStatusOptions}
          />
        </FormComponent>
      </FormCol>

      <FormCol>
        <FormComponent labelText={gender.displayName}>
          <Field name={gender.accessor} component={FormRadioSelect} options={genderOptions} />
        </FormComponent>

        <FormComponent labelText={race.displayName}>
          <Field name={race.accessor} component={FormSelect} options={raceOptions} />
        </FormComponent>

        <FormComponent labelText={therapy.displayName}>
          <Field
            name={therapy.accessor}
            component={FormMultiCheckbox}
            options={genderOptions}
            values={values}
          />
        </FormComponent>
      </FormCol>
    </FormSection>

    <FormHeader>
      <h2>Model Administration</h2>
    </FormHeader>
    <FormSection>
      <FormCol>
        <FormComponent labelText={date_of_availability.displayName}>
          <Field name={date_of_availability.accessor} type="date" />
        </FormComponent>

        <FormComponent labelText={licensing_required.displayName}>
          <Field
            name={licensing_required.accessor}
            component={FormRadioSelect}
            options={booleanChoice}
          />
        </FormComponent>
      </FormCol>

      <FormCol>
        <label>External Resources</label>

        <FormComponent labelText={source_model_url.displayName}>
          <Field name={source_model_url.accessor} component={FormTextInput} />
        </FormComponent>

        <FormComponent labelText={source_sequence_url.displayName}>
          <Field name={source_sequence_url.accessor} component={FormTextInput} />
        </FormComponent>
      </FormCol>
    </FormSection>
  </ModelForm>
);

export default withFormik({
  mapPropsToValues: () => ({}),
  validate: values => {
    try {
      modelValidation.validateSync(values, { abortEarly: false });
    } catch (error) {
      return error.inner.reduce((acc, inner) => ({ ...acc, [inner.path]: inner.message }), {});
    }
  },
  handleSubmit: (values, { setSubmitting }) => {
    setTimeout(() => {
      alert(JSON.stringify(values, null, 2));
      setSubmitting(false);
    }, 1000);
  },
  displayName: 'ModelForm',
})(modelFormTemplate);
