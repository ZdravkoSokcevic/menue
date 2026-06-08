import React from "react";
import Modal from "react-modal";
import { Formik, Form, Field, FormikProps } from 'formik';
import * as Yup from "yup";

import { FaSave } from "react-icons/fa";

import "../../../sass/modal.scss"
import { Store } from "@/reducers/Store";
import { disableLoading, enableLoading } from "@/reducers/appSlice";
import { IPreference } from "@/types/Preference";
import { IResponseItem } from "@/types/Api";
import PreferencesAPI from "@/api/PreferencesAPI";

interface IProps {
    // can be page or modal
    currentItem: IPreference
    closeModal?: () => void;
    editCurrentItem: Function;
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

const preferencesValidationSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Too short!')
        .max(50, 'Too long!')
        .required('Required'),
    description: Yup.string()
        .min(2, 'Too short!')
        .max(255, 'Too long!')
        .required('Required'),
});

class EditPreference extends React.Component<IProps, IState>
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
        const currentInitialValues: IInitialValues = {
            name: this.props.currentItem.name || '',
            description: this.props.currentItem.description || '',
        };

        return (
                <div className="form-page">


                    <h2>Edit Preference</h2>
                    <button className="close-btn" onClick={() => this.closeModal()}>x</button>

                    <Formik 
                        initialValues={currentInitialValues}
                        validationSchema={preferencesValidationSchema}
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
                                    {/* NAME */}
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
    onSubmit = async(event: IInitialValues) => {

        let data: IPreference = {
            id: this.props.currentItem.id,
            name: event.name,
            description: event.description
        }
        Store.dispatch(enableLoading({}));
        const res= await PreferencesAPI.editPreference(data as IPreference);
        setTimeout(() => {
            Store.dispatch(disableLoading({}));
        })
        // if modal is case
        if(res && res.success == true)  {
            const responseData: IResponseItem = res.data as IResponseItem;
            this.props.editCurrentItem(responseData.item);
            this.closeModal();
        }
        else {
            alert('Unexpected error occured!');
        }
    }
}

export default EditPreference;