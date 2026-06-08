import React, { BaseSyntheticEvent, ChangeEventHandler } from "react";
import Modal from "react-modal";
import { Formik, Form, Field, FormikProps, FieldArray, ErrorMessage } from 'formik';
import * as Yup from "yup";

import { FaSave } from "react-icons/fa";

import "../../../sass/modal.scss"
import "../../../sass/category_translation.scss"
import LanguagesAPI from "@/api/LanguagesAPI";
import { Store } from "@/reducers/Store";
import { disableLoading, enableLoading } from "@/reducers/appSlice";
import AllergensAPI from "@/api/AllergensAPI";

import { ICountry, TCountries } from "@/types/TCountries";
import { IAllergen, IAllergenDataTranslations, IAllergenTranslations } from "@/types/Allergen";

interface IInitialValues {
    translations: IAllergenTranslations;
}

interface IProps {
    // can be page or modal
    currentItem: IAllergen;
    closeModal?: Function;
    editTranslationItem: Function;
};
interface IState {
    key: number;
    isLanguagesChooserModalOpened: boolean;
    countries: TCountries;
    selectedCountry: ICountry;
    currentInitialValues: IInitialValues;
};

class AllergenTranslation extends React.Component<IProps, IState>
{
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
            let code = country.language?.code;
            if(!code) {
                console.log('TLD NOT exists');
            }else {
                // if(country.mandatory)
                //     debugger;
                translationShape[code as any] = Yup.object().shape({
    
                    name: country.mandatory
                        ? Yup.string().required(`${country.common_name} name is required`).min(2, `${country.common_name} nameTest must be at least 5 characters long`)
                        : Yup.string(),
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

        const item = this.props.currentItem;
        // enable included ingridients to be checked
    }
    

    render(): React.ReactNode {
        // Create a NEW object reference here
        const currentInitialValues: IInitialValues = {} as IInitialValues;

        // Parse and process initial values
        const initialValues = {translations : (!Array.isArray(this.props.currentItem.translations)) ? this.props.currentItem.translations : {}} as IInitialValues;
        

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
                                        <h5 className="fw-bold text-dark">Allergen item overview</h5>
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

                                    </div>
                                </div>

                                <div className="col-md-7 p-5">
                                    <div className="col-12 category-translations">
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

        const data: IAllergenDataTranslations = event;

        // for(let input in event.translations) {
        //     data[input] = event;
        // }
        Store.dispatch(enableLoading({}));
        const res= await AllergensAPI.addOrEditTranslations(this.props.currentItem.id, data as IAllergenDataTranslations);
        // const res = {success: false, data: {} };
        setTimeout(() => {
            Store.dispatch(disableLoading({}));
        }, 500)

        // if modal is case
        if(res && res.success == true)  {
            const responseData: IAllergenTranslations = res.data as IAllergenTranslations;
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

export default AllergenTranslation;