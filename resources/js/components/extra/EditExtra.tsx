import React from "react";
import Modal from "react-modal";
import { Formik, Form, Field, FormikProps } from 'formik';
import * as Yup from "yup";

import { FaSave } from "react-icons/fa";

import "../../../sass/modal.scss"
import { ICategory } from "@/types/Categories";
import { Store } from "@/reducers/Store";
import { disableLoading, enableLoading } from "@/reducers/appSlice";
import { IExtra } from "@/types/Extra";
import { IResponseItem } from "@/types/Api";
import ExtrasAPI from "@/api/ExtrasAPI";
import { showToast } from "@/helpers/Toast";

interface IProps {
    // can be page or modal
    currentItem: IExtra;
    closeModal?: () => void;
    editCurrentItem: Function;
};
interface IState {
    
};

interface IInitialValues {
    name: string;
    description: string;
    // price: number;
}

const initialValues: IInitialValues = {
    name: '',
    description: '',
    // price: 0
}

const categoryValidationSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Too short!')
        .max(50, 'Too long!')
        .required('Required'),
    description: Yup.string()
        .min(15, 'Description is too short')
        .max(255, 'Description is too long')
        .required('Required'),
    // price: Yup.number()
    //     .min(0.1, 'Please input bigger value')
    //     .max(1000, 'Extra price cannot be bigger than 1000')
    //     .required('Required')
});

class EditExtra extends React.Component<IProps, IState>
{
    private formikRef = React.createRef<FormikProps<IInitialValues>>();
    constructor(props: IProps) {
        super(props);
        this.state = {
            isDragging: false
        }
    }

    closeModal() {
        if(this.props.closeModal)
            this.props.closeModal();
    }
    

    render(): React.ReactNode {
        // Create a NEW object reference here
        const currentInitialValues = {
            name: this.props.currentItem.name || '',
            description: this.props.currentItem.description || ''
        };

        return (
                <div className="form-page">

                    <div className="modal-header">
                        <h2>Edit extra</h2>
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

                    {({ errors, touched, setFieldValue, isSubmitting, isValid, dirty, values }) => (

                        <Form encType="multipart/form-data" className="modal-form-content">
                            <div className="modal-scroll-body">
                                <div className="container-fluid p-0 mb-5">
                                    <div className="row g-4">
                                        <div className="col-md-6 border-end p-5">
                                            {/* NAME */}
                                            <div className="form-group">
                                                <label className="form-label">Name</label>
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
                                            
                                        </div>

                                        <div className="col-md-6 p-5">

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
                                                <small id="nameHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
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

        let data: IExtra = {
            id: this.props.currentItem.id,
            name: event.name,
            description: event.description, 
        }
        Store.dispatch(enableLoading({}));
        const res= await ExtrasAPI.editExtra(data as IExtra);
        setTimeout(() => {
            Store.dispatch(disableLoading({}));
        })
        // if modal is case
        if(res && res.success == true)  {
            const responseData: IResponseItem = res.data as IResponseItem;
            this.props.editCurrentItem(responseData.item);
            this.closeModal();
            showToast.success('Extra saved successfully');
        }
        else {
            showToast.error('There\'s problem updating extra. Try again later');
        }
    }
}

export default EditExtra;