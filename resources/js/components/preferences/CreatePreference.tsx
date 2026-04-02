import React from "react";
import Modal from "react-modal";
import { Formik, Form, Field, FormikProps } from 'formik';
import * as Yup from "yup";

import { FaSave } from "react-icons/fa";

import "../../../sass/modal.scss"
import { Store } from "@/reducers/Store";
import { disableLoading, enableLoading } from "@/reducers/appSlice";
import { IResponseItem } from "@/types/Api";
import PreferencesAPI from "@/api/PreferencesAPI";
import { IPreference } from "@/types/Preference";

interface IProps {
    // can be page or modal
    type: 'modal', // can be modal or page
    isOpen?: boolean;
    closeCreatePreferenceModal: () => void;
    addNewPreferenceItem: (item: IPreference) => void;
};
interface IState {
};

interface IintiialValues {
    name: string;
    description: string;
}

const initialValues: IintiialValues = {
    name: '',
    description: ''
}


const preferenceValidationSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Too short!')
        .max(50, 'Too long!')
        .required('Required'),
    description: Yup.string()
        .min(2, 'Too short!')
        .max(255, 'Too long!')
        .required('Required'),
});

class CreatePreference extends React.Component<IProps, IState>
{
    private formikRef = React.createRef<FormikProps<IintiialValues>>();
    constructor(props: IProps) {
        super(props);
        this.state = {
            isDragging: false
        }
        
    }

    getIsOpen() {

    }

    closeModal() {
        this.props.closeCreatePreferenceModal();
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


                    <h2>Create Preference</h2>
                    <button className="close-btn" onClick={() => this.closeModal()}>x</button>

                    <Formik 
                        initialValues={initialValues}
                        validationSchema={preferenceValidationSchema}
                        onSubmit={this.onSubmit}
                        innerRef={this.formikRef}
                    >

                    {({ errors, touched, setFieldValue, isSubmitting, isValid, dirty }) => (

                        <Form encType="multipart/form-data">
                        <div className="container-fluid">
                            <div className="row">

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
                                        <small id="descriptionHelp" className="form-text text-muted">About preference.</small>
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
        let form = event.target;
        let data: unknown = {
            name: event.name,
            description: event.description,
        }
        Store.dispatch(enableLoading({}));
        const response = await PreferencesAPI.createPreference(data as IPreference);
        setTimeout(() => {
            Store.dispatch(disableLoading({}));
        })
        if(response && response.success == true) {
            // update allergen items
            this.closeModal();
            const data: IResponseItem = response.data as IResponseItem;
            this.props.addNewPreferenceItem(data.item);
        }
        else {
            alert('Unexpected error occured');
        }
    }
}

export default CreatePreference;