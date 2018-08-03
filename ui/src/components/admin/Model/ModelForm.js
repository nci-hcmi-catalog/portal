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
import {
  clinicalTumorDiagnosis,
  clinicalTumorDiagnosisDependent,
  modelType,
  molecularCharacterizations,
  splitRatio,
  gender,
  race,
  neoadjuvantTherapy,
  diseaseStatus,
  vitalStatus,
  therapy,
} from '@hcmi-portal/cms/src/schemas/constants';

const booleanChoice = ['Yes', 'No'];

const makeClinicalTumorDiagnosisDependentOptions = (clinical_tumor_diagnosis, fieldName) =>
  (clinicalTumorDiagnosisDependent[fieldName][clinical_tumor_diagnosis] || []).map(v =>
    v.toLowerCase(),
  );

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
        <FormComponent labelText="Name" description="Optional description of form field.">
          <Field name="model_name" component={FormTextInput} />
        </FormComponent>

        <FormComponent labelText="Model Type">
          <Field name="model_type" component={FormSelect} options={modelType} />
        </FormComponent>

        <FormComponent labelText="Split Ratio">
          <Field name="split_ratio" component={FormRadioSelect} options={splitRatio} />
        </FormComponent>

        <FormComponent
          labelText="Model Growth Rate"
          description="This must be a number between 5 and 90"
        >
          <Field name="growth_rate" component={FormTextInput} />
        </FormComponent>

        <FormComponent labelText="Primary Site">
          <Field name="primary_site" component={FormTextInput} />
        </FormComponent>

        <FormComponent labelText="Neoadjuvant Therapy">
          <Field
            name="neoadjuvant_therapy"
            component={FormRadioSelect}
            options={neoadjuvantTherapy}
          />
        </FormComponent>

        <FormComponent labelText="TMN Stage (NEEDS CUSTOM COMPONENT)">
          <Field name="tmn_stage" component={FormTextInput} />
        </FormComponent>
      </FormCol>

      <FormCol>
        <FormComponent labelText="Molecular Characterization">
          <Field
            name="molecular_characterizations"
            component={FormMultiCheckbox}
            options={molecularCharacterizations}
          />
        </FormComponent>

        <FormComponent labelText="Chemotherapeutic Drugs">
          <Field
            name="chemotherapeutic_drugs"
            component={FormRadioSelect}
            options={booleanChoice}
          />
        </FormComponent>

        <FormComponent labelText="Clinical Tumor Diagnosise">
          <Field
            name="clinical_tumor_diagnosis"
            component={FormSelect}
            options={clinicalTumorDiagnosis}
          />
        </FormComponent>

        <FormComponent labelText="Sample Acquisition Site">
          <Field
            name="site_of_sample_acquisition"
            component={FormSelect}
            disabled={!values.clinical_tumor_diagnosis}
            options={makeClinicalTumorDiagnosisDependentOptions(
              values.clinical_tumor_diagnosis,
              'site of sample acquisition',
            )}
          />
        </FormComponent>

        <FormComponent labelText="Histological Type">
          <Field
            name="histological_type"
            component={FormSelect}
            disabled={!values.clinical_tumor_diagnosis}
            options={makeClinicalTumorDiagnosisDependentOptions(
              values.clinical_tumor_diagnosis,
              'histological type',
            )}
          />
        </FormComponent>

        <FormComponent labelText="Histological Grade">
          <Field
            name="tumor_histological_grade"
            component={FormSelect}
            disabled={!values.clinical_tumor_diagnosis}
            options={makeClinicalTumorDiagnosisDependentOptions(
              values.clinical_tumor_diagnosis,
              'tumor histological grade',
            )}
          />
        </FormComponent>

        <FormComponent labelText="Clinical Stage">
          <Field
            name="clinical_stage_grouping"
            component={FormSelect}
            disabled={!values.clinical_tumor_diagnosis}
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
        <FormComponent labelText="Age at Diagnosis">
          <Field name="age_at_diagnosis" component={FormTextInput} />
        </FormComponent>

        <FormComponent labelText="Age at Sample Acquisition">
          <Field name="age_at_sample_acquisition" component={FormTextInput} />
        </FormComponent>

        <FormComponent labelText="Vital Status">
          <Field name="vital_status" component={FormRadioSelect} options={vitalStatus} />
        </FormComponent>

        <FormComponent labelText="Disease Status">
          <Field name="disease_status" component={FormRadioSelect} options={diseaseStatus} />
        </FormComponent>
      </FormCol>

      <FormCol>
        <FormComponent labelText="Gender">
          <Field name="gender" component={FormRadioSelect} options={gender} />
        </FormComponent>

        <FormComponent labelText="Race">
          <Field name="race" component={FormSelect} options={race} />
        </FormComponent>

        <FormComponent labelText="Therapy">
          <Field name="therapy" component={FormMultiCheckbox} options={therapy} />
        </FormComponent>
      </FormCol>
    </FormSection>

    <FormHeader>
      <h2>Model Administration</h2>
    </FormHeader>
    <FormSection>
      <FormCol>
        <FormComponent labelText="Date Available (NEEDS CUSTOM COMPONENT)">
          <Field name="date_of_availability" type="date" />
        </FormComponent>

        <FormComponent labelText="Licensing Requirements">
          <Field name="licensing_required" component={FormRadioSelect} options={booleanChoice} />
        </FormComponent>
      </FormCol>

      <FormCol>
        <label>External Resources</label>
        TWO URLS CURRENTLY NOT IN YUP SCHEMA
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
