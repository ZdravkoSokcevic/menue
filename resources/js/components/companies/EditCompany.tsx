import React, { BaseSyntheticEvent, ChangeEventHandler, ReactNode } from "react";
import Modal from "react-modal";
import { Formik, Form, Field, FormikProps } from 'formik';
import * as Yup from "yup";

import { FaSave } from "react-icons/fa";
import { Button, Input, TextField } from "@mui/material";

import "../../../sass/modal.scss"
import MediaHelper from "@/helpers/MediaHelper";
import CompaniesAPI from "@/api/CompaniesAPI";
import { MenuCreateResponseItem } from "@/types/Menu";
import { CompanyResponseItem, TCompany } from "@/types/TCompanies";
import { Store } from "@/reducers/Store";
import { disableLoading, enableLoading } from "@/reducers/appSlice";
import { AxiosResponse } from "axios";
import FormikSearchSelect from "../FormikSelectSearch";
import { IOption } from "@/types/App";
import { TLicenses } from "@/types/TLicenses";
import { ILanguage, TLanguages } from "@/types/TLanguages";
import { ICurrency, TCurrencies } from "@/types/TCurrencies";
import { ICountry, TCountries } from "@/types/TCountries";

interface IProps {
    // can be page or modal
    currentItem: TCompany
    closeModal?: Function;
    editCurrentItem: Function;
};
interface IState {
    isDragging: boolean;
    logoFile?: File | null;
    // Error with image type
    // @ts-ignore
    logo?: Image | null;
    licenses: TLicenses;
    currencies: TCurrencies;
    currencyOptions: Array<IOption>;
    licenseOptions: Array<IOption>;
    languages: TLanguages,
    languageOptions: Array<IOption>;
    countries: TCountries;
    countryOptions: Array<IOption>;
};

interface IInitialValues {
    name: string;
    description: string;
    email: string;
    phone: string;
    language_id: string;
    country_id: string;
    license_id: string;
    logo: File[] | null;
    quantity: number;
    website: string;
    street: string;
    first_name: string;
    last_name: string;
    username: string;
    logo_exists: boolean;
    currency_id: string;

}

const initialValues: IInitialValues = {
    name: '',
    description: '',
    email: '',
    phone: '',
    language_id: '',
    country_id: '',
    license_id: '',
    logo: null,
    quantity: 0,
    street: '',
    website: '',
    first_name: '',
    last_name: '',
    username: '',
    currency_id: '',
    logo_exists: false
}

const companyValidationSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Too short!')
        .max(50, 'Too long!')
        .required('Required'),
    description: Yup.string()
        .min(20, 'Description is too short')
        .max(255, 'Description is too long')
        .required('Required'),
    // picture: Yup.mixed()
    //     .test('dynamicFileSize', 'File not exists', (value, context) => {
    //         debugger;
    //     }),
    // Picture/file validation actually will not work
    // because file is always empty
    // picture: Yup.mixed()
    //     .nullable() // Tell Yup null is a data type we allow
    //     .notRequired()
    //     .test('picture-check', 'A picture is required', function(value) {
    //         const { picture_exists } = this.parent;

    //         // 1. Log to be 100% sure what's happening
    //         console.log('Checking picture:', { value, picture_exists });

    //         // 2. The "Loose" check (works for true or "true")
    //         if (picture_exists == true || picture_exists == 'true') {
    //             return true; // It's valid because an old one exists!
    //         }

    //         // 3. If no old one exists, 'value' cannot be null or undefined
    //         return value !== null && value !== undefined;
    //     }),
    logo: Yup.mixed()
        .nullable() // Tell Yup null is a data type we allow
        .notRequired()
        .test('logo-check', 'A logo is required', function(value) {
            const { logo_exists } = this.parent;

            // 1. Log to be 100% sure what's happening
            console.log('Checking picture:', { value, logo_exists });

            // 2. The "Loose" check (works for true or "true")
            if (logo_exists == true || logo_exists == 'true') {
                return true; // It's valid because an old one exists!
            }

            // 3. If no old one exists, 'value' cannot be null or undefined
            return value !== null && value !== undefined;
        }),
    phone: Yup.string()
        .min(8, 'Phone is too short')
        .max(40, 'Phone number is too long')
        .required('Required'),
    website: Yup.string()
        .min(7, 'Website url is too short')
        .max(255, 'Website url is too long')
        .required('Required'),
    street: Yup.string()
        .min(5, 'Street is too short')
        .max(255, 'Street is too long')
        .required('Required'),
    first_name: Yup.string()
        .min(2, 'First name is too short')
        .max(255, 'First name is too long')
        .required('Required'),
    last_name: Yup.string()
        .min(2, 'Last name is too short')
        .max(255, 'Last name is too long')
        .required('Required'),
    username: Yup.string()
        .min(2, 'Username is too short')
        .max(64, 'Username is too long')
        .required('Required'),
    language_id: Yup.string()
        .required(),
    country_id: Yup.string()
        .required(),
    currency_id: Yup.string()
        .required(),
    license_id: Yup.string()
        .required()
});

class EditCompany extends React.Component<IProps, IState>
{
    private fileInputRef = React.createRef<HTMLInputElement>();
    private formikRef = React.createRef<FormikProps<IInitialValues>>();
    private emailRef = React.createRef<HTMLInputElement>();
    private countryRef = React.createRef<HTMLSelectElement>();
    private currencyRef = React.createRef<HTMLSelectElement>();
    private licenseRef = React.createRef<HTMLSelectElement>();
    private languageRef = React.createRef<HTMLSelectElement>();

    private initialValues = {
        name: '',
        description: '',
        picture: null as String | File | null | undefined,
        quantity: 0,
        picture_exists: false
    }

    constructor(props: IProps) {
        super(props);
        this.state = {
            isDragging: false,
            licenses: [],
            countries: [],
            currencies: [],
            countryOptions: [],
            currencyOptions: [],
            licenseOptions: [],
            languageOptions: [],
            languages: []
        }
        // this.handleImageLoad = this.handleImageLoad.bind(this);
        // this.handleFileLoad = this.handleFileLoad.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.formikRef.current?.setFieldValue('picture', null);
    }

    componentDidMount(): void {
        let props= this.props;
        // set ref that select/option can work
        // this.countryRef.current?.value = props.currentItem.country_id as string;
        // debugger;
    }



    handleDrop = (event: any) => {
        event.preventDefault();
        try {
            let file= event.dataTransfer.files[0];
            let fileList = MediaHelper.fileListFrom([file]);
            this.fileInputRef.current!.files = fileList;
            this.handleFileChange(event);
        }catch(e) {
            debugger;

        }
    }

    handleDragOver = (e: any) => {
        // debugger;
        let event = e as Event;
        event.stopPropagation();
        event.preventDefault();
    }

    handleDragEnter = () => {

    }

    handleDragLeave = () => {

    }

    handleAreaClick = () => {
        this.fileInputRef.current?.click();
    }

    handleFileChange = async(event: any) => {
        if(event)
        {
            // File click gives event.target.files,
            // but file drop gives us event.dataTransfer
            let f = (event.target.files && event.target.files.length) ? event.target.files[0] : event.dataTransfer.files[0];
            let ev = this;
            this.formikRef.current?.setFieldValue('logo', f);
            this.setState({ logoFile: f });

            const blobFile: Blob = new Blob([f as BlobPart], { type: 'application/octet-stream' });
            let fReader = new FileReader();
            const imageUrl = URL.createObjectURL(blobFile);

            fReader.onload = function(event: any) {
                const img = new Image();
                img.src = imageUrl;
                img.onload = () => {
                    let dimensions = {
                        width: img.naturalWidth,
                        height: img.naturalHeight
                    }
                    ev.setState({ logo: img });
                }

                img.onerror = () => {
                    return Promise.reject("Cannot load image");
                }
            }
            fReader.readAsDataURL(blobFile);
        }
    }

    onCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        let value = e.target.value;
        // iterate countries to update currencies
        let currencies:TCurrencies = [];
        let languages: TLanguages = [];
        this.state.countries.map((country: ICountry) => {
            if(country.id == value) {
                this.setState({ currencies: country.currencies as TCurrencies })
                currencies = country.currencies as TCurrencies;

                this.setState({ languages: country.languages });
                languages = country.languages as TLanguages;
            }
        })

        // empty currencies state
        this.setState({ currencyOptions: [] });
        // const currencyOptions = [];
        const currencyOptions = currencies.map((currency: ICurrency) => {
            return { id: currency.id, name: 'currency_id', label:currency.code + '-' + currency.name, value: currency.id };
        })
        this.setState({ currencyOptions: currencyOptions});
        this.formikRef.current?.setFieldValue('country_id', e.target.value);

        const languageOptions = languages.map((language: ILanguage) => {
            return {
                name: 'language_id',
                label: language.code + ' - ' + language.name,
                value: language.id
            };
        });
        this.setState({ languageOptions: languageOptions as IOption[] });
        // debugger;
    }

    onCurrencyChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
        this.formikRef.current?.setFieldValue('currency_id', e.target.value);
    }

    onLicenseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        this.formikRef.current?.setFieldValue('license_id', e.target.value);
    }

    onLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        this.formikRef.current?.setFieldValue('language_id', e.target.value);
    }

    handleImageLoad(event: any) {

    }

    handleFileLoad(event: any) {

    }

    closeModal() {
        if(this.props.closeModal)
            this.props.closeModal();
    }
    

    render(): React.ReactNode {
        let pr = this.props.currentItem;
        // Create a NEW object reference here
        const hasExistingLogo = !!this.props.currentItem.logo;
        const currentInitialValues: IInitialValues = {
            name: this.props.currentItem.name || '',
            email: this.props.currentItem.email || '',
            description: this.props.currentItem.description || '',
            phone: this.props.currentItem.phone || '',
            website: this.props.currentItem.website || '',
            street: this.props.currentItem.street || '',
            country_id: this.props.currentItem.country_id as string || '',
            currency_id: this.props.currentItem.currency as string || '',
            language_id: this.props.currentItem.language_id as string || '',
            license_id: this.props.currentItem.license_id as string || '',
            logo: null,
            first_name: this.props.currentItem.admin?.first_name as string || '',
            last_name: this.props.currentItem.admin?.last_name as string || '',
            username: this.props.currentItem.admin?.username || '',
            // quantity not necessary
            quantity: 0,
            logo_exists: hasExistingLogo // Boolean
        };
        // debugger;
        this.formikRef.current?.setFieldTouched('name', true);
        this.formikRef.current?.setFieldTouched('description');
        this.formikRef.current?.setFieldTouched('quantity');

        return (
                <div className="form-page">

                <div className="modal-header">
                    <h2>Edit company, {this.props.currentItem.name}</h2>
                    <button className="close-btn" onClick={() => this.closeModal()}>x</button>
                </div>

                    <Formik 
                        initialValues={currentInitialValues}
                        validationSchema={companyValidationSchema}
                        onSubmit={this.onSubmit}
                        innerRef={this.formikRef}
                        validateOnMount={false}   // IMPORTANT: Don't validate on load
                        validateOnBlur={false}    // IMPORTANT: Don't validate when clicking away
                        validateOnChange={false}  // IMPORTANT: Don't validate while typing
                        enableReinitialize={true}
                    >

                    {({ errors, touched, setFieldValue, isSubmitting, isValid, dirty }) => (

                        <Form encType="multipart/form-data" className="modal-form-content">
                            <div className="modal-scroll-body">
                                <div className="container-fluid p-0">
                                    <div className="row g-4">

                                        {/* LEFT SIDE */}
                                        <div className="col-md-6 border-end company-section-left">
                                            <div className="form-group">
                                                <label>Choose picture</label>
                                                <div
                                                onDrop={this.handleDrop}
                                                onDragOver={this.handleDragOver}
                                                onDragEnter={this.handleDragEnter}
                                                onDragLeave={this.handleDragLeave}
                                                onClick={this.handleAreaClick}
                                                style={{
                                                    border: "2px dashed #ccc",
                                                    padding: "20px",
                                                    textAlign: "center",
                                                    borderRadius: "10px",
                                                    backgroundColor: this.state.isDragging ? "#f0f8ff" : "#fff",
                                                    height: '200px',
                                                    width: '200px',
                                                    backgroundImage: 
                                                        (this.props.currentItem.logo && !this.state.logoFile) ? 
                                                            `url(/storage/${this.props.currentItem.logo})` : 
                                                            `url(${this.state.logo?.src})`,
                                                    backgroundSize: 'cover',
                                                    position: 'relative'
                                                }}
                                                >
                                                    <p>Drag file here</p>

                                                    <input
                                                        type="file"
                                                        ref={this.fileInputRef}
                                                        onChange={(event: any) => this.handleFileChange(event as ChangeEventHandler<HTMLInputElement>)}
                                                        // Hide the actual input element, but keep it accessible to screen readers using opacity: 0
                                                        style={{ opacity: 0, height: 0, width: 0, position: 'absolute' }}
                                                        name="picture"
                                                    />
                                                </div>
                                                {errors.logo && touched.logo ? (
                                                    <><small id="pictureHelp" className="form-text text-danger">{this.formikRef.current?.errors.logo}</small><br /></>
                                                ) : null}
                                            </div>

                                            {/* COMPANY NAME */}
                                            <div className="form-group">
                                                <label>Company name</label>
                                                <Field 
                                                    name="name" 
                                                    className="form-control" 
                                                    id="name" 
                                                    aria-describedby="nameHelp" 
                                                    placeholder="Name"
                                                />
                                                {errors.name && touched.name ? (
                                                    <><small id="nameHelp" className="form-text text-danger">{errors.name as ReactNode}</small><br /></>
                                                ) : null}
                                                <small id="nameHelp" className="form-text text-muted">Name of the company.</small>
                                            </div>

                                            {/* EMAIL */}
                                            <div className="form-group">
                                                <label>Email</label>
                                                <Field 
                                                    name="email" 
                                                    className="form-control" 
                                                    id="email" 
                                                    aria-describedby="emailHelp" 
                                                    placeholder="Enter email"
                                                    type="email"
                                                    // ref={this.emailRef}
                                                />
                                                {errors.email && touched.email ? (
                                                    <><small id="emailHelp" className="form-text text-danger">{errors.email}</small><br /></>
                                                ) : null}
                                                <small id="emailHelp" className="form-text text-muted"><b>Note:</b> company email will be used for admin login.</small>
                                            </div>

                                            {/* PHONE */}
                                            <div className="form-group">
                                                <label>Phone</label>
                                                <Field 
                                                    name="phone" 
                                                    className="form-control" 
                                                    id="phone" 
                                                    aria-describedby="phoneHelp" 
                                                    placeholder="+1 xxx xxxx"
                                                />
                                                {errors.phone && touched.phone ? (
                                                    <><small id="phoneHelp" className="form-text text-danger">{errors.phone}</small><br /></>
                                                ) : null}
                                                {/* <small id="phoneHelp" className="form-text text-muted">We'll never share your email with anyone else.</small> */}
                                            </div>

                                            {/* WEBSITE */}
                                            <div className="form-group">
                                                <label>Website</label>
                                                <Field 
                                                    name="website" 
                                                    className="form-control" 
                                                    id="website" 
                                                    aria-describedby="websiteHelp" 
                                                    placeholder="https://"
                                                />
                                                {errors.email && touched.email ? (
                                                    <><small id="websiteHelp" className="form-text text-danger">{errors.website}</small><br /></>
                                                ) : null}
                                            </div>

                                            {/* LICENSE */}
                                            <div className="form-group">
                                                <label>License</label>
                                                <FormikSearchSelect 
                                                    options={this.state.licenseOptions}
                                                    name="license"
                                                    id="license"
                                                    aria-describedby="licenseHelp"
                                                    ref={this.licenseRef}
                                                    onChange={this.onLicenseChange}
                                                    isSearchable={false}
                                                />
                                            </div>
                                            
                                        </div>

                                        {/* RIGHT SIDE */}
                                        <div className="col-md-6 p-5 col-md-6 p-5 company-section-right">

                                            {/* COUNTRY */}
                                            <div className="form-group">
                                                <label>Country</label>
                                                <FormikSearchSelect 
                                                    options={(this.state.countryOptions as unknown) as IOption[]}
                                                    name="country"
                                                    id="country"
                                                    aria-describedby="countryHelp"
                                                    ref={this.countryRef}
                                                    onChange={this.onCountryChange}
                                                />
                                            </div>

                                            {/* CURRENCY */}
                                            <div className="form-group">
                                                <label>Currency</label>
                                                <FormikSearchSelect 
                                                    options={this.state.currencyOptions}
                                                    name="currency"
                                                    id="currency"
                                                    aria-describedby="countryHelp"
                                                    ref={this.currencyRef}
                                                    onChange={this.onCurrencyChange}
                                                />
                                            </div>

                                            {/* LANGUAGE */}
                                            <div className="form-group">
                                                <label>Language</label>
                                                <FormikSearchSelect 
                                                    options={this.state.languageOptions}
                                                    name="language"
                                                    id="language"
                                                    aria-describedby="licenseHelp"
                                                    ref={this.languageRef}
                                                    onChange={this.onLanguageChange}
                                                    isSearchable={false}
                                                />
                                            </div>

                                            {/* STREET */}
                                            <div className="form-group">
                                                <label>Street</label>
                                                <Field 
                                                    type="text" 
                                                    className="form-control" 
                                                    name="street" 
                                                    aria-describedby="streetHelp" 
                                                    rows={6} 
                                                    placeholder="Enter a street" 
                                                />
                                                {errors.street && touched.street ? (
                                                    <><small id="streetHelp" className="form-text text-danger">{errors.street}</small><br /></>
                                                ) : null}
                                                <small id="streetHelp" className="form-text text-muted">Location of restaurant.</small>
                                            </div>
                                            
                                            {/* DESCRIPTION */}
                                            <div className="form-group">
                                                <label>Description</label>
                                                <Field 
                                                    type="text" 
                                                    className="form-control" 
                                                    name="description" 
                                                    aria-describedby="descriptionHelp" 
                                                    rows={6} 
                                                    placeholder="Enter a description" 
                                                    as={'textarea'}
                                                />
                                                {errors.description && touched.description ? (
                                                    <><small id="descriptionHelp" className="form-text text-danger">{errors.description}</small><br /></>
                                                ) : null}
                                                <small id="descriptionHelp" className="form-text text-muted">About company.</small>
                                            </div>
                                        </div>


                                        {/* USER SECTION TEXT */}
                                        <div className="col-md-12 p-5 company-section-right mt-2 border-top">
                                            <h3>Admin info</h3>
                                        </div>

                                        {/* USER SECTION */}
                                        <div className="col-md-6 ps-5 pt-2 pe-5 pb-2 company-section-left border-end">

                                            {/* FIRST NAME */}
                                            <div className="form-group">
                                                <label>First name</label>
                                                <Field 
                                                    name="first_name" 
                                                    className="form-control" 
                                                    id="first_name" 
                                                    aria-describedby="firstNameHelp" 
                                                    placeholder="Enter first name"
                                                />
                                                {errors.first_name && touched.first_name ? (
                                                    <><small id="firstNameHelp" className="form-text text-danger">{errors.first_name}</small><br /></>
                                                ) : null}
                                                {/* <small id="phoneHelp" className="form-text text-muted">We'll never share your email with anyone else.</small> */}
                                            </div>

                                            {/* LAST NAME */}
                                            <div className="form-group">
                                                <label>Last name</label>
                                                <Field 
                                                    name="last_name" 
                                                    className="form-control" 
                                                    id="last_name" 
                                                    aria-describedby="lastNameHelp" 
                                                    placeholder="Enter last name"
                                                />
                                                {errors.last_name && touched.last_name ? (
                                                    <><small id="lastNameHelp" className="form-text text-danger">{errors.last_name}</small><br /></>
                                                ) : null}
                                                {/* <small id="phoneHelp" className="form-text text-muted">We'll never share your email with anyone else.</small> */}
                                            </div>
                                        </div>

                                        <div className="col-md-6 ps-5 pt-2 pe-5 pb-2 company-section-left border-end">
                                            {/* USERNAME */}
                                            <div className="form-group">
                                                <label>Username</label>
                                                <Field 
                                                    name="username" 
                                                    className="form-control" 
                                                    id="username" 
                                                    aria-describedby="usernameHelp" 
                                                    placeholder="Enter username"
                                                />
                                                <small id="usernameHelp" className="form-text text-muted"><b style={{fontWeight: 800}}>_admin</b> will be concatenated to username!</small>
                                                {errors.username && touched.username ? (
                                                    <><small id="usernameHelp" className="form-text text-danger">{errors.username}</small><br /></>
                                                ) : null}
                                            </div>

                                            {/* EMAIL */}
                                            <div className="form-group mb-5">
                                                <label>Email</label>
                                                <Field 
                                                    name="email" 
                                                    className="form-control" 
                                                    id="email" 
                                                    aria-describedby="emailHelp" 
                                                    placeholder="Enter username"
                                                    ref={this.emailRef}
                                                />
                                                {errors.email && touched.email ? (
                                                    <><small id="emailHelp" className="form-text text-danger">{errors.email}</small><br /></>
                                                ) : null}
                                                {/* <small id="phoneHelp" className="form-text text-muted">We'll never share your email with anyone else.</small> */}
                                            </div>

                                            <div className="d-none">
                                                {Object.keys(currentInitialValues).map((key) => (
                                                    <li>
                                                        <small>{`Key: ${key} Value: ${(currentInitialValues as any)[key]}`}</small>
                                                    </li>
                                                ))}
                                            </div>
                                            <div className="d-none">
                                                {'Is submitting: ' + isSubmitting}<br />
                                                {'Is valid: ' + isValid} <br />
                                                {'Is dirty: ' + dirty} <br />
                                                { 'Errors: ' + JSON.stringify(errors) }
                                            </div>
                                            {/* <div className="controls">
                                                <button 
                                                    type="submit" 
                                                    className="submit" 
                                                    disabled={isSubmitting || !isValid || !dirty}>
                                                    <FaSave />
                                                </button>
                                            </div> */}
                                        </div>  



                                    </div>
                                </div>
                            </div>

                        {/* FIXED STICKY FOOTER */}
                        <div className="modal-actions-footer">
                            <button 
                                className="submit btn btn-primary btn-submit-save" 
                                disabled={isSubmitting || !isValid || !dirty}
                            >
                                <FaSave />
                            </button>
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

        let data: TCompany = {
            id: this.props.currentItem.id,
            name: event.name,
            email: event.email,
            phone: event.phone,
            parent_id: event.parent_id,
            street: event.street,
            country_id: event.country_id,
            currency_id: event.currency_id,
            language_id: event.language_id,
            license_id: event.license_id,
            website: event.website,
            description: event.description
        }
        debugger;
        if(event.loog != null && typeof event.logo != undefined && typeof (event.logo.name) == 'string')
            data.logo = event.logo;
        Store.dispatch(enableLoading({}));
        const res= await CompaniesAPI.editMenu(data as TCompany);
        setTimeout(() => {
            Store.dispatch(disableLoading({}));
        })

        // if modal is case
        if(res && res.success == true)  {
            const responseData: CompanyResponseItem = res.data as CompanyResponseItem;
            this.props.editCurrentItem(responseData.item);
            this.closeModal();
        }
        else {
            alert('Unexpected error occured!');
            // this.closeModal();
        }
    }
}

export default EditCompany;