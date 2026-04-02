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
import AllergensAPI from "@/api/AllergensAPI";
import { IAllergen, TAllergens } from "@/types/Allergen";
import { IResponseItem } from "@/types/Api";
import { IIngridient, TIngridients } from "@/types/Ingridient";
import IngridientsAPI from "@/api/IngridientsAPI";
import FormikSearchSelect from "../FormikSelectSearch";
import Select, { ActionMeta, MultiValue, SingleValue } from 'react-select'
import { Option } from "@/types/App";

interface IProps {
    // can be page or modal
    type: 'modal', // can be modal or page
    isOpen?: boolean;
    closeCreateIngridientModal: Function;
    addNewIngridientItem: Function;
    style?: {}
};
interface IState {
    allergens: TAllergens;
    allergenOptions: Array<Option>;
};

interface IintiialValues {
    name: string;
    allergens?: TAllergens;
    is_vegan: boolean;
}

const initialValues: IintiialValues = {
    name: '',
    allergens: [],
    is_vegan: false
}


const ingridientValidationSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Too short!')
        .max(50, 'Too long!')
        .required('Required'),
    is_vegan: Yup.boolean(),
    allergens: Yup.mixed()
        .test(
            'allergensValid',
            'Allergens must be part of Allergen', 
            (value) => {
            return true;
        })
});

class CreateIngridient extends React.Component<IProps, IState>
{
    private formikRef = React.createRef<FormikProps<IintiialValues>>();
    private isVeganRef = React.createRef<HTMLInputElement>();
    constructor(props: IProps) {
        super(props);
        this.state = {
            allergens: [],
            allergenOptions: []
        }
        
    }

    closeModal() {
        this.props.closeCreateIngridientModal();
    }

    onAllergenChange = (
        newValue: MultiValue<Option>, 
        actionMeta: ActionMeta<Option>
    ) => {
    const values = newValue;
    let vals = [];
    vals = values.map((value : Option) => value.id);
    this.formikRef.current?.setFieldValue('allergens', vals);
    this.formikRef.current?.setFieldTouched('allergens');
  };
    
    componentDidMount(): void {
        this.loadAllergens();
    }

    render(): React.ReactNode {
        return (
            <Modal 
                isOpen={this.props.isOpen as boolean} 
                onRequestClose={() => this.closeModal()}
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 w-100 full-w-h"
                className="form-modal bg-white rounded-xl shadow-2xl max-w-md w-full p-6 outline-none"
                style={this.props.style ? this.props.style : {}}
                contentLabel="Example"
            >
                <div className="form-page">


                    <h2>Create Ingridient</h2>
                    <button className="close-btn" onClick={() => this.closeModal()}>x</button>

                    <Formik 
                        initialValues={initialValues}
                        validationSchema={ingridientValidationSchema}
                        onSubmit={this.onSubmit}
                        innerRef={this.formikRef}
                    >

                    {({ errors, touched, setFieldValue, isSubmitting, isValid, dirty, values }) => (

                        <Form encType="multipart/form-data">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-md-6 border-end p-5">
                                    {/* NAME */}
                                    <div className="form-group">
                                        <label htmlFor="name">Name</label>
                                        <Field 
                                            name="name" 
                                            className="form-control" 
                                            placeholder="Enter name of your allergen" 
                                            aria-describedby="nameHelp"
                                        />
                                        {errors.name && touched.name ? (
                                            <><small id="nameHelp" className="form-text text-danger">{errors.name}</small><br /></>
                                        ) : null}
                                        <small id="nameHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                                    </div> 

                                    {/* IS VEGAN? */}
                                    <div className="form-check">
                                        {/* <label>Is vegan food</label> */}
                                            <Field 
                                                name="is_vegan" 
                                                className="form-check-input" 
                                                placeholder="Is your food vegan" 
                                                aria-describedby="isVeganHelp"
                                                value="true"
                                                type="checkbox"
                                                label="Is vegan?"
                                                ref={this.isVeganRef}
                                                checked={this.isVeganRef.current?.checked}
                                            />
                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                Is vegan
                                            </label>
                                    </div>
                                </div>

                                <div className="col-md-6 p-5">
                                    {/* ALLERGENS */}
                                    <div className="form-group">
                                        <label htmlFor="name">Choose allergens</label>
                                        <Select
                                            options={this.state.allergenOptions}
                                            name="allergens"
                                            id="allergens"
                                            aria-describedby="allergensHelp"
                                            onChange={this.onAllergenChange}
                                            isSearchable={false}
                                            isMulti={true}
                                            // ref={this.allergenRef}
                                            // as="select"
                                        />
                                        {errors.allergens && touched.allergens ? (
                                            <><small id="nameHelp" className="form-text text-danger">{errors.allergens}</small><br /></>
                                        ) : null}
                                        <small id="nameHelp" className="form-text text-muted">Choose one from allergens.</small>
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

    loadAllergens = async() => {
        try {
            const allergens: TAllergens = await AllergensAPI.getItems() as TAllergens;
            if(allergens) {
                this.setState({ allergens: allergens });

                const allergenOpts: Array<Option> = [];
                allergens.forEach((allergen:IAllergen) => {
                    allergenOpts.push({ 
                        name: allergen.name, 
                        id: allergen.id,
                        value: allergen.id, 
                        label: allergen.name 
                    });
                })
                this.setState({ allergenOptions: allergenOpts });
            }
        }catch(err) {
            alert('Cannot fetch allergens');
        }
    }

    onSubmit = async(event: any) => {
        let form = event.target;
        let data: unknown = {
            name: event.name,
            is_vegan: event.is_vegan ? 1 : 0,
            allergens: event.allergens
        }
        Store.dispatch(enableLoading({}));
        const response = await IngridientsAPI.createIngridient(data as IIngridient);
        setTimeout(() => {
            Store.dispatch(disableLoading({}));
        })
        if(response && response.success == true) {
            // update allergen items
            this.closeModal();
            const data: IResponseItem = response.data as IResponseItem;
            this.props.addNewIngridientItem(data.item);
        }
        else {
            alert('Unexpected error occured');
        }
    }
}

export default CreateIngridient;