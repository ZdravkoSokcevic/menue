import React, { BaseSyntheticEvent, ChangeEventHandler } from "react";
import Modal from "react-modal";
import { Formik, Form, Field, FormikProps } from 'formik';
import * as Yup from "yup";

import { FaSave } from "react-icons/fa";
import { Button, Input, TextField } from "@mui/material";

import "../../../sass/modal.scss"
import MediaHelper from "@/helpers/MediaHelper";
import CategoriesAPI from "@/api/CategoriesAPI";
import { ICategory } from "@/types/Categories";
import { Store } from "@/reducers/Store";
import { disableLoading, enableLoading } from "@/reducers/appSlice";
import { AxiosResponse } from "axios";
import { ICategoriesResponseItem } from "@/types/Categories";
import { IResponseItem } from "@/types/Api";
import { ICompanyTable } from "@/types/TCompanyTables";
import TablesAPI from "@/api/TablesAPI";
import { showToast } from "@/helpers/Toast";

interface IProps {
    // can be page or modal
    currentItem: ICategory
    closeModal?: Function;
    editCurrentItem: Function;
};
interface IState {
    isDragging: boolean;
    imageFile?: File | null;
    // Error with image type
    // @ts-ignore
    image?: Image | null;
};

interface IInitialValues {
    name: string;
}

const initialValues: IInitialValues = {
    name: '',
}

const categoryValidationSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Too short!')
        .max(50, 'Too long!')
        .required('Required')
});

class EditCompanyTable extends React.Component<IProps, IState>
{
    private fileInputRef = React.createRef<HTMLInputElement>();
    private formikRef = React.createRef<FormikProps<IInitialValues>>();

    constructor(props: IProps) {
        super(props);
        this.state = {
            isDragging: false
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

    handleImageLoad(event: any) {

    }

    handleFileLoad(event: any) {

    }

    closeModal() {
        if(this.props.closeModal)
            this.props.closeModal();
    }
    

    render(): React.ReactNode {
        // Create a NEW object reference here
        const hasExistingPicture = !!this.props.currentItem.picture;
        const currentInitialValues = {
            name: this.props.currentItem.name || '',
        };
        this.formikRef.current?.setFieldTouched('name', true);

        return (
                <div className="form-page">

                    <div className="modal-header">
                        <h2>Translations</h2>
                        <button className="close-btn" onClick={() => this.closeModal()}>&times;</button>
                    </div>

                    <Formik 
                        initialValues={currentInitialValues}
                        validationSchema={categoryValidationSchema}
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
                                <div className="container-fluid p-0 mb-5">
                                    <div className="row g-4">

                                        <div className="col-md-6 p-5">

                                            <div className="form-group">
                                                <label>Name</label>
                                                <Field 
                                                    name="name" 
                                                    className="form-control" 
                                                    placeholder="Enter name of your category" 
                                                    aria-describedby="nameHelp"
                                                />
                                                {errors.name && touched.name ? (
                                                    <><small id="nameHelp" className="form-text text-danger">{this.formikRef.current?.errors.name}</small><br /></>
                                                ) : null}
                                                <small id="nameHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                                            </div>

                                            

                                            {/* {'Is submitting: ' + isSubmitting}<br />
                                            {'Is valid: ' + isValid} <br />
                                            {'Is dirty: ' + dirty} <br />
                                            { 'Errors: ' + JSON.stringify(errors) } */}
                                            {/* { 'CurrentItem' + JSON.stringify(this.props.currentItem) } */}
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
        // (event as Event).stopPropagation();
        // (event as Event).preventDefault();

        let data: ICategory = {
            id: this.props.currentItem.id,
            name: event.name,
            company_id: Store.getState().app.defaultCompany?.id
        }
        // debugger;
        // if(event.picture != null && typeof event.picture != undefined && typeof (event.picture.name) == 'string')
        //     data.picture = event.picture;
        Store.dispatch(enableLoading({}));
        const res= await TablesAPI.editCompanyTable(data as ICompanyTable);
        setTimeout(() => {
            Store.dispatch(disableLoading({}));
        })
        // if modal is case
        if(res && res.success == true)  {
            const responseData: IResponseItem<ICompanyTable> = res.data as IResponseItem<ICompanyTable>;
            this.props.editCurrentItem(responseData.item);
            this.closeModal();
            showToast.success('Table saved successfully');
        }
        else {
            showToast.error('There\'s problem updating table. Try again later');
            // this.closeModal();
        }
    }
}

export default EditCompanyTable;