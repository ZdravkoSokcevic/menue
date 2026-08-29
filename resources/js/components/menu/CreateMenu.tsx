import React, { BaseSyntheticEvent, ChangeEventHandler } from "react";
import Modal from "react-modal";
import { Formik, Form, Field, FormikProps, FieldArray, FormikErrors, ErrorMessage } from 'formik';
import * as Yup from "yup";

import { FaPlus, FaSave } from "react-icons/fa";
import { Button, Input, TextField } from "@mui/material";

import "../../../sass/modal.scss"
import MediaHelper from "@/helpers/MediaHelper";
import MenuAPI from "@/api/MenuAPI";
import { MenuCreateResponseItem, TMenu } from "@/types/Menu";
import { Store } from "@/reducers/Store";
import { disableLoading, enableLoading } from "@/reducers/appSlice";
import { WidthHeight } from "@/types/Media";
import CategoriesAPI from "@/api/CategoriesAPI";
import { ICategory, TCategories } from "@/types/Categories";
import FormikSearchSelect from "../FormikSelectSearch";
import { IOption } from "@/types/App";
import { GoPlus } from 'react-icons/go'
import IngridientsAPI from "@/api/IngridientsAPI";
import { IIngridient, TIngridients, TMenuIngridients } from "@/types/Ingridient";
import CreateIngridient from "../ingridient/CreateIngridient";
import { IExtra, IMenuExtra, TExtras, TMenuExtras } from "@/types/Extra";
import { IPreference, TPreferences } from "@/types/Preference";
import CreatePreference from "../preferences/CreatePreference";
import PreferencesAPI from "@/api/PreferencesAPI";
import ExtrasAPI from "@/api/ExtrasAPI";
import { IPortionPrice, TPrices } from "@/types/Prices";
import { showToast } from "@/helpers/Toast";

interface IProps {
    // can be page or modal
    type: 'modal', // can be modal or page
    isOpen?: boolean;
    closeCreateMenuModal: Function;
    addNewMenuItem: Function;
};
interface IState {
    isDragging: boolean;
    imageFile?: File | null;
    // Error with image type
    // @ts-ignore
    image?: Image | null;
    categories: TCategories;
    categoryOptions: Array<IOption>;
    key: number;
    ingridients: TIngridients;
    preferences: TPreferences;
    choosenIngridients: Array<string | number>;
    isIngridientModalOpened: boolean;
    isPreferencesModalOpened: boolean;
    extraOpts: TMenuExtras;
};

interface IInitialValues {
    name: string;
    description: string;
    picture: File[] | null;
    quantity: number;
    prep_time: number;
    prices: TPrices;
    ingridients: TMenuIngridients;
    preferences: Array<string>;
    extras: TMenuExtras;
}

const initialValues: IInitialValues = {
    name: '',
    description: '',
    picture: null,
    quantity: 0,
    prep_time: 0,
    prices: [] as TPrices,
    ingridients: [],
    preferences: [],
    extras: []
}

// const FieldErrorMessage = ({ name: string }) => {
//     <Field
//         name
// }


const menuValidationSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Too short!')
        .max(50, 'Too long!')
        .required('Required'),
    description: Yup.string()
        .min(20, 'Description is too short')
        .max(255, 'Description is too long')
        .required('Required'),
    picture: Yup.mixed()
        .required('A picture is required')
        .test(
            'fileSize',
            'File too large',
            (value)  => {
                if (!value) return true; // Skip if null (handled by .required)
                return value && (value as File).size <= MediaHelper.MAXIMUM_IMAGE_FILE_SIZE; }
        )
        .test(
            'fileFormat',
            'Unsupported Format',
            value => {
                if (!value) return true; // Skip if null (handled by .required)
                return value && MediaHelper.SUPPORTED_IMAGE_FORMATS.includes((value as File).type) }
        )
        .test(
        'aspect-ratio',
        'The image aspect ratio must be 4:3',
        async (value) => {
            if (!value) return true; // Allows optional field to pass this specific test if empty

            try {
            const { width, height }: WidthHeight = await MediaHelper.getFileDimensions(value as File);
            const aspectRatio = width / height;
            // Check if the aspect ratio is approximately 16/9 (approx due to potential float errors)
            return Math.abs(aspectRatio - (4 / 3)) < 0.01;
            } catch (error) {
            return false; // Return false if dimensions cannot be read
            }
        }
    ),
    category: Yup.mixed()
        .required(),
    // TODO: quantity/portion and price will be separated in some way
    quantity: Yup.number()
        .min(1, 'At least one is required')
        // TODO: add quantity max size in app settings for lbs/kg
        // see if country api provides measurments
        .max(1500, 'Portion cannot be larger than 1500gr')
        .required('Portion size is required'),
    prep_time: Yup.number()
        .min(1, 'At least one minut is required')
        .max(300, 'Preparation time cannot be bigger than 300mins')
        .required('Preparation time is required!'),
    prices: Yup.array()
        .of(
            Yup.object().shape({
                name: Yup.string().min(4, 'Name too short!').required('Portion name is required'),
                portion_size: Yup.number().typeError('Portion size must be a number').min(0, 'Min price is 0').max(10000, 'Max price is 10000').required('Portion size is required!'),
                price: Yup.number().typeError('Price must be a number').min(0, 'Min price is 0').max(10000, 'Max price is 10000').required('Price is required!')
            })
        ),
    preferences: Yup.array()
        .of(
             Yup.number()
                    .min(0, 'Invalid preference')
                    .max(65536, 'Ivalid preference')
        ),
    extras: Yup.array().of(
        Yup.object({
            id: Yup.number().required(),
            price: Yup.number().min(0).required()
        })
    ),
});

class CreateMenu extends React.Component<IProps, IState>
{
    private fileInputRef = React.createRef<HTMLInputElement>();
    private formikRef = React.createRef<FormikProps<IInitialValues>>();
    private categoryInputRef = React.createRef<HTMLSelectElement>();
    // private ingridientsRef = React.createRef<HTMLInputElement>([]);
    constructor(props: IProps) {
        super(props);
        this.state = {
            isDragging: false,
            categories: [],
            categoryOptions: [],
            key: 0,
            ingridients: [],
            extraOpts: [],
            preferences: [],
            choosenIngridients: [],
            isIngridientModalOpened: false,
            isPreferencesModalOpened: false,
        }
        this.handleImageLoad = this.handleImageLoad.bind(this);
        this.handleFileLoad = this.handleFileLoad.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);

    }

    getIsOpen() {

    }

    closeModal() {
        this.props.closeCreateMenuModal();
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
            this.formikRef.current?.setFieldValue('picture', f);
            this.setState({ imageFile: f });

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
                    ev.setState({ image: img });
                }

                img.onerror = () => {
                    return Promise.reject("Cannot load image");
                    debugger;
                }
            }
            fReader.readAsDataURL(blobFile);
        }
    }

    // onIngridientsChange(e: React.SyntheticEvent<HTMLInputElement>, ingridient: IIngridient) {
    //     const pastIngridients = this.formikRef.current?.values.ingridients;
    //     let isExisted = false;
    //     pastIngridients?.map((i: IIngridient) => {
    //         if(ingridient.id == i.id)
    //             isExisted = true;
    //     })

    //     if(isExisted) {
    //         const newIngridients = pastIngridients?.filter((iingridient: IIngridient) => (iingridient.id == ingridient.id)?ingridient:null);
    //         this.formikRef.current?.setFieldValue("ingridients", newIngridients);
    //     }else {
    //         const newIngridients = pastIngridients?.concat(ingridient);
    //         this.formikRef.current?.setFieldValue("ingridients", newIngridients);
    //     }
    //     // debugger;
    // }

    isIngridientChecked(ingridient: IIngridient) {
        const formik = this.formikRef.current?.values;
        const ingridients = formik?.ingridients;
        return true;
        // debugger;
    }

    refreshFieldset = () => {
        this.setState({key: Math.random()});
    }

    onCategoryChange(e: React.SyntheticEvent<HTMLSelectElement>) {
        // const value = e.target as HTMLSelectElement;
        // this.setState({ selectedCategory })
    }

    handleImageLoad(event: any) {

    }

    handleFileLoad(event: any) {

    }

    // Not be used
    validateFile = async(f: File) => {
        // let f = this.state.imageFile;

    }

    openCreateIngidientModal = async() => {
        this.setState({ isIngridientModalOpened: true });
    }

    closeCreateIngridientModal = () => {
        this.setState({ isIngridientModalOpened: false });
    }

    openCreatePreferencesModal = async() => {
        this.setState({ isPreferencesModalOpened: true });
    }

    closeCreatePreferencesModal = async() => {
        this.setState({ isPreferencesModalOpened: false });
    }

    addNewIngridientItem = (item: IIngridient) => {
        const ingr = this.state.ingridients;
        ingr.push(item);
        this.setState({ ingridients:ingr });
    }

    addNewPreferenceItem = (item: IPreference) => {
        const pref = this.state.preferences;
        pref.push(item);
        this.setState({ preferences: pref });
    }

    componentDidMount(): void {
        this.fetchCategories();
        this.fetchIngridients();
        this.fetchPreferences();
        this.fetchExtras();
    }


    render(): React.ReactNode {
        return (
            <>
            <Modal
                isOpen={this.props.isOpen as boolean}
                onRequestClose={() => this.closeModal()}
                overlayClassName="modal-backdrop-blur"
                className="form-modal"
                contentLabel="Create Menu item"
            >
                <div className="form-page">


                    <div className="modal-header">
                        <h2>Create Menu Item</h2>
                        <button className="close-btn" onClick={() => this.closeModal()}>&times;</button>
                    </div>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={menuValidationSchema}
                        onSubmit={this.onSubmit}
                        innerRef={this.formikRef}
                        enableReinitialize
                    >

                    {({ errors, touched, setFieldValue, isSubmitting, isValid, dirty, values}) => (

                        <Form encType="multipart/form-data" className="modal-form-content">
                            <div className="modal-scroll-body">
                                <div className="container-fluid p-0 mb-5">
                                    <div className="row g-4">

                                        <div className="col-md-6 d-flex flex-column gap-3">
                                            <div className="">
                                                <input
                                                    type="file"
                                                    ref={this.fileInputRef}
                                                    onChange={(event: any) => this.handleFileChange(event as ChangeEventHandler<HTMLInputElement>)}
                                                    // Hide the actual input element, but keep it accessible to screen readers using opacity: 0
                                                    style={{ opacity: 0, height: 0, width: 0, position: 'absolute' }}
                                                />
                                                <label>Choose picture</label>
                                                {/* image should be 4:3 */}
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
                                                        backgroundImage: this.state.image ? `url(${this.state.image.src})` : '',
                                                        backgroundSize: 'cover',
                                                        position: 'relative'
                                                    }}
                                                    className="placeholder-4-3"
                                                >
                                                {/* <div className="text-muted text-center p-4">
                                                    <span className="d-block mb-1">📸 Upload Item Image</span>
                                                    <small className="text-muted">Click or drag & drop</small>
                                                </div> */}


                                                </div>
                                                {errors.picture  ? (
                                                    <><small id="pictureHelp" className="form-text text-danger">{errors.picture}</small><br /></>
                                                ) : null}
                                            </div>

                                            {/* QUANTITY */}
                                            <div className="form-group">
                                                <label className="form-label">Quantity</label>
                                                <Field 
                                                    name="quantity" 
                                                    className="form-control" 
                                                    id="quantity" 
                                                    aria-describedby="quantityHelp" 
                                                    placeholder="Quantity"
                                                />
                                                {errors.quantity && touched.quantity ? (
                                                    <><small id="quantityHelp" className="form-text text-danger">{errors.quantity}</small><br /></>
                                                ) : null}
                                                <small id="quantityHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                                            </div>

                                            {/* PREPARATION TIME */}
                                            <div className="form-group">
                                                <label className="form-label">Preparation time:</label>
                                                <Field
                                                    name="prep_time"
                                                    className="form-control"
                                                    id="quantity"
                                                    aria-describedby="prepTimeHelp"
                                                    placeholder="Preparation time"
                                                />
                                                {errors.prep_time && touched.prep_time ? (
                                                    <><small id="prepTimeHelp" className="form-text text-danger">{errors.prep_time}</small><br /></>
                                                ) : null}
                                                <small id="prepTimeHelp" className="form-text text-muted">Dish preparation time (in minutes)</small>
                                            </div>

                                        </div>
                                        
                                        {/* RIGHT COLUMN: Classification & Checkboxes */}
                                        <div className="col-md-6 d-flex flex-column gap-4 border-start-md">

                                            {/* NAME */}
                                            <div className="form-group">
                                                <label className="form-label">Name</label>
                                                <Field 
                                                    name="name" 
                                                    className="form-control" 
                                                    placeholder="Enter name of your menu" 
                                                    aria-describedby="nameHelp"
                                                />
                                                {errors.name && touched.name ? (
                                                    <><small id="nameHelp" className="form-text text-danger">{errors.name}</small><br /></>
                                                ) : null}
                                                <small id="nameHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                                            </div>

                                            {/* DESCRIPTION */}
                                            <div className="form-group">
                                                <label className="form-label">Description</label>
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
                                                <small id="nameHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                                            </div>

                                            {/* CATEGORY */}
                                            <div className="form-group">
                                                <label className="form-label">Category</label>
                                                <FormikSearchSelect
                                                    options={(this.state.categoryOptions as unknown) as IOption[]}
                                                    name="category"
                                                    id="category"
                                                    aria-describedby="categoryHelp"
                                                    ref={this.categoryInputRef}
                                                    onChange={this.onCategoryChange}
                                                />
                                            </div>

                                            {/* INGRIDIENTS */}
                                            {this.state.ingridients.length &&
                                            <div className="form-section">
                                                <h3 className="section-title">Ingridients:</h3>
                                                <FieldArray
                                                    name="ingridients"
                                                    render={arrayHelpers => (
                                                        <div className="checkbox-grid">
                                                            {/* <small>{JSON.stringify(arrayHelpers)}</small> */}
                                                            {this.state.ingridients.map((ingridient: IIngridient, index: number) => (
                                                                <label className="checkbox-item" key={ingridient.id}>
                                                                    <input
                                                                        name="ingridients"
                                                                        type="checkbox"
                                                                        className="form-check-input"
                                                                        value={ingridient.id}
                                                                        checked={values.ingridients.find((i) => i === ingridient.id) ? true: false}
                                                                        onChange={e => {
                                                                        if (e.target.checked) {
                                                                            arrayHelpers.push(ingridient.id);
                                                                        } else {
                                                                            const idx = values.ingridients.indexOf(ingridient.id);
                                                                            arrayHelpers.remove(idx);
                                                                        }
                                                                        }}
                                                                    />
                                                                    <span>{ingridient.name}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    )}
                                                />
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={this.openCreateIngidientModal}
                                                >
                                                    <GoPlus /> Add ingridient
                                                </button>
                                            </div>
                                            }

                                            {/* PREFERENCES */}
                                            {this.state.preferences.length &&
                                            <div className="form-section">
                                                <h3 className="section-title">Preferences</h3>
                                                <FieldArray
                                                    name="preferences"
                                                    render={arrayHelpers => (
                                                        <div className="checbox-grid">
                                                            {/* <small>{JSON.stringify(arrayHelpers)}</small> */}
                                                            {this.state.preferences.map((ingridient: IPreference, index: number) => (
                                                                <label className="checkbox-item" key={ingridient.id}>
                                                                    <input
                                                                        name="preferences"
                                                                        type="checkbox"
                                                                        className="form-check-input"
                                                                        value={ingridient.id}
                                                                        checked={values.preferences.find((i) => i === ingridient.id) ? true: false}
                                                                        onChange={e => {
                                                                        if (e.target.checked) {
                                                                            arrayHelpers.push(ingridient.id);
                                                                        } else {
                                                                            const idx = values.preferences.indexOf(ingridient.id);
                                                                            arrayHelpers.remove(idx);
                                                                        }
                                                                        }}
                                                                    />
                                                                    <span>{ingridient.name}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    )}
                                                />
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={this.openCreatePreferencesModal}
                                                >
                                                    <GoPlus /> Add preference
                                                </button>
                                            </div>
                                            }

                                            {/* EXTRAS */}
                                            <div className="row border-top mt-3 pt-2 mb-2 align-items-center">
                                                        <h5 className="col-12">Extras:</h5>
                                            {this.state.extraOpts.map((opt, ind: number) => {
                                                const index = values.extras.findIndex(p => p.id === opt.id);
                                                const isChecked = index !== -1;

                                                return (
                                                    <div key={opt.id} className="row mt-3 pt-2 pb-2 align-items-center">
                                                        {/* CHECKBOX */}
                                                        <div className="col-md-6 form-group">
                                                            <div className="form-check">
                                                                <input
                                                                    type="checkbox"
                                                                    className="form-check-input form-control"
                                                                    checked={isChecked}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            setFieldValue('extras', [
                                                                                ...values.extras,
                                                                                { id: opt.id, price: 0 }
                                                                            ]);
                                                                        } else {
                                                                            setFieldValue(
                                                                                'extras',
                                                                                values.extras.filter(p => p.id !== opt.id)
                                                                            );
                                                                        }
                                                                    }}
                                                                />
                                                                <label className="form-check-label">
                                                                    {opt.name}
                                                                </label>
                                                            </div>
                                                        </div>

                                                        {/* PRICE INPUT (only if checked) */}
                                                        {false && (<div className="col-md-12">
                                                            {isChecked && (
                                                                <Field
                                                                    type="number"
                                                                    name={`extras.${ind}.price`}
                                                                    className="form-control"
                                                                    placeholder="Enter price"
                                                                />


                                                            )}
                                                        </div>)}

                                                        {true && isChecked && (
                                                            <div className="col-md-6">
                                                                <label htmlFor="pricePrice"> Price: </label>
                                                                <div className="input-group">
                                                                    <Field
                                                                        name={`extras.${index}.price`}
                                                                        className="form-control"
                                                                        aria-describedby="prepPriceHelp"
                                                                    />
                                                                    <div className="input-group-append">
                                                                        <span className="input-group-text" id="basic-addon2">USD</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                    </div>
                                                );
                                            })}
                                            </div>
                                        </div>

                                        {/* BOTTOM FULL WIDTH */}
                                        {/* PORTIONS / PRICES */}
                                        <div className="col-12 mt-4 pt-3 pb-3 border-top">
                                            <div className="border-top container">
                                                <div className="row">

                                                    <h3 className="section-title mb-3">Portions</h3>
                                                    <FieldArray
                                                        key={this.state.key}
                                                        name="prices"
                                                        render={arrayHelpers => (
                                                            <>
                                                                {values.prices && values.prices.length > 0 ? (
                                                                    values.prices.map((price, index) => (
                                                                        <>
                                                                            <div className="form-group col-md-5 ps-0 pe-0">
                                                                                <label htmlFor="priceName">Portion name</label>
                                                                                <Field
                                                                                    name={`prices.${index}.name`}
                                                                                    className="form-control"
                                                                                    aria-describedby="prepNameHelp"
                                                                                    />
                                                                            </div>
                                                                            <div className="form-group col-md-4 ps-1 pe-1">
                                                                                <label htmlFor="portionSize"> Portion Size: </label>
                                                                                <div className="input-group">
                                                                                    <Field
                                                                                        name={`prices.${index}.portion_size`}
                                                                                        className="form-control"
                                                                                        aria-describedby="portionSizeHelp"
                                                                                    />
                                                                                    <div className="input-group-append">
                                                                                        <span className="input-group-text" id="basic-addon2">g</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="form-group col-md-3 ps-0 pe-0">
                                                                                <label htmlFor="pricePrice"> Price: </label>
                                                                                <div className="input-group">
                                                                                    <Field
                                                                                        name={`prices.${index}.price`}
                                                                                        className="form-control"
                                                                                        aria-describedby="prepPriceHelp"
                                                                                    />
                                                                                    <div className="input-group-append">
                                                                                        <span className="input-group-text" id="basic-addon2">USD</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            
                                                                            <button className="btn btn-danger mt-2" type="button" onClick={() => arrayHelpers.remove(index)}> - </button>
                                                                            {errors.prices?.at(index) && 
                                                                                <div className="form-group col-md-12 ps-0 pe-0 d-none">
                                                                                    {(errors.prices.at(index) as FormikErrors<IPortionPrice>).name?.length &&
                                                                                        <>
                                                                                            <small id={`errors${index}Help`} className="form-text text-danger">{(errors.prices.at(index) as FormikErrors<IPortionPrice>).name}</small><br />
                                                                                        </>
                                                                                    }
                                                                                    {(errors.prices.at(index) as FormikErrors<IPortionPrice>).portion_size?.length &&
                                                                                        <>
                                                                                            <small id={`errors${index}Help`} className="form-text text-danger">{(errors.prices.at(index) as FormikErrors<IPortionPrice>).portion_size}</small><br />
                                                                                        </>    
                                                                                    }
                                                                                    {
                                                                                        <>
                                                                                            <small id={`errors${index}Help`} className="form-text text-danger">{(errors.prices.at(index) as FormikErrors<IPortionPrice>).price}</small><br />
                                                                                        </>
                                                                                    }
                                                                                </div>
                                                                            }
                                                                        </>



                                                                    ))
                                                                ) : (

                                                                <></>

                                                                )}
                                                                <div className="col-12 mt-4">

                                                                    <button 
                                                                        type="button"
                                                                        onClick={() => {
                                                                            arrayHelpers.push({name: '', price: 0})
                                                                            this.formikRef.current?.setFieldTouched('prices');
                                                                            // debugger;
                                                                            this.refreshFieldset()}}
                                                                            className="btn btn-outline-secondary w-100 py-2"
                                                                            >
                                                                        <GoPlus />
                                                                    {/* show this when user has removed all friends from the list */}

                                                                        Add a portion

                                                                    </button>
                                                                </div>
                                                            </>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* SHOW / HIDE ENTRIES / ERRORS */}
                                        <div className="d-none">
                                            {'Is submitting: ' + isSubmitting}<br />
                                            {'Is valid: ' + isValid} <br />
                                            {'Is dirty: ' + dirty} <br />
                                            <br />
                                            <span>Errors: </span>
                                            <small>{JSON.stringify(errors)}</small>
                                            <br />
                                            <span>Values:</span><br />
                                            {Object.entries(values).map(function(value, key) {
                                                // eslint-disable-next-line
                                                return (<>
                                                    <small>Key: {key}</small><br />
                                                    <small>Value: {JSON.stringify(value)}</small><br />
                                                </>)
                                            })}
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
            </Modal>
            <CreateIngridient
                isOpen={this.state.isIngridientModalOpened}
                type="modal"
                closeCreateIngridientModal={this.closeCreateIngridientModal}
                addNewIngridientItem={this.addNewIngridientItem}
                style={{zIndex: 100000}}
            />
            <CreatePreference
                isOpen={this.state.isPreferencesModalOpened}
                type="modal"
                closeCreatePreferenceModal={this.closeCreatePreferencesModal}
                addNewPreferenceItem={this.addNewPreferenceItem}
                style={{zIndex: 100000}}
            />
        </>
        )
    }

    onSubmit = async(event: any) => {
        // (event as Event).stopPropagation();
        // (event as Event).preventDefault();
        let form = event.target;
        let data: unknown = {
            name: event.name,
            description: event.description,
            picture: this.state.imageFile,
            quantity: event.quantity,
            category_id: event.category,
            prep_time: event.prep_time,
            extras: event.extras,
            preferences: event.preferences,
            prices: event.prices,
            ingridients: event.ingridients
        }
        // debugger;
        Store.dispatch(enableLoading({}));
        const response = await MenuAPI.createMenu(data as TMenu);
        // const response = {success: false, data: {} };
        setTimeout(() => {
            Store.dispatch(disableLoading({}));
        })
        if(response && response.success == true) {
            // update menu items
            this.closeModal();
            const data: MenuCreateResponseItem = response.data as MenuCreateResponseItem;
            const it: TMenu = data.item;
            it.new = true;
            this.props.addNewMenuItem(it);
            showToast.success('Menu created successfully');
        }
        else {
            // alert('Unexpected error occured');
            showToast.error('There\'s problem creating menu. Try again later');
        }
    }

    async fetchCategories() {
        const categories = await CategoriesAPI.getItems();
        if(categories && categories.length) {
            const options: Array<IOption> = [];
            this.setState({ categories: categories as TCategories });
            categories.forEach((category: ICategory) => {
                options.push({
                    id: category.id,
                    label: category.name,
                    value: category.id,
                    name: category.name,
                })
            })
            this.setState({ categoryOptions: options });
        }
    }

    fetchIngridients = async() => {
        const items = await IngridientsAPI.getItems();
        if(items) {
            this.setState({ ingridients: items });
        }
    }

    fetchPreferences = async() => {
        const items = await PreferencesAPI.getItems();
        if(items) {
            this.setState({ preferences: items });
        }
    }

    fetchExtras = async() => {
        const items = await ExtrasAPI.getItems();
        // don't need this here
        // if(items) {
        //     this.formikRef.current?.setFieldValue('extras', items);
            // this.setState({ extras: items });
        // }

        const opts: TMenuExtras = [];
        const extraOpts = items?.map((item: IExtra) => {
            opts.push({
                id: item.id,
                name: item.name,
                price: 0
            } as IMenuExtra)
        })
        this.setState({ extraOpts: opts });
    }
}

export default CreateMenu;
