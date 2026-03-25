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
import { WidthHeight } from "@/types/Media";
import CategoriesAPI from "@/api/CategoriesAPI";
import { ICategory, TCategories } from "@/types/Categories";
import FormikSearchSelect from "../FormikSelectSearch";
import { Option } from "@/types/App";

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
    categoryOptions: Array<Option>;
};

const initialValues = {
    name: '',
    description: '',
    picture: null,
    quantity: 0
}

interface IintiialValues {
    name: string;
    description: string;
    picture: File[] | null;
    quantity: number;
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

    quantity: Yup.number()
        .min(1, 'At least one is required')
        .max(15, 'Cannot order more than 15 portions')
        .required('Portion number is required')
});

class CreateMenu extends React.Component<IProps, IState>
{
    private fileInputRef = React.createRef<HTMLInputElement>();
    private formikRef = React.createRef<FormikProps<IintiialValues>>();
    private categoryInputRef = React.createRef<HTMLSelectElement>();
    constructor(props: IProps) {
        super(props);
        this.state = {
            isDragging: false,
            categories: [],
            categoryOptions: []
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

    componentDidMount(): void {
        this.fetchCategories();
    }
    

    render(): React.ReactNode {
        return (
            <Modal 
                isOpen={this.props.isOpen as boolean} 
                onRequestClose={() => this.closeModal()}
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 w-100 full-w-h"
                className="form-modal bg-white rounded-xl shadow-2xl max-w-md w-full p-6 outline-none"
                style={{}}
                contentLabel="Example"
            >
                <div className="form-page">


                    <h2>Create menu</h2>
                    <button className="close-btn" onClick={() => this.closeModal()}>x</button>

                    <Formik 
                        initialValues={initialValues}
                        validationSchema={menuValidationSchema}
                        onSubmit={this.onSubmit}
                        innerRef={this.formikRef}
                    >

                    {({ errors, touched, setFieldValue, isSubmitting, isValid, dirty }) => (

                        <Form encType="multipart/form-data">
                        <div className="container-fluid">
                            <div className="row">

                                <div className="col-md-6 border-end p-5">
                                    <div className="form-group">
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
                                            <p>Drag file here</p>

                                            <input
                                                type="file"
                                                ref={this.fileInputRef}
                                                onChange={(event: any) => this.handleFileChange(event as ChangeEventHandler<HTMLInputElement>)}
                                                // Hide the actual input element, but keep it accessible to screen readers using opacity: 0
                                                style={{ opacity: 0, height: 0, width: 0, position: 'absolute' }}
                                            />
                                        </div>
                                        {errors.picture  ? (
                                            <><small id="pictureHelp" className="form-text text-danger">{errors.picture}</small><br /></>
                                        ) : null}
                                    </div>

                                    <div className="form-group">
                                        <label>Quantity</label>
                                        <Field name="quantity" className="form-control" id="quantity" aria-describedby="quantityHelp" placeholder="Quantity"/>
                                        {errors.quantity && touched.quantity ? (
                                            <><small id="quantityHelp" className="form-text text-danger">{errors.quantity}</small><br /></>
                                        ) : null}
                                        <small id="nameHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                                    </div>
                                    
                                </div>

                                <div className="col-md-6 p-5">

                                    <div className="form-group">
                                        <label>Name</label>
                                        <Field name="name" className="form-control" placeholder="Enter name of your menu" aria-describedby="nameHelp"/>
                                        {errors.name && touched.name ? (
                                            <><small id="nameHelp" className="form-text text-danger">{errors.name}</small><br /></>
                                        ) : null}
                                        <small id="nameHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                                    </div>

                                    {/* DESCRIPTION */}
                                    <div className="form-group">
                                        <label>Description</label>
                                        <Field type="text" className="form-control" name="description" aria-describedby="descriptionHelp" rows={6} placeholder="Enter a description" />
                                        {errors.description && touched.description ? (
                                            <><small id="descriptionHelp" className="form-text text-danger">{errors.description}</small><br /></>
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
                                    { 'Errors: ' + JSON.stringify(errors) } */}
                                    <div className="controls">
                                        <button className="submit" disabled={isSubmitting || !isValid || !dirty}>
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
            </Modal>   
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
            company_id: Store.getState().app.defaultCompany?.id
        }
        // debugger;
        Store.dispatch(enableLoading({}));
        const response = await MenuAPI.createMenu(data as TMenu);
        setTimeout(() => {
            Store.dispatch(disableLoading({}));
        })
        if(response && response.success == true) {
            // update menu items
            this.closeModal();
            const data: MenuCreateResponseItem = response.data as MenuCreateResponseItem;
            this.props.addNewMenuItem(data.item);
        }
        else {
            alert('Unexpected error occured');
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

export default CreateMenu;