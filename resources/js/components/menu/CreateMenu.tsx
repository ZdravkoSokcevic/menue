import React, { BaseSyntheticEvent, ChangeEventHandler } from "react";
import Modal from "react-modal";
import { Formik, Form, Field, FormikProps } from 'formik';
import * as Yup from "yup";

import { FaSave } from "react-icons/fa";
import { Button, Input, TextField } from "@mui/material";

import "../../../sass/modal.scss"
import MediaHelper from "@/helpers/MediaHelper";
import MenuAPI from "@/api/MenuAPI";
import { TMenu } from "@/types/Menu";
import { Store } from "@/reducers/Store";
import { disableLoading, enableLoading } from "@/reducers/appSlice";

interface IProps {
    // can be page or modal
    type: 'modal', // can be modal or page
    isOpen?: boolean;
    closeCreateMenuModal: Function;
};
interface IState {
    isDragging: boolean;
    imageFile?: File | null;
    // Error with image type
    // @ts-ignore
    image?: Image | null;
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
    // picture: Yup.mixed()
    //     .test('dynamicFileSize', 'File not exists', (value, context) => {
    //         debugger;
    //     }),
    // Picture/file validation actually will not work
    // because file is always empty
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
        ),
    quantity: Yup.number()
        .min(1, 'At least one is required')
        .max(15, 'Cannot order more than 15 portions')
        .required('Portion number is required')
});

class CreateMenu extends React.Component<IProps, IState>
{
    private fileInputRef = React.createRef<HTMLInputElement>();
    private formikRef = React.createRef<FormikProps<IintiialValues>>();
    constructor(props: IProps) {
        super(props);
        this.state = {
            isDragging: false
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

    handleImageLoad(event: any) {

    }

    handleFileLoad(event: any) {

    }

    // Not be used
    validateFile = async(f: File) => {
        // let f = this.state.imageFile;

    }
    

    render(): React.ReactNode {
        return (
            <Modal 
                isOpen={this.props.isOpen as boolean} 
                onRequestClose={() => this.closeModal()}
                className={"form-modal p-5"}
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

                        <Form onSubmit={this.onSubmit} encType="multipart/form-data">
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
                                            height: '200px',
                                            width: '200px',
                                            backgroundImage: this.state.image ? `url(${this.state.image.src})` : '',
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
                                                required
                                            />
                                        </div>
                                        {errors.picture && touched.picture ? (
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

                                    <div className="form-group">
                                        <label>Description</label>
                                        <Field type="text" className="form-control" name="description" aria-describedby="descriptionHelp" rows={6} placeholder="Enter a description" />
                                        {errors.description && touched.description ? (
                                            <><small id="descriptionHelp" className="form-text text-danger">{errors.description}</small><br /></>
                                        ) : null}
                                        <small id="nameHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                                    </div>

                                    {'Is submitting: ' + isSubmitting}<br />
                                    {'Is valid: ' + isValid} <br />
                                    {'Is dirty: ' + dirty} <br />
                                    { 'Errors: ' + JSON.stringify(errors) }
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
        (event as Event).stopPropagation();
        (event as Event).preventDefault();

        let form = event.target;
        let data: unknown = {
            name: form['name'].value,
            description: form['description'].value,
            picture: this.state.imageFile,
            quantity: form['quantity'].value,
            company_id: Store.getState().app.defaultCompany.id
        }
        Store.dispatch(enableLoading({}));
        let success = await MenuAPI.createMenu(data as TMenu);
        setTimeout(() => {
            Store.dispatch(disableLoading({}));
        })
        this.closeModal();
    }
}

export default CreateMenu;