import React from 'react';
import { withFormik, Field, Form } from 'formik';
import { FormComponent, FormSelect } from 'components/FormComponents';
import { Col } from 'theme/system';
import { FormHeader, FormBody } from 'theme/adminModelFormStyles';
import modelValidation from '@hcmi-portal/cms/src/validation/model';
import { molecularCharacterizations } from '@hcmi-portal/cms/src/schemas/constants';

const modelFormTemplate = ({
  values,
  touched,
  errors,
  dirty,
  isSubmitting,
  handleChange,
  handleBlur,
  handleSubmit,
  handleReset,
}) => (
  <Form>
    <FormHeader>
      <h2>Model Details</h2>
    </FormHeader>
    <FormBody>
      <Col>
        <FormComponent labelText="Name" description="Optional description of form field.">
          <Field name="model_name" />
        </FormComponent>
        <FormComponent labelText="Model Type">
          <Field name="model_type" />
        </FormComponent>
      </Col>
      <Col>
        <FormComponent labelText="Molecular Characterization">
          <Field
            name="molecular_characterizations"
            component={FormSelect}
            options={molecularCharacterizations}
          />
        </FormComponent>
      </Col>
    </FormBody>
  </Form>
);

const ModelForm = withFormik({
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

export default () => <ModelForm />;
