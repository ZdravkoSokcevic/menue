import React, { BaseSyntheticEvent, ChangeEventHandler } from "react";
import Modal from "react-modal";
import { Formik, Form, Field, FormikProps, FieldArray, ErrorMessage } from 'formik';
import * as Yup from "yup";

import { FaSave } from "react-icons/fa";
import { Button, Input, TextField } from "@mui/material";

import "../../../sass/modal.scss"
import MediaHelper from "@/helpers/MediaHelper";
import MenuAPI from "@/api/MenuAPI";
import { IMenuTranslation, IMenuTranslations, MenuCreateResponseItem, TMenu } from "@/types/Menu";
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
import { ILang } from "@/types/Languages";

interface IProps {
    // can be page or modal
    currentItem: TMenu
    closeModal?: Function;
};
interface IState {
};


interface IintiialValues {
    translations: IMenuTranslations;
}

const translationShape: any = {};

languages.forEach((lang: ILang) => {
    let code: string = lang.code;
    translationShape[code as any] = Yup.object().shape({

        name: lang.required
            ? Yup.string().required('Required')
            : Yup.string(),

        description: lang.required
            ? Yup.string().required('Required')
            : Yup.string()
    });
});

const initialValues: IintiialValues = {
    translations: languages.reduce((acc: IMenuTranslations, lang: ILang) => {
        acc[lang.code] = {
            name: '',
            description: ''
        }
        return acc;
    }, {} as IMenuTranslations)
}

// Solution 2
// const initialValues: IintiialValues = {
//     translations: Object.fromEntries(
//         languages.map(lang => [
//             lang.code,
//             { name: '', description: '' }
//         ])
//     )
// };

const menuLanguagesValidationSchema = Yup.object({
    translations: Yup.object().shape(
        translationShape
    )
});

class MenuTranslation extends React.Component<IProps, IState>
{
    private fileInputRef = React.createRef<HTMLInputElement>();
    private formikRef = React.createRef<FormikProps<IintiialValues>>();
    private categoryInputRef = React.createRef<HTMLSelectElement>();


    constructor(props: IProps) {
        super(props);
        this.state = {
            isDragging: false,
            key: Math.random(),
            categories: [],
            categoryOptions: [],
            ingridients: [],
            extraOpts: [],
            preferences: [],
            choosenIngridients: [],
            isIngridientModalOpened: false,
            isPreferencesModalOpened: false,
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
        console.log(this.props.currentItem);

        // Need to do special adjustments on init
        this.initFormData();
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
        const currentInitialValues: IintiialValues = {} as IintiialValues;

        

        return (
                <div className="form-page">


                    <h2>Translations</h2>
                    <button className="close-btn" onClick={() => this.closeModal()}>x</button>

                    <Formik 
                        initialValues={currentInitialValues}
                        validationSchema={menuLanguagesValidationSchema}
                        onSubmit={this.onSubmit}
                        innerRef={this.formikRef}
                        validateOnMount={false}   // IMPORTANT: Don't validate on load
                        validateOnBlur={false}    // IMPORTANT: Don't validate when clicking away
                        validateOnChange={false}  // IMPORTANT: Don't validate while typing
                        enableReinitialize={true}
                    >

                    {({ errors, touched, setFieldValue, isSubmitting, isValid, dirty, values }) => (

                        <Form encType="multipart/form-data">
                        <div className="container-fluid">
                            <div className="row">

                                {/* LEFT SIDE (NAME AND DESCRIPTION) */}
                                <div className="col-md-6 border-end p-5">
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

                                <div className="col-md-6 p-5">
                                    {languages.map(lang => {
                                        return (
                                            <div
                                                key={lang.code}
                                                className="card mb-4"
                                            >

                                                <div className="card-header d-flex justify-content-between">

                                                    <strong>
                                                        {lang.name}
                                                    </strong>

                                                    {lang.required && (
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
                                                            name={`translations.${lang.code}.name`}
                                                            className="form-control"
                                                        />

                                                        <ErrorMessage
                                                            name={`translations.${lang.code}.name`}
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
                                                            name={`translations.${lang.code}.description`}
                                                            className="form-control"
                                                        />

                                                        <ErrorMessage
                                                            name={`translations.${lang.code}.description`}
                                                            component="div"
                                                            className="text-danger small mt-1"
                                                        />

                                                    </div>

                                                </div>

                                            </div>
                                        )
                                    })}


                                    {/* {'Is submitting: ' + isSubmitting}<br />
                                    {'Is valid: ' + isValid} <br />
                                    {'Is dirty: ' + dirty} <br />
                                    { 'Errors: ' + JSON.stringify(errors) }
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
        // (event as Event).stopPropagation();
        // (event as Event).preventDefault();

        const data: IMenuTranslations = {} as IMenuTranslations;
        // debugger;
        Store.dispatch(enableLoading({}));
        const res= await MenuAPI.addOrEditTranslations(this.props.currentItem.id, data as IMenuTranslations);
        // const res = {success: false, data: {} };
        setTimeout(() => {
            Store.dispatch(disableLoading({}));
        }, 500)

        // if modal is case
        if(res && res.success == true)  {
            const responseData: IMenuTranslations = res.data as IMenuTranslations;
            // this.props.editCurrentItem(responseData.item);
            // this.closeModal();
        }
        else {
            alert('Unexpected error occured!');
            // this.closeModal();
        }
    }
}

export default MenuTranslation;