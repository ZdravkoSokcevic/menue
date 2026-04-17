import React, { BaseSyntheticEvent, ChangeEventHandler } from "react";
import Modal from "react-modal";
import { Formik, Form, Field, FormikProps, FieldArray, ErrorMessage } from 'formik';
import * as Yup from "yup";

import { FaSave } from "react-icons/fa";
import { Button, Input, TextField } from "@mui/material";

import "../../../sass/modal.scss"
import MediaHelper from "@/helpers/MediaHelper";
import MenuAPI from "@/api/MenuAPI";
import { MenuCreateResponseItem, TMenu } from "@/types/Menu";
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

interface IProps {
    // can be page or modal
    currentItem: TMenu
    closeModal?: Function;
    editCurrentItem: Function;
};
interface IState {
    isDragging: boolean;
    imageFile?: File | null;
    // Error with image type
    // @ts-ignore
    image?: Image | null;
    key: number;
    categories: TCategories;
    categoryOptions: Array<Option>;
    ingridients: TIngridients;
    preferences: TPreferences;
    choosenIngridients: Array<string | number>;
    isIngridientModalOpened: boolean;
    isPreferencesModalOpened: boolean;
    extraOpts: TMenuExtras;
};

// use for creation
interface IPortionPrice {
    id?: string;
    name: string;
    portion_size: number;
    portion_unit?: string;
    // use for edit only
    pivot?: {
        portion_size: number;
        name: string;
    }
    price: number;
}

type TPrices = Array<IPortionPrice>;

interface IintiialValues {
    name: string;
    description: string;
    picture: File[] | null;
    picture_exists: string | null;
    quantity: number;
    prep_time: number;
    prices: TPrices;
    ingridients: TMenuIngridients;
    preferences: TMenuPreferences;
    extras: TMenuExtras;
}

const initialValues: IintiialValues = {
    name: '',
    description: '',
    picture: null,
    picture_exists: 'false',
    quantity:0,
    prep_time: 0,
    prices: [] as TPrices,
    ingridients: [],
    preferences: [],
    extras: []
}

const menuValidationSchema = Yup.object().shape({
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
picture: Yup.mixed()
    .nullable() // Tell Yup null is a data type we allow
    .notRequired()
    .test('picture-check', 'A picture is required', function(value) {
        const { picture_exists } = this.parent;

        // 1. Log to be 100% sure what's happening
        console.log('Checking picture:', { value, picture_exists });

        // 2. The "Loose" check (works for true or "true")
        if (picture_exists == true || picture_exists == 'true') {
            return true; // It's valid because an old one exists!
        }

        // 3. If no old one exists, 'value' cannot be null or undefined
        return value !== null && value !== undefined;
    })
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
    quantity: Yup.number()
        .min(1, 'At least one is required')
        .max(15, 'Cannot order more than 15 portions')
        .required('Portion number is required'),
    prep_time: Yup.number()
        .min(1, 'At least one minut is required')
        .max(300, 'Preparation time cannot be bigger than 300mins')
        .required('Preparation time is required!'),
    prices: Yup.array()
        .of(
            Yup.object().shape({
                name: Yup.string().min(4, 'Name too short!').required('Portion name is required'),
                portion_size: Yup.number().min(0, 'Min price is 0').max(10000, 'Max price is 10000').required('Portion size is required!'),
                price: Yup.number().min(0, 'Min price is 0').max(10000, 'Max price is 10000').required('Price is required!')
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
    )
});

class EditMenu extends React.Component<IProps, IState>
{
    private fileInputRef = React.createRef<HTMLInputElement>();
    private formikRef = React.createRef<FormikProps<IintiialValues>>();
    private categoryInputRef = React.createRef<HTMLSelectElement>();

    private initialValues = {
        name: '',
        description: '',
        picture: null as String | File | null | undefined,
        quantity: 0,
        picture_exists: false,
        prep_time: 0
    }

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
        this.handleFileChange = this.handleFileChange.bind(this);
        this.formikRef.current?.setFieldValue('picture', null);
    }


    refreshFieldset = () => {
        this.setState({key: Math.random()});
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
                }
            }
            fReader.readAsDataURL(blobFile);
        }
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

    onCategoryChange(e: React.SyntheticEvent<HTMLSelectElement>) {
        // const targ = e.target;

    }

    handleImageLoad(event: any) {

    }

    handleFileLoad(event: any) {

    }

    closeModal() {
        if(this.props.closeModal)
            this.props.closeModal();
    }

    componentDidMount(): void {
        this.fetchCategories();
        this.fetchExtras();
        this.fetchIngridients();
        this.fetchPreferences();
        console.log(this.props.currentItem);

        // Need to do special adjustments on init
        this.initFormData();
    }

    initFormData() {
        this.formikRef.current?.setFieldTouched('name', true);
        this.formikRef.current?.setFieldTouched('description');
        this.formikRef.current?.setFieldTouched('quantity');
        this.formikRef.current?.setFieldValue('category', this.props.currentItem.category_id);
        this.formikRef.current?.setFieldValue('prep_time', this.props.currentItem.prep_time);

        const ingridients: TIngridients = this.props.currentItem.ingridients as TIngridients;
        const extras: TExtras = this.props.currentItem.extras as TExtras;
        const preferences: TPreferences = this.props.currentItem.preferences as TPreferences;
        const prices: TPrices = this.props.currentItem.portions as TPrices;
        const item = this.props.currentItem;
        console.log(prices);
        // enable included ingridients to be checked
        if(ingridients && ingridients.length) {
            const selected: TMenuIngridients = [];
            ingridients.map((ingridient: IIngridient) => selected.push(ingridient.id));
            this.formikRef.current?.setFieldValue('ingridients', selected);
        }
        // enable included preferences to be checked
        if(preferences && preferences.length) {
            const selected: TMenuPreferences = [];
            preferences.map((preference: IPreference) => selected.push(preference.id));
            this.formikRef.current?.setFieldValue('preferences', selected);
        }
        // enable included extras to be checked
        if(extras && extras.length) {
            const selected: TMenuExtras = [];
            extras.map((extra: IExtra) => {
                let price: number = 0.0;
                if(extra.prices[0]) {
                    const pr: IPrice = extra.prices[0] as IPrice;
                    price = pr.price;
                }
                const item: IMenuExtra = {
                    id: extra.id,
                    name: extra.name,
                    price: price as number
                }
                selected.push(item);
            });
            this.formikRef.current?.setFieldValue('extras', selected);
        }
        // Include added portions
        if(prices && prices.length) {
            const selected: TPrices = [];
            prices.map((price: IPortionPrice) => {
                const d: IPortionPrice = {
                    name: price.name as string,
                    portion_size: price.pivot?.portion_size as number,
                    portion_unit: 'usd',
                    price: price.price
                }
                // check for portion_id
                if(price.id)
                    d.id = price.id;
                selected.push(d);
            })
            this.formikRef.current?.setFieldValue('prices', selected);
        }
    }
    

    render(): React.ReactNode {
        // Create a NEW object reference here
        const hasExistingPicture = !!this.props.currentItem.picture;
        const currentInitialValues: IintiialValues = {
            name: this.props.currentItem.name || '',
            description: this.props.currentItem.description || '',
            quantity: Number(this.props.currentItem.quantity) || 1,
            picture: null,
            picture_exists: hasExistingPicture ? "true" : "false", // Boolean
            prep_time: 0,
            prices: [],
            ingridients: [],
            preferences: [],
            extras: []
        };

        return (
                <div className="form-page">


                    <h2>Edit menu</h2>
                    <button className="close-btn" onClick={() => this.closeModal()}>x</button>

                    <Formik 
                        initialValues={currentInitialValues}
                        validationSchema={menuValidationSchema}
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

                                <div className="col-md-6 border-end p-5">
                                    {/* PICTURE */}
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
                                            backgroundImage: 
                                                (this.props.currentItem.picture && !this.state.image) ? 
                                                    `url(/storage/${this.props.currentItem.picture})` : 
                                                    `url(${this.state.image.src})`,
                                            backgroundSize: 'cover',
                                            position: 'relative'
                                        }}
                                        className="placeholder-4-3"
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
                                        {errors.picture && touched.picture ? (
                                            <><small id="pictureHelp" className="form-text text-danger">{this.formikRef.current?.errors.picture}</small><br /></>
                                        ) : null}
                                    </div>

                                    {/* QUANTITY */}
                                    <div className="form-group">
                                        <label>Quantity</label>
                                        <Field 
                                            name="quantity" 
                                            className="form-control" 
                                            id="quantity" 
                                            aria-describedby="quantityHelp" 
                                            placeholder="Quantity"
                                            type="number"
                                        />
                                        {errors.quantity && touched.quantity ? (
                                            <><small id="quantityHelp" className="form-text text-danger">{this.formikRef.current?.errors.quantity}</small><br /></>
                                        ) : null}
                                        <small id="nameHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                                    </div>

                                    {/* PREPARATION TIME */}
                                    <div className="form-group">
                                        <label>Preparation time:</label>
                                        <Field 
                                            name="prep_time" 
                                            className="form-control" 
                                            id="quantity" 
                                            aria-describedby="prepTimeHelp" 
                                            placeholder="Preparation time"
                                        />
                                        {errors.prep_time && touched.prep_time ? (
                                            <><small id="prepTimeHelp" className="form-text text-danger">{this.formikRef.current?.errors.quantity}</small><br /></>
                                        ) : null}
                                        <small id="prepTimeHelp" className="form-text text-muted">Dish preparation time (in minutes)</small>
                                    </div>
                                    
                                </div>

                                <div className="col-md-6 p-5">
                                    {/* NAME */}
                                    <div className="form-group">
                                        <label>Name</label>
                                        <Field 
                                            name="name" 
                                            className="form-control" 
                                            placeholder="Enter name of your menu" 
                                            aria-describedby="nameHelp"
                                        />
                                        {errors.name && touched.name ? (
                                            <><small id="nameHelp" className="form-text text-danger">{this.formikRef.current?.errors.name}</small><br /></>
                                        ) : null}
                                        <small id="nameHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
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
                                        />
                                        {errors.description && touched.description ? (
                                            <><small id="descriptionHelp" className="form-text text-danger">{this.formikRef.current?.errors.description}</small><br /></>
                                        ) : null}
                                        <small id="nameHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                                    </div>

                                    {/* CATEGORY */}
                                    <div className="form-group">
                                        <label>Category</label>
                                        <FormikSearchSelect
                                            options={(this.state.categoryOptions as unknown) as Option[]}
                                            name="category"
                                            id="category"
                                            aria-describedby="categoryHelp"
                                            ref={this.categoryInputRef}
                                            onChange={this.onCategoryChange}
                                        />
                                    </div>

                                    {/* INGRIDIENTS */}
                                    {this.state.ingridients.length &&
                                    <div className="border-top mt-3 pt-2">
                                        <h5>Ingridients:</h5>
                                        <FieldArray
                                            name="ingridients"
                                            render={arrayHelpers => (
                                                <div >
                                                    {/* <small>{JSON.stringify(arrayHelpers)}</small> */}
                                                    {this.state.ingridients.map((ingridient: IIngridient, index: number) => (
                                                        <div className="form-check" key={ingridient.id}>
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
                                                        </div>
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
                                    <div className="border-top mt-3 pt-2">
                                        <h5>Preferences:</h5>
                                        <FieldArray
                                            name="preferences"
                                            render={arrayHelpers => (
                                                <div >
                                                    {/* <small>{JSON.stringify(arrayHelpers)}</small> */}
                                                    {this.state.preferences.map((ingridient: IPreference, index: number) => (
                                                        <div className="form-check" key={ingridient.id}>
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
                                                        </div>
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
                                    {this.state.extraOpts.map((opt, ind: number) => {
                                        const index = values.extras.findIndex(p => p.id === opt.id);
                                        const isChecked = index !== -1;

                                        return (
                                            <div key={opt.id} className="row border-top mt-3 pt-2 mb-2 align-items-center">
                                                <h5 className="col-12">Extras:</h5>
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

                                {/* BOTTOM FULL WIDTH */}
                                {/* PORTIONS / PRICES */}
                                <div className="col-12 pb-3">
                                    <div className="border-top container">
                                        <div className="row">

                                            <label htmlFor="pricesFor">Portions</label>
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
                                                                    {errors.prices && <ErrorMessage name={`prices.${index}.name`} component={"div"} />}
                                                                    {errors.prices && <ErrorMessage name={`prices.${index}.price`} component={"div"} />}
                                                                    {errors.prices && <ErrorMessage name={`prices.${index}.currency`} component={"div"} />}
                                                                </>



                                                            ))
                                                        ) : (

                                                        <></>

                                                        )}
                                                            <button type="button"
                                                            onClick={() => {
                                                                arrayHelpers.push({name: '', price: 0, portion_size: 0})
                                                                this.formikRef.current?.setFieldTouched('prices');
                                                                // debugger;
                                                                this.refreshFieldset()}}
                                                                className="btn btn-primary mt-5"
                                                            >
                                                            <GoPlus />
                                                            {/* show this when user has removed all friends from the list */}

                                                            Add a portion

                                                        </button>
                                                    </>
                                                )}
                                            />
                                        </div>
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

        let data: TMenu = {
            id: this.props.currentItem.id,
            name: event.name,
            description: event.description,
            quantity: event.quantity,
            company_id: Store.getState().app.defaultCompany?.id,
            category_id: event.category,
            prep_time: event.prep_time,
            extras: event.extras,
            preferences: event.preferences,
            prices: event.prices,
            ingridients: event.ingridients
        }
        // debugger;
        if(event.picture != null && typeof event.picture != undefined && typeof (event.picture.name) == 'string')
            data.picture = event.picture;
        // debugger;
        Store.dispatch(enableLoading({}));
        const res= await MenuAPI.editMenu(data as TMenu);
        // const res = {success: false, data: {} };
        setTimeout(() => {
            Store.dispatch(disableLoading({}));
        })

        // if modal is case
        if(res && res.success == true)  {
            const responseData: MenuCreateResponseItem = res.data as MenuCreateResponseItem;
            this.props.editCurrentItem(responseData.item);
            this.closeModal();
        }
        else {
            alert('Unexpected error occured!');
            // this.closeModal();
        }
    }

    async fetchCategories() {
        const categories = await CategoriesAPI.getItems();
        if(categories && categories.length) {
            const options: Array<Option> = [];
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

export default EditMenu;