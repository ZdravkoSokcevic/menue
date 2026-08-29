import React, { BaseSyntheticEvent, ChangeEventHandler } from "react";
import Modal from "react-modal";
import { Formik, Form, Field, FormikProps } from 'formik';
import * as Yup from "yup";

import { FaSave } from "react-icons/fa";
import { Button, Input, TextField } from "@mui/material";

import "../../../sass/modal.scss"
import MediaHelper from "@/helpers/MediaHelper";
import { Store } from "@/reducers/Store";
import { disableLoading, enableLoading } from "@/reducers/appSlice";
import ExtrasAPI from "@/api/ExtrasAPI";
import { IExtra } from "@/types/Extra";
import { IResponseItem } from "@/types/Api";
import { showToast } from "@/helpers/Toast";

interface IProps {
    // can be page or modal
    type: 'modal', // can be modal or page
    isOpen?: boolean;
    closeCreateExtraModal: () => void;
    addNewExtraItem: (item: IExtra) => void;
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


const extraValidationSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Too short!')
        .max(50, 'Too long!')
        .required('Required'),
    description: Yup.string()
        .min(20, 'Description is too short')
        .max(255, 'Description is too long')
        .required('Required'),
    // price: Yup.number()
    //     .min(0.1, 'Please input bigger value')
    //     .max(1000, 'Extra price cannot be bigger than 1000')
    //     .required('Required')
});

class CreateExtra extends React.Component<IProps, IState>
{
    private formikRef = React.createRef<FormikProps<IInitialValues>>();
    constructor(props: IProps) {
        super(props);
        this.state = {
            isDragging: false
        }
        
    }

    getIsOpen() {

    }

    closeModal() {
        this.props.closeCreateExtraModal();
    }
    
    render(): React.ReactNode {
        return (
            <Modal 
                isOpen={this.props.isOpen as boolean} 
                onRequestClose={() => this.closeModal()}
                overlayClassName="modal-backdrop-blur"
                className="form-modal"
                contentLabel="Create Menu item"
            >
                <div className="form-page">

                    <div className="modal-header">
                        <h2>Create Extra</h2>
                        <button className="close-btn" onClick={() => this.closeModal()}>&times;</button>
                    </div>

                    <Formik 
                        initialValues={initialValues}
                        validationSchema={extraValidationSchema}
                        onSubmit={this.onSubmit}
                        innerRef={this.formikRef}
                    >

                    {({ errors, touched, setFieldValue, isSubmitting, isValid, dirty, values }) => (

                        <Form encType="multipart/form-data" className="modal-form-content">
                            <div className="modal-scroll-body">
                                <div className="container-fluid p-0 mb-5">
                                    <div className="row g-4">

                                        <div className="col-md-6 border-end p-5">
                                            {/* NAME */}
                                            <div className="form-group">
                                                <label>Name</label>
                                                <Field name="name" className="form-control" placeholder="Enter name of your allergen" aria-describedby="nameHelp"/>
                                                {errors.name && touched.name ? (
                                                    <><small id="nameHelp" className="form-text text-danger">{errors.name}</small><br /></>
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
            </Modal>   
        )
    }

    onSubmit = async(event: any) => {
        let form = event.target;
        let data: unknown = {
            name: event.name,
            description: event.description
        }
        Store.dispatch(enableLoading({}));
        const response = await ExtrasAPI.createExtra(data as IExtra);
        setTimeout(() => {
            Store.dispatch(disableLoading({}));
        })
        if(response && response.success == true) {
            // update allergen items
            this.closeModal();
            const data: IResponseItem = response.data as IResponseItem;
            this.props.addNewExtraItem(data.item);
            showToast.success('Extra created succesfully');
        }
        else {
            showToast.error('There\'s problem creating extra. Try again later');
        }
    }
}

export default CreateExtra;