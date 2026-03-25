import React, { BaseSyntheticEvent, ChangeEventHandler } from "react";
import Modal from "react-modal";
import { Formik, Form, Field, FormikProps } from 'formik';
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
    categories: TCategories;
    categoryOptions: Array<Option>;
};

interface IintiialValues {
    name: string;
    description: string;
    picture: File[] | null;
    picture_exists: string | null;
    quantity: number;
}

const initialValues: IintiialValues = {
    name: '',
    description: '',
    picture: null,
    picture_exists: 'false',
    quantity:0
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
        .required('Portion number is required')
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
        picture_exists: false
    }

    constructor(props: IProps) {
        super(props);
        this.state = {
            isDragging: false,
            categories: [],
            categoryOptions: []
        }
        // this.handleImageLoad = this.handleImageLoad.bind(this);
        // this.handleFileLoad = this.handleFileLoad.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.formikRef.current?.setFieldValue('picture', null);
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

    onCategoryChange(e: React.SyntheticEvent<HTMLSelectElement>) {

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
    }
    

    render(): React.ReactNode {
        // Create a NEW object reference here
        const hasExistingPicture = !!this.props.currentItem.picture;
        const currentInitialValues = {
            name: this.props.currentItem.name || '',
            description: this.props.currentItem.description || '',
            quantity: Number(this.props.currentItem.quantity) || 1,
            picture: null,
            picture_exists: hasExistingPicture, // Boolean
        };
        this.formikRef.current?.setFieldTouched('name', true);
        this.formikRef.current?.setFieldTouched('description');
        this.formikRef.current?.setFieldTouched('quantity');
        this.formikRef.current?.setFieldValue('category', this.props.currentItem.category_id);

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

                    {({ errors, touched, setFieldValue, isSubmitting, isValid, dirty }) => (

                        <Form encType="multipart/form-data">
                        <div className="container-fluid">
                            <div className="row">

                                <div className="col-md-6 border-end p-5">
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
                                    
                                </div>

                                <div className="col-md-6 p-5">

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

        let data: TMenu = {
            id: this.props.currentItem.id,
            name: event.name,
            description: event.description,
            quantity: event.quantity,
            company_id: Store.getState().app.defaultCompany?.id,
            category_id: event.category
        }
        // debugger;
        if(event.picture != null && typeof event.picture != undefined && typeof (event.picture.name) == 'string')
            data.picture = event.picture;
        Store.dispatch(enableLoading({}));
        const res= await MenuAPI.editMenu(data as TMenu);
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
}

export default EditMenu;