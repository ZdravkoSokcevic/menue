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
import { showToast } from "@/helpers/Toast";

interface IProps {
    // can be page or modal
    type: 'modal', // can be modal or page
    isOpen?: boolean;
    closeCreatePreferenceModal: () => void;
    addNewPreferenceItem: (item: IPreference) => void;
    style?: {};
};
interface IState {
};

interface IInitialValues {
    name: string;
    description: string;
}

const initialValues: IInitialValues = {
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
        this.props.closeCreatePreferenceModal();
    }
    
    render(): React.ReactNode {
        return (
            <Modal 
                isOpen={this.props.isOpen as boolean} 
                onRequestClose={() => this.closeModal()}
                overlayClassName="modal-backdrop-blur"
                className="form-modal"
                contentLabel="Create Preference"
                style={this.props.style}
            >
                <div className="form-page">

                    <div className="modal-header">
                        <h2>Create Preference</h2>
                        <button className="close-btn" onClick={() => this.closeModal()}>&times;</button>
                    </div>

                    <Formik 
                        initialValues={initialValues}
                        validationSchema={preferenceValidationSchema}
                        onSubmit={this.onSubmit}
                        innerRef={this.formikRef}
                    >

                    {({ errors, touched, isSubmitting, isValid, dirty, values }) => (

                        <Form encType="multipart/form-data" className="modal-form-content">
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
                                            <small id="descriptionHelp" className="form-text text-muted">About preference.</small>
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
            showToast.error('Preference created successfully');
        }
        else {
            showToast.error('There\'s problem creating preference. Try again later');
        }
    }
}

export default CreatePreference;