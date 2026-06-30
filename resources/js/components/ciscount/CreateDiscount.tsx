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
import { ICategoriesResponseItem, ICategory } from "@/types/Categories";
import MenuAPI from "@/api/MenuAPI";
import { TMenu, TMenuItems } from "@/types/Menu";
import { IOption, TSelectSearchOptions } from "@/types/App";
import DiscountsAPI from "@/api/DiscountsAPI";
import { DayOfWeek, DISCOUNT_TYPE, IDiscount, IDiscountResponseItem } from "@/types/Discount";
import { IPrice } from "@/types/Prices";
import AppHelper from "@/helpers/AppHelper";

interface IProps {
    // can be page or modal
    type: 'modal', // can be modal or page
    isOpen?: boolean;
    closeCreateDiscountModal: Function;
    addNewDiscountItem: Function;
};
interface IState {
    isDragging: boolean;
    imageFile?: File | null;
    // Error with image type
    // @ts-ignore
    image?: Image | null;
    menuItems: TMenuItems;
    // Based on search
    filteredItems: TMenuItems;
    menuItemOptions: TSelectSearchOptions;
    selectedMenuItem: TMenu;
    selectedPortion: IPrice;
    search: string;
    // daysOfWeek: DayOfWeek,
    selectedDaysOfWeek: Array<DayOfWeek>,
};

interface IInitialValues {
    menu_id: string;
    portion_id: string;
    value: string | number;
    type?: DISCOUNT_TYPE;
    active_times: number;
    times: Array<DayOfWeek>;
    time_from?: string | undefined;
    time_to?: string | undefined;
    start_at: Date | string | null;
    end_at: Date | string | null;
    is_active: boolean;
}

const dayValues = [
  DayOfWeek.MONDAY,
  DayOfWeek.TUESDAY,
  DayOfWeek.WEDNESDAY,
  DayOfWeek.THURSDAY,
  DayOfWeek.FRIDAY,
  DayOfWeek.SATURDAY,
  DayOfWeek.SUNDAY
];

const initialValues: IInitialValues = {
    menu_id: '',
    portion_id: '',
    value: '',
    type: DISCOUNT_TYPE.FIXED,
    active_times: 0,
    times: [],
    time_from: '',
    time_to: '',
    start_at: '',
    end_at: '',
    is_active: true,
}

// const discountValidationSchema: Yup.ObjectSchema<IInitialValues> = Yup.object().shape({

// });


class CreateDiscount extends React.Component<IProps, IState>
{
    private fileInputRef = React.createRef<HTMLInputElement>();
    private formikRef = React.createRef<FormikProps<IInitialValues>>();
    private searchRef = React.createRef<HTMLInputElement>();
    private discountValidationSchema: Yup.ObjectSchema<IInitialValues>;
    constructor(props: IProps) {
        super(props);
        this.state = {
            isDragging: false,
            menuItems: [],
            filteredItems: [],
            menuItemOptions: [] as TSelectSearchOptions,
            selectedMenuItem: {} as TMenu,
            selectedPortion: {} as IPrice,
            search: '',
            // daysOfWeek: [],
            selectedDaysOfWeek: [],
        }
        this.handleImageLoad = this.handleImageLoad.bind(this);
        this.handleFileLoad = this.handleFileLoad.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);

        this.discountValidationSchema = Yup.object().shape({
            menu_id: Yup.string()
                .required('Choose one of menu items')
                .test(
                    'menu-exists',
                    'Menu item doesn\'t exists',
                    async (value) => {
                        let items = this.state.menuItems;
                        const itemExists = items.some(item => item.id == value);
                        return itemExists;
                    }
                ),
            portion_id: Yup.string()
                .required('Choose on of portions')
                .test(
                    'portion-exists',
                    'Portion item doesn\'t exists',
                    value => {
                        let selectedItemId = this.state.selectedMenuItem;
                        const exists = selectedItemId.portions?.some(portion => portion.id == value);
                        return exists;
                    }
                ),
            value: Yup.string()
                .required('Value is required')
                .when('type', {
                    is: 'percent',
                    then: (schema) => schema.min(0).max(100)
                })
                .when('type', {
                    is: 'fixed',
                    then: (schema) => schema.min(0).max(10000),
                }),
            type: Yup.mixed<DISCOUNT_TYPE>().oneOf(Object.values(DISCOUNT_TYPE)),
            active_times: Yup.number().required('Times are required'),
            // for every day - value daily
            // for weekly, ex- mo,tu,fr
            times: Yup.array()
                .of(
                    Yup.mixed<DayOfWeek>()
                    .oneOf(Object.values(dayValues))
                    .required()
                )
                // .min(1, 'Select at least one of day')
                .when('active_times', {
                    is: (activeTimesValue: string) => activeTimesValue && activeTimesValue=='2',
                    then: (schema) => schema.min(1, 'Select at least one of day')
                        .required('Times is required when a weekly is chosen'),
                    otherwise: (schema) => schema.notRequired() 
                })
                .required('Times is required'),
            time_from: Yup.string().optional(),
            time_to: Yup.string().optional(),
            // time_from: Yup.string().required('Time from is required'),
            // time_to: Yup.string().required('Time to is required'),
            // start_at: Yup.string(),
            // end_at: Yup.string(),
            start_at: Yup.date()
                .required('Start at is required')
                .nullable()
                .typeError('Invalid start date')
                .min(AppHelper.getTodayAtMidnight(), 'The start date cannot be in the past'),
            end_at: Yup.date()
                .required('End at is required')
                .typeError('Invalid end date')
                .min(AppHelper.getTodayAtMidnight(), 'The start date cannot be in the past')
                .when('start_at', {
                    is: (startAtValue: string) => startAtValue && !isNaN(Date.parse(startAtValue)),
                    then: (schema) => schema.min(
                        Yup.ref('start_at'),
                        'The end date must be after start date'
                    )
                }),
            is_active: Yup.boolean().required('Active status is requred'),
        })
        
    }

    componentDidMount(): void {
        this.loadMenuItems();
    }

    getIsOpen() {

    }

    closeModal() {
        this.props.closeCreateDiscountModal();
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

    setSearchQuery = async(val: string) => {
        this.setState({ search: val });

        if((val != '')) {
            let search = this.state.menuItems
                .filter(item =>
                    item.name
                        .toLowerCase()
                        .includes(this.state.search.toLowerCase())
                );
            this.setState({ filteredItems: search });
        }else this.setState({ filteredItems: this.state.menuItems });
    }

    setSelectedMenuItem = (item: TMenu) => {
        this.setState({
            selectedMenuItem: item,
            selectedPortion: {} as IPrice
        })

        this.formikRef.current!.setFieldValue('menu_id', item.id);
    }

    setSelectedPortion = (portion: IPrice) => {
        this.setState({
            selectedPortion: portion
        })
        this.formikRef.current!.setFieldValue('portion_id', portion.id);
    }

    addOrRemoveDayOfWeek = (day: DayOfWeek) => {
          const currentDays = this.formikRef.current!.values.times;
          const isSelected = currentDays.includes(day);
          
          const nextDays = isSelected
            ? currentDays.filter(d => d !== day) // Remove day if already selected
            : [...currentDays, day];             // Add day if not selected
          
          this.formikRef.current!.setFieldValue('times', nextDays);
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


                    <h2>Create discount</h2>
                    <button className="close-btn" onClick={() => this.closeModal()}>x</button>

                    <Formik 
                        initialValues={initialValues}
                        validationSchema={this.discountValidationSchema}
                        onSubmit={this.onSubmit}
                        innerRef={this.formikRef}
                    >

                    {({ errors, touched, setFieldValue, isSubmitting, isValid, dirty, values }) => (

                        <Form encType="multipart/form-data">
                        <div className="container-fluid">
                            <div className="row">


                                <div className="row g-3">

                                    {/* MENU ITEMS */}
                                    <div className="col-md-7">
                                        <div className="p-3">
                                            <h6 className="mb-2 fw-bold">
                                                Menu Items
                                            </h6>

                                            <input
                                                type="search"
                                                className="form-control"
                                                placeholder="🔍 Search menu item..."
                                                value={this.state.search}
                                                onChange={(e) => this.setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                        <div
                                            className="rounded p-2"
                                            style={{
                                                maxHeight: '500px',
                                                overflowY: 'auto'
                                            }}
                                        >
                                            {this.state.filteredItems.map((item: TMenu) => (
                                                <div
                                                    key={item.id}
                                                    onClick={() =>
                                                        this.setSelectedMenuItem(item)
                                                    }
                                                    className={`d-flex align-items-center p-2 mb-2 rounded cursor-pointer ${
                                                        this.state.selectedMenuItem?.id === item.id
                                                            ? 'border border-primary bg-primary-subtle'
                                                            : 'border'
                                                    }`}
                                                    style={{
                                                        cursor: 'pointer',
                                                        transition: 'all .2s'
                                                    }}
                                                >
                                                    <img
                                                        src={'/storage/' + item.picture as string}
                                                        alt={item.name}
                                                        width={70}
                                                        height={70}
                                                        className="rounded object-fit-cover"
                                                    />

                                                    <div className="ms-3 flex-grow-1">
                                                        <h6 className="mb-1">
                                                            {item.name}
                                                        </h6>

                                                        <small className="text-muted">
                                                            {item.portions?.length ?? 0} portions
                                                        </small>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {errors.menu_id  ? (
                                            <div><small id="menuIdHelp" className="form-text text-danger">{errors.menu_id}</small><br /></div>
                                        ) : null}
                                    </div>

                                    {/* PORTIONS */}
                                    <div className="col-md-5">
                                        <div
                                            className="rounded p-3"
                                            style={{
                                                minHeight: '500px'
                                            }}
                                        >
                                            {!this.state.selectedMenuItem && (
                                                <div className="text-center text-muted mt-5">
                                                    Select menu item
                                                </div>
                                            )}

                                            {this.state.selectedMenuItem && (
                                                <>
                                                    <h5 className="mb-3">
                                                        {this.state.selectedMenuItem.name}
                                                    </h5>

                                                    {this.state.selectedMenuItem?.portions?.map(
                                                        (portion: any) => (
                                                            <div
                                                                key={portion.id}
                                                                onClick={() =>
                                                                    this.setSelectedPortion(portion)
                                                                }
                                                                className={`p-3 mb-2 rounded ${
                                                                    this.state.selectedPortion?.id ===
                                                                    portion.id
                                                                        ? 'border border-success bg-success-subtle'
                                                                        : 'border'
                                                                }`}
                                                                style={{
                                                                    cursor: 'pointer',
                                                                    transition: 'all .2s'
                                                                }}
                                                            >
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <div>
                                                                        <div className="fw-bold">
                                                                            {portion.name}
                                                                        </div>

                                                                        <small className="text-muted">
                                                                            {portion.portion_size}
                                                                        </small>
                                                                    </div>

                                                                    <div className="fw-bold text-success">
                                                                        $
                                                                        {
                                                                            portion.prices?.price
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                    {errors.portion_id  ? (
                                                        <div><small id="portionIdHelp" className="form-text text-danger">{errors.portion_id}</small><br /></div>
                                                    ) : null}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* DISCOUNT SECTION */}
                                <div className="mt-3 pt-3">

                                    <h6 className="text-primary fw-bold mb-3 h4">
                                        Discount
                                    </h6>

                                    <div className="row g-2">

                                        {/* DISCOUNT VALUE */}
                                        <div className="col-md-6">
                                            <label className="form-label">
                                                Discount Value
                                            </label>

                                            <Field
                                                type="number"
                                                name="value"
                                                className="form-control"
                                                placeholder="Enter value"
                                            />
                                            {errors.value  ? (
                                                <div><small id="valueHelp" className="form-text text-danger">{errors.value}</small><br /></div>
                                            ) : null}
                                        </div>

                                        {/* DISCOUNT TYPE */}
                                        <div className="col-md-6">
                                            <label className="form-label">
                                                Discount Type
                                            </label>

                                            <Field
                                                as="select"
                                                name="type"
                                                className="form-select"
                                            >
                                                <option value="percent" selected>
                                                    Percent (%)
                                                </option>

                                                <option value="fixed">
                                                    Fixed Price
                                                </option>
                                            </Field>
                                           {errors.type  ? (
                                                <div><small id="typeHelp" className="form-text text-danger">{errors.type}</small><br /></div>
                                            ) : null}
                                        </div>

                                    </div>
                                </div>

                                <div className="row mb-3 mt-3">
                                    <div className="text-primary fw-bold h4">
                                        Validity Period
                                    </div>

                                    <div className="">

                                        <label className="form-label">
                                            Status
                                        </label>

                                        <div className="btn-group w-100 mb-3">

                                            <button
                                                type="button"
                                                className={
                                                    values.is_active
                                                        ? 'btn btn-success'
                                                        : 'btn btn-outline-success'
                                                }
                                                onClick={() =>
                                                    setFieldValue('is_active', true)
                                                }
                                            >
                                                Active
                                            </button>

                                            <button
                                                type="button"
                                                className={
                                                    !values.is_active
                                                        ? 'btn btn-danger'
                                                        : 'btn btn-outline-danger'
                                                }
                                                onClick={() =>
                                                    setFieldValue('is_active', false)
                                                }
                                            >
                                                Inactive
                                            </button>

                                        </div>
                                    </div>
                                </div>

                                <div className="row">

                                    <div className="text-primary fw-bold h4">
                                        Active dates
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">
                                            Start Date
                                        </label>

                                        <Field
                                            type="date"
                                            name="start_at"
                                            className="form-control"
                                        />
                                        {errors.start_at  ? (
                                            <div><small id="startAtHelp" className="form-text text-danger">{errors.start_at}</small><br /></div>
                                        ) : null}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">
                                            End Date
                                        </label>

                                        <Field
                                            type="date"
                                            name="end_at"
                                            className="form-control"
                                        />
                                        {errors.end_at  ? (
                                            <div><small id="endAtHelp" className="form-text text-danger">{errors.end_at}</small><br /></div>
                                        ) : null}
                                    </div>

                                </div>

                        <div className="row mt-3">

                            <div className="text-primary fw-bold h4">
                                Schedule
                            </div>

                            <div className="">

                                <label className="form-label">
                                    Active Times
                                </label>

                                <Field
                                    as="select"
                                    name="active_times"
                                    className="form-select mb-3"
                                >
                                    <option value="0">
                                        Always Active
                                    </option>

                                    <option value="1">
                                        Every Day
                                    </option>

                                    <option value="2">
                                        Weekly
                                    </option>
                                </Field>
                                {errors.active_times  ? (
                                    <div><small id="activeTimesHelp" className="form-text text-danger">{errors.active_times}</small><br /></div>
                                ) : null}
                            </div>
                        </div>

                        {values.active_times == 2 && 
                            <div className="row mb-3 mt-3">
                                {Object.values(DayOfWeek).map((day) => {
                                    const isSelected = values.times.includes(day);

                                    return (
                                        <div 
                                            key={day}
                                            className="col"
                                        >
                                            <button
                                                type="button"
                                                onClick={(e) => this.addOrRemoveDayOfWeek(day)}
                                                className={
                                                    isSelected
                                                        ? 'btn btn-success'
                                                        : 'btn btn-outline-success'
                                                }
                                            >{day.substring(0, 3)}</button>
                                        </div>
                                    )
                                })}
                                {errors.times  ? (
                                    <div><small id="timesHelp" className="form-text text-danger">{errors.times}</small><br /></div>
                                ) : null}
                            </div>
                        }

                        {values.active_times && (
                            <div className="row mb-3 mt-3">

                                <div className="col-md-6">
                                    <label className="form-label">
                                        Time From
                                    </label>

                                    <Field
                                        type="time"
                                        name="time_from"
                                        className="form-control"
                                    />
                                    {errors.time_from  ? (
                                        <div><small id="timeFromHelp" className="form-text text-danger">{errors.time_from}</small><br /></div>
                                    ) : null}
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">
                                        Time To
                                    </label>

                                    <Field
                                        type="time"
                                        name="time_to"
                                        className="form-control"
                                    />
                                    {errors.time_to  ? (
                                        <div><small id="timeToHelp" className="form-text text-danger">{errors.time_to}</small><br /></div>
                                    ) : null}
                                </div>

                            </div>
                        )}

                                <div className="col-md-6 p-5">


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
        // (event as Event).stopPropagation();
        // (event as Event).preventDefault();
        // let form = event.target;
        let d = event;
        debugger;
        let eventStr = ''
        if(event.times) {
            let eventTimes: Array<string> = [];
            event.times.forEach((time: string) => {
                switch(time) {
                    case 'Monday': eventTimes.push('mo');break;
                    case 'Tuesday': eventTimes.push('tu');break;
                    case 'Wednesday': eventTimes.push('we');break;
                    case 'Thursday': eventTimes.push('th');break;
                    case 'Friday': eventTimes.push('fr');break;
                    case 'Saturday': eventTimes.push('sa');break;
                    case 'Sunday': eventTimes.push('su');break;
                }
            })
            eventStr = eventTimes.join(',');
        }
        
        let data: unknown = {
            menu_id: event.menu_id,
            portion_id: event.portion_id,
            value: event.value,
            type: event.type,
            active_times: event.active_times,
            times: eventStr,
            time_from: event.time_from,
            time_to: event.time_to,
            start_at: event.start_at,
            end_at: event.end_at,
            is_active: event.is_active
        }
        Store.dispatch(enableLoading({}));
        const response = await DiscountsAPI.createDiscount(data as IDiscount);
        setTimeout(() => {
            Store.dispatch(disableLoading({}));
        })
        if(response && response.success == true) {
            // update category items
            this.closeModal();
            const data: IDiscountResponseItem = response.data as IDiscountResponseItem;
            this.props.addNewDiscountItem(data.item);
        }
        else {
            alert('Unexpected error occured');
        }
    }

    loadMenuItems = async() => {
        let items = await MenuAPI.getItems();
        if(items && items.length) {
            this.setState({ menuItems: items });
            this.setState({ filteredItems: items });
        }
    }
}

export default CreateDiscount;