// import React from "react";
// import { useField } from "formik";
// import Select from "react-select";

// const SelectField = ({ label: any, options: any, isMulti = false, ...props }) => {
//   const [field, meta, { setValue, setTouched }] = useField(props.name);

//   // eslint-disable-next-line no-console
//   const onChange = (option) => {
//     // Set Formik field value
//     // eslint-disable-next-line no-console
//     setValue(isMulti ? option.map((item) => item.value) : option.value);
//   };

//   const onBlur = () => {
//     // Set the field as touched for validation
//     setTouched(true);
//   };

//   const getValue = () => {
//     // eslint-disable-next-line no-console
//     if (options) {
//       return isMulti
//         ? options.filter((option: <{value: string}>) => field.value?.indexOf(option.value) >= 0)
//         : options.find((option: <{value: string}>) => option.value === field.value) || null;
//     } else {
//       return isMulti ? [] : null;
//     }
//   };

//   return (
//     <div>
//       {label && <label htmlFor={props.id || props.name}>{label}</label>}
//       <Select
//         {...props}
//         name={field.name}
//         value={getValue()}
//         onChange={onChange}
//         onBlur={onBlur}
//         options={options}
//         isMulti={isMulti}
//       />
//       {meta.touched && meta.error ? (
//         <div style={{ color: 'red', marginTop: '0.25rem' }}>{meta.error}</div>
//       ) : null}
//     </div>
//   );
// };

// export default SelectField;