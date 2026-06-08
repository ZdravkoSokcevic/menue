import React, { BaseSyntheticEvent, ChangeEventHandler } from "react";
import Modal from "react-modal";
import { Formik, Form, Field, FormikProps, FieldArray, ErrorMessage } from 'formik';
import * as Yup from "yup";

import { FaSave } from "react-icons/fa";
import { Button, Input, TextField } from "@mui/material";

import "../../../sass/modal.scss"
import "../../../sass/menu_translation.scss"
import MediaHelper from "@/helpers/MediaHelper";
import MenuAPI from "@/api/MenuAPI";
import LanguagesAPI from "@/api/LanguagesAPI";
import { IMenuDataTranslations, IMenuTranslation, IMenuTranslations, MenuCreateResponseItem, TMenu } from "@/types/Menu";
import { Store } from "@/reducers/Store";
import { disableLoading, enableLoading } from "@/reducers/appSlice";
import { AxiosResponse } from "axios";
import { WidthHeight } from "@/types/Media";
import CategoriesAPI from "@/api/CategoriesAPI";
import { Option } from "@/types/App";
import { ICategory, TCategories } from "@/types/Categories";
import FormikSearchSelect from "../FormikSelectSearch";
import { IExtra, IMenuExtra, TExtras, TMenuExtras } from "@/types/Extra";
import ExtrasAPI from "@/api/ExtrasAPI";
import PreferencesAPI from "@/api/PreferencesAPI";
import IngridientsAPI from "@/api/IngridientsAPI";
import { IIngridient, TIngridients, TMenuIngridients } from "@/types/Ingridient";
import { IPreference, TMenuPreferences, TPreferences } from "@/types/Preference";
import { GoPlus } from "react-icons/go";
import { IPrice } from "@/types/Prices";

import { languages } from "@/data/Languages";
import { ILang, ILanguages } from "@/types/Languages";
import { ICountry, TCountries } from "@/types/TCountries";

interface IInitialValues {
    translations: IMenuTranslations;
}

interface IProps {
    // can be page or modal
    currentItem: TMenu
    closeModal?: Function;
    editTranslationItem: Function;
};
interface IState {
    key: number;
    isLanguagesChooserModalOpened: boolean;
    countries: TCountries;
    selectedCountry: ICountry;
    currentInitialValues: IInitialValues
};

// const translationShape: any = {};

// languages.forEach((lang: ILang) => {
//     let code: string = lang.code;
//     translationShape[code as any] = Yup.object().shape({

//         name: lang.required
//             ? Yup.string().required('Required')
//             : Yup.string(),

//         description: lang.required
//             ? Yup.string().required('Required')
//             : Yup.string()
//     });
// });

// const initialValues: IInitialValues = {
//     translations: languages.reduce((acc: IMenuTranslations, lang: ILang) => {
//         acc[lang.code] = {
//             name: '',
//             description: ''
//         }
//         return acc;
//     }, {} as IMenuTranslations)
// }

// Solution 2
// const initialValues: IInitialValues = {
//     translations: Object.fromEntries(
//         languages.map(lang => [
//             lang.code,
//             { name: '', description: '' }
//         ])
//     )
// };

// const menuLanguagesValidationSchema = Yup.object({
//     translations: Yup.object().shape(
//         translationShape
//     )
// });

class MenuTranslation extends React.Component<IProps, IState>
{
    private fileInputRef = React.createRef<HTMLInputElement>();
    private formikRef = React.createRef<FormikProps<IInitialValues>>();
    private categoryInputRef = React.createRef<HTMLSelectElement>();


    constructor(props: IProps) {
        super(props);
        this.state = {
            key: Math.random(),
            isLanguagesChooserModalOpened: false,
            countries: [],
            selectedCountry: {} as ICountry,
            currentInitialValues: { } as IInitialValues,
        }
        // this.handleImageLoad = this.handleImageLoad.bind(this);
        // this.handleFileLoad = this.handleFileLoad.bind(this);
        this.formikRef.current?.setFieldValue('picture', null);
    }


    refreshFieldset = () => {
        this.setState({key: Math.random()});
    }

    closeModal() {
        if(this.props.closeModal)
            this.props.closeModal();
    }

    componentDidMount(): void {

        // Need to do special adjustments on init
        this.initFormData();
        this.loadLanguages();
    }

    getValidationSchema = () => {

        const translationShape: any = {};

        this.state.countries.forEach((country: ICountry) => {
            // let tld = country.tld;
            let code = country.language?.code;
            if(!code) {
                console.log('LANG NOT exists');
            }else {
                if(country.mandatory)
                    return;
                translationShape[code as any] = Yup.object().shape({
    
                    name: country.mandatory
                        ? Yup.string().required(`${country.common_name} name is required`).min(2, `${country.common_name} nameTest must be at least 5 characters long`)
                        : Yup.string(),
    
                    description: country.mandatory
                        ? Yup.string()
                            .required(`${country.common_name} description is required`).min(5, `${country.common_name} description must be at least 5 characters long`)
                        : Yup.string()
    
                });
            }


        });

        return Yup.object().shape({

            translations: Yup.object().shape(
                translationShape
            )

        });
    }

    initFormData() {
        this.formikRef.current?.setFieldTouched('name', true);
        this.formikRef.current?.setFieldTouched('description');

        const item = this.props.currentItem;
        // enable included ingridients to be checked
    }
    

    render(): React.ReactNode {
        // Create a NEW object reference here
        const hasExistingPicture = !!this.props.currentItem.picture;
        const currentInitialValues: IInitialValues = {} as IInitialValues;

        // Parse and process initial values
        const initialValues = {translations : (!Array.isArray(this.props.currentItem.translations)) ? this.props.currentItem.translations : {}} as IInitialValues;
        // const initialValues = {translations : {}} as IInitialValues;
        

        const schema = this.getValidationSchema();
        const described = schema.describe() as any;

        return (
                <div className="form-page">


                    <h2>Translations</h2>
                    <button className="close-btn" onClick={() => this.closeModal()}>x</button>

                    <Formik 
                        initialValues={initialValues}
                        validationSchema={() => this.getValidationSchema()}
                        onSubmit={this.onSubmit}
                        innerRef={this.formikRef}
                        validateOnMount={true}   // IMPORTANT: Don't validate on load
                        validateOnBlur={true}    // IMPORTANT: Don't validate when clicking away
                        validateOnChange={true}  // IMPORTANT: Don't validate while typing
                        enableReinitialize={true}
                    >

                    {({ errors, touched, setFieldValue, isSubmitting, isValid, dirty, values }) => (

                        <Form encType="multipart/form-data">
                        <div className="container-fluid">
                            <div className="row">
                                {/* LEFT SIDE (NAME AND DESCRIPTION) */}
                                <div className="col-md-5 border-end p-5">
                                    <div className="mb-4">
                                        <h5 className="fw-bold text-dark">Menu item overview</h5>
                                        <p className="text-muted mb-0">
                                            Fill in the translations for name and description on the right side.
                                        </p>
                                    </div>

                                    <div className="mt-5">
                                        <div className="mb-4">
                                            <div className="text-uppercase text-muted small mb-1">{this.props.currentItem.name}</div>
                                            <div className="fw-semibold text-dark">
                                                This is the visible title of the item
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <div className="text-uppercase text-muted small mb-1">{this.props.currentItem.description}</div>
                                            <div className="text-muted">
                                                Short explanation shown to users in menu or listing
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-7 p-5">
                                    <div className="col-12 menu-translations">
                                        {this.state.countries.map((country) => {
                                            if(country.mandatory)
                                                return(
                                                    <span 
                                                        className={"translation-item " + ((this.state.selectedCountry.id == country.id) ? 'active' : '')}
                                                        onClick={() => this.setState({ selectedCountry: country })} 
                                                        title={country.common_name}  
                                                        style={{width: 40}} 
                                                    >
                                                        <img 
                                                            src={country.flag_png} 
                                                            width={40}
                                                        /> &nbsp;
                                                    </span>
                                                )
                                        })}
                                    </div>
                                    {this.state.countries.map((country: ICountry) => {
                                        if(country.mandatory && this.state.selectedCountry.id == country.id) {
                                            console.log(country);
                                            return (
                                                <div
                                                    key={country.id}
                                                    className="card mb-4 mt-2"
                                                >
    
                                                    <div className="card-header d-flex justify-content-between">
    
                                                        <strong>
                                                            {country.common_name}
                                                        </strong>
    
                                                        {country.mandatory && (
                                                            <span className="badge bg-danger">
                                                                Required
                                                            </span>
                                                        )}
    
                                                    </div>
    
                                                    <div className="card-body">
    
                                                        {/* NAME */}
    
                                                        <div className="mb-3">
    
                                                            <label className="form-label">
                                                                Name
                                                            </label>
    
                                                            <Field
                                                                name={`translations.${country.language?.code}.name`}
                                                                className="form-control"
                                                            />
    
                                                            <ErrorMessage
                                                                name={`translations.${country.language?.code}.name`}
                                                                component="div"
                                                                className="text-danger small mt-1"
                                                            />
    
                                                        </div>
    
                                                        {/* DESCRIPTION */}
    
                                                        <div className="mb-3">
    
                                                            <label className="form-label">
                                                                Description
                                                            </label>
    
                                                            <Field
                                                                as="textarea"
                                                                rows={3}
                                                                name={`translations.${country.language?.code}.description`}
                                                                className="form-control"
                                                            />
    
                                                            <ErrorMessage
                                                                name={`translations.${country.language?.code}.description`}
                                                                component="div"
                                                                className="text-danger small mt-1"
                                                            />
    
                                                        </div>
    
                                                    </div>
                                                    {Object.keys(errors).length > 0 && (
                                                    <div className="alert alert-danger mt-3" role="alert">
                                                        <h5 className="alert-heading font-weight-bold mb-2">Please fix the following errors:</h5>
                                                        <ul className="mb-0 pl-3">
                                                        {Object.entries(errors).map(([key, value]) => {
                                                            // If your errors are nested (like translations.us.name)
                                                            if (typeof value === 'object' && value !== null) {
                                                            return Object.entries(value).map(([countryCode, countryErrors]) => {
                                                                if (typeof countryErrors === 'object' && countryErrors !== null) {
                                                                return Object.entries(countryErrors).map(([field, message]) => (
                                                                    <li key={`${countryCode}-${field}`} className="mb-1">
                                                                    {String(message)}
                                                                    </li>
                                                                ));
                                                                }
                                                                return null;
                                                            });
                                                            }
                                                            
                                                            // Fallback for flat root-level errors
                                                            return <li key={key} className="mb-1">{String(value)}</li>;
                                                        })}
                                                        </ul>
                                                    </div>
                                                    )}
    
                                                </div>
                                            )
                                        }
                                    })}


                                    {/* {'Is submitting: ' + isSubmitting}<br />
                                    {'Is valid: ' + isValid} <br />
                                    {'Is dirty: ' + dirty} <br />
                                    { 'Errors: ' + JSON.stringify(errors) }
                                    {'Values: ' + JSON.stringify(values)}
                                    { 'CurrentItem' + JSON.stringify(this.props.currentItem) } */}
                                    <div className="controls">
                                        <button className="submit" type="submit" disabled={false}>
                                            <FaSave />
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </Form>
                    )}
                    </Formik>
                </div>  
        )
    }

    // Here event is object that contains values
    onSubmit = async(event: any) => {
        // debugger;


        // const data: IMenuTranslations = {} as IMenuTranslations;

        const data: IMenuDataTranslations = event;

        // for(let input in event.translations) {
        //     data[input] = event;
        // }
        Store.dispatch(enableLoading({}));
        const res= await MenuAPI.addOrEditTranslations(this.props.currentItem.id, data as IMenuDataTranslations);
        // const res = {success: false, data: {} };
        setTimeout(() => {
            Store.dispatch(disableLoading({}));
        }, 500)

        // if modal is case
        if(res && res.success == true)  {
            const responseData: IMenuTranslations = res.data as IMenuTranslations;
            this.props.editTranslationItem(responseData.item);
            this.closeModal();
        }
        else {
            alert('Unexpected error occured!');
            // this.closeModal();
        }
    }

    loadLanguages = async() => {
        const countries = await LanguagesAPI.getLanguages();
        if(countries?.length)
        {
            this.setState({ countries: countries });
            this.setState({ selectedCountry: countries.at(1) as ICountry });
        }
    }
}

export default MenuTranslation;