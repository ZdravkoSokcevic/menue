import React, { BaseSyntheticEvent, ChangeEventHandler } from "react";
import Modal from "react-modal";
import { Formik, Form, Field, FormikProps } from 'formik';
import * as Yup from "yup";

import { FaSave } from "react-icons/fa";
import { Button, Input, TextField } from "@mui/material";

import "../../../sass/modal.scss"
import MediaHelper from "@/helpers/MediaHelper";
import CategoriesAPI from "@/api/CategoriesAPI";
import { Store } from "@/reducers/Store";
import { disableLoading, enableLoading } from "@/reducers/appSlice";
import { ICategoriesResponseItem, ICategory } from "@/types/Categories";
import { showToast } from "@/helpers/Toast";

interface IProps {
    // can be page or modal
    type: 'modal', // can be modal or page
    isOpen?: boolean;
    closeCreateCategoryModal: Function;
    addNewCategoryItem: Function;
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
    picture: null
}

interface IInitialValues {
    name: string;
    picture: File[] | null;
}

const categoryValidationSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Too short!')
        .max(50, 'Too long!')
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
});

class CreateCategory extends React.Component<IProps, IState>
{
    private fileInputRef = React.createRef<HTMLInputElement>();
    private formikRef = React.createRef<FormikProps<IInitialValues>>();
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
        this.props.closeCreateCategoryModal();
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
               overlayClassName="modal-backdrop-blur"
                className="form-modal"
                contentLabel="Create category"
            >
                <div className="form-page">

                    <div className="modal-header">
                        <h2>Create category</h2>
                        <button className="close-btn" onClick={() => this.closeModal()}>&times;</button>
                    </div>

                    <Formik 
                        initialValues={initialValues}
                        validationSchema={categoryValidationSchema}
                        onSubmit={this.onSubmit}
                        innerRef={this.formikRef}
                    >

                    {({ errors, touched, setFieldValue, isSubmitting, isValid, dirty, values }) => (

                        <Form encType="multipart/form-data" className="modal-form-content">
                        <div className="container-fluid p-0 mb-5">
                            <div className="modal-scroll-body">
                                <div className="row g-4">

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
                                                />
                                            </div>
                                            {errors.picture && touched.picture ? (
                                                <><small id="pictureHelp" className="form-text text-danger">{errors.picture}</small><br /></>
                                            ) : null}
                                        </div>
                                        
                                    </div>

                                    <div className="col-md-6 p-5">

                                        <div className="form-group">
                                            <label className="form-label">Name</label>
                                            <Field name="name" className="form-control" placeholder="Enter name of your category" aria-describedby="nameHelp"/>
                                            {errors.name && touched.name ? (
                                                <><small id="nameHelp" className="form-text text-danger">{errors.name}</small><br /></>
                                            ) : null}
                                            <small id="nameHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                                        </div>
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
        )
    }

    onSubmit = async(event: any) => {
        // (event as Event).stopPropagation();
        // (event as Event).preventDefault();
        let form = event.target;
        let data: unknown = {
            name: event.name,
            picture: this.state.imageFile
        }
        Store.dispatch(enableLoading({}));
        const response = await CategoriesAPI.createCategory(data as ICategory);
        setTimeout(() => {
            Store.dispatch(disableLoading({}));
        })
        if(response && response.success == true) {
            // update category items
            this.closeModal();
            const data: ICategoriesResponseItem = response.data as ICategoriesResponseItem;
            this.props.addNewCategoryItem(data.item);
            showToast.success('Category created successfully');
        }
        else {
            showToast.error('There\'s problem creating category. Try again later');
        }
    }
}

export default CreateCategory;