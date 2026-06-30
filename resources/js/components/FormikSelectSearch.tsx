import React, { ChangeEvent } from 'react';
import { useField, FieldHookConfig } from 'formik';
import Select, { SingleValue, ActionMeta, StylesConfig } from 'react-select';
import { IOption, IOptionType } from '@/types/App';


type FormikSearchSelectProps =  FieldHookConfig<string | number> & {
  label?: string;
  options: IOption[];
  placeholder?: string;
  name: string;
  isSearchable?: boolean;
}

const FormikSearchSelect: React.FC<FormikSearchSelectProps> = ({ label, options, ...props }) => {
  // useField returns [fieldProps, metaProps, helperProps]
  const [field, meta, helpers] = useField(props.name as string);
  const { setValue, setTouched } = helpers;


  // Sync react-select's object-based value with Formik's primitive value
  const onChange = (
    newValue: SingleValue<IOption>, 
    actionMeta: ActionMeta<IOption>
  ) => {
    setValue(newValue ? newValue.value : '');
    // debugger;
    const mockEvent = {
      target: {
        name: actionMeta.name,
        label: newValue && newValue.label ? newValue.label as string : '',
        value: newValue ? newValue.value as any: ''
      },
      currentTarget: {
        name: actionMeta.name,
        label: newValue?.label as string,
        value: newValue?.value as any
      } 
    }as unknown as React.ChangeEvent<HTMLSelectElement>;
    if(typeof props.onChange == 'function')
      props.onChange(mockEvent as any);
  };

  const customStyles: StylesConfig<IOptionType, false> = {
    control: (baseStyles, state) => ({
        backgroundColor: 'white'
    }),
    option: (baseStyles, state) => ({
        ...baseStyles,
        backgroundColor: 'white'
    })
  }

  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && <label htmlFor={props.name}>{label}</label>}
      <Select
        // {...props}
        name={field.name}
        options={options}
        // Match the current Formik value (string/number) back to the Option object
        value={options.find((opt) => opt.value === field.value) || null}
        onChange={onChange}
        onBlur={() => setTouched(true)}
        // defaultValue={(props.ref.current)}
        isSearchable={props.isSearchable ? props.isSearchable: true}
        placeholder={props.placeholder}
        className='country-input'
        // isMulti={props.multiple}
      />
      
      {/* Validation Error Display */}
      {meta.touched && meta.error ? (
        <small style={{ color: 'red', fontSize: '0.8rem', marginTop: '4px' }}>
          {meta.error}
        </small>
      ) : null}
    </div>
  );
};

export default FormikSearchSelect;