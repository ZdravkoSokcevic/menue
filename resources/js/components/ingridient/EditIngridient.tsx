import React from "react";
import { Formik, Form, Field, FormikProps } from 'formik';
import * as Yup from "yup";

import { FaSave } from "react-icons/fa";

import "../../../sass/modal.scss"
import { Store } from "@/reducers/Store";
import { disableLoading, enableLoading } from "@/reducers/appSlice";
import { AxiosResponse } from "axios";
import { IAllergen, TAllergens } from "@/types/Allergen";
import AllergensAPI from "@/api/AllergensAPI";
import { IResponseItem } from "@/types/Api";
import { IIngridient } from "@/types/Ingridient";
import { Option } from "@/types/App";
import Select, { GroupBase, MultiValue } from "react-select"
import IngridientsAPI from "@/api/IngridientsAPI";

interface IProps {
    // can be page or modal
    currentItem: IIngridient
    closeModal?: Function;
    editCurrentItem: Function;
};

interface IState {
    allergens: TAllergens;
    allergenOptions: Array<Option>;
    selectedOptions: Array<Option>;
};

interface IInitialValues {
    name: string;
    allergens?: TAllergens;
    is_vegan: boolean;
}

const initialValues: IInitialValues = {
    name: '',
    allergens: [],
    is_vegan: false,
}

const allergenValidationSchema = Yup.object().shape({
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

class EditIngridient extends React.Component<IProps, IState>
{
    private fileInputRef = React.createRef<HTMLInputElement>();
    private formikRef = React.createRef<FormikProps<IInitialValues>>();
    private isVeganRef = React.createRef<HTMLInputElement>();

    constructor(props: IProps) {
        super(props);
        this.state = {
            allergens: [],
            allergenOptions: [],
            selectedOptions: []
        }
    }

    closeModal() {
        if(this.props.closeModal)
            this.props.closeModal();
    }
    
    componentDidMount(): void {
        this.loadAllergens();

        const markedAllergens: Array<Option> = [];
        this.props.currentItem.allergens?.map((allergen: IAllergen) => {
            markedAllergens.push({
                id: allergen.id,
                name: allergen.name,
                label: allergen.name,
                value: allergen.id
            });
            
        })

        this.setState({ selectedOptions: markedAllergens });
        this.formikRef?.current?.setFieldValue('allergens', this.props.currentItem.allergens);
    }

    onAllergenChange(values: MultiValue<Option>) {
        console.log(values);
        let selectedOpts: Array<Option> = [];
        let selectedAllergens: TAllergens = [];
        values.forEach((value: Option) => {
            selectedOpts.push(value);
            this.state.allergens.map((allergen: IAllergen) => {
                if(allergen.id === value.id)
                    selectedAllergens.push(allergen);
            })
        })
        this.setState({ selectedOptions: selectedOpts });
        this.formikRef.current?.setFieldValue('allergens', selectedAllergens)
    }

    render(): React.ReactNode {
        // Create a NEW object reference here
        const currentInitialValues: IInitialValues = {
            name: this.props.currentItem.name || '',
            is_vegan: this.props.currentItem.is_vegan ? true : false, // Boolean
            allergens:[],
        };
        // this.formikRef.current?.setFieldTouched('name', true);
        this.formikRef.current?.setFieldValue('is_vegan', this.props.currentItem.is_vegan ? true : false);
        this.state.allergenOptions.map((option: Option) => {
            option.selected = 1;
            option.checked = 1;
        })

        // this.state.allergens.map((allergen: IAllergen) => {
        // })

        return (
                <div className="form-page">


                    <h2>Edit Ingridient</h2>
                    <button className="close-btn" onClick={() => this.closeModal()}>x</button>

                    <Formik 
                        initialValues={currentInitialValues}
                        validationSchema={allergenValidationSchema}
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
                                            placeholder="Enter name of your allergen" 
                                            aria-describedby="nameHelp"
                                        />
                                        {errors.name && touched.name ? (
                                            <><small id="nameHelp" className="form-text text-danger">{this.formikRef.current?.errors.name}</small><br /></>
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
                                                checked={values.is_vegan}
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
                                            onChange={this.onAllergenChange.bind(this)}
                                            isSearchable={false}
                                            isMulti={true}
                                            value={this.state.selectedOptions}
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
                                        <div className="d-none">
                                            <span>Current item: </span>
                                            <small>{JSON.stringify(this.props.currentItem)}</small>
                                        </div>
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

    // Here event is object that contains values
    onSubmit = async(event: any) => {
        // debugger;
        // (event as Event).stopPropagation();
        // (event as Event).preventDefault();

        let data: IIngridient = {
            id: this.props.currentItem.id,
            name: event.name,
            allergens: event.allergens as TAllergens,
            is_vegan: event.is_vegan
        }
        // debugger;
        Store.dispatch(enableLoading({}));
        const res= await IngridientsAPI.editAllergen(data as IIngridient);
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
            // this.closeModal();
        }
    }
}

export default EditIngridient;