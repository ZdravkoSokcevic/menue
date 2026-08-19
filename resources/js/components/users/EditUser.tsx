import React, { BaseSyntheticEvent, ChangeEventHandler } from "react";
import Modal from "react-modal";
import { Formik, Form, Field, FormikProps, ErrorMessage } from 'formik';
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
import UsersAPI from "@/api/UsersAPI";
import TUser, { UserResponseItem } from "@/types/TUser";
import { ADMIN_ROLE, USER_ROLE, AGENT_ROLE, COMPANY_ADMIN_ROLE } from '@/types/Roles';

interface IProps {
    // can be page or modal
    type: 'modal', // can be modal or page
    isOpen?: boolean;
    currentUser: TUser;
    closeCreateUserModal: Function;
    editCurrentUser: Function;
};
interface IState {
    isDragging: boolean;
    imageFile?: File | null;
    // Error with image type
};

interface IInitialValues {
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    password: string;
    picture: File[] | null;
    role: string;
}

const roles =  {
    ADMIN: ADMIN_ROLE,
    USER: USER_ROLE,
    AGENT: AGENT_ROLE,
    COMPANY_ADMIN: COMPANY_ADMIN_ROLE

}

const userValidationSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Too short!')
        .max(50, 'Too long!')
        .required('Required'),
    first_name: Yup.string()
        .min(2, 'First name is too short')
        .max(255, 'First name is too long')
        .required('Required'),
    last_name: Yup.string()
        .min(2, 'Last name is too short')
        .max(255, 'Last name is too long')
        .required('Required'),
    username: Yup.string()
        .min(2, 'Username is too short')
        .max(64, 'Username is too long')
        .required('Required'),
    password: Yup.string()
        .min(8, 'Password is too short')
        .max(24, 'Password is too long'),
    role: Yup.mixed().oneOf(Object.values(roles), 'Invalid role selected')
    
});

class EditUser extends React.Component<IProps, IState>
{
    // private fileInputRef = React.createRef<HTMLInputElement>();
    private formikRef = React.createRef<FormikProps<IInitialValues>>();
    private emailRef = React.createRef<HTMLInputElement>();
    constructor(props: IProps) {
        super(props);
        this.state = {
            isDragging: false
        }
        // this.handleImageLoad = this.handleImageLoad.bind(this);
        // this.handleFileLoad = this.handleFileLoad.bind(this);
        // this.handleFileChange = this.handleFileChange.bind(this);
        
    }

    getIsOpen() {

    }

    closeModal() {
        this.props.closeCreateUserModal();
    }

    getRoles(): Array<[string, string]> {
        let role = Store.getState().user.user.role;
        if(role === 'superadmin')
            return Object.entries(roles);
        else if(role === 'admin' || role === 'agent') {
            return Object.entries(roles).filter(([key, val],index) => {
                if(val === 'user')
                    return [key, val];
            })
        }

        return [];
    }

    render(): React.ReactNode {
        const currentInitialValues: IInitialValues = {
            first_name: this.props.currentUser.first_name || '',
            last_name: this.props.currentUser.last_name || '',
            email: this.props.currentUser.email || '',
            password: this.props.currentUser.password || '',
            name: this.props.currentUser.name || '',
            username: this.props.currentUser.username || '',
            role: this.props.currentUser.role || '',
            picture: null,

        }
        return (
            <div className="form-page">

                <div className="modal-header">
                    <h2>Create User</h2>
                    <button className="close-btn" onClick={() => this.closeModal()}>&times;</button>
                </div>

                <Formik 
                    initialValues={currentInitialValues}
                    validationSchema={userValidationSchema}
                    onSubmit={this.onSubmit}
                    innerRef={this.formikRef}
                >

                {({ errors, touched, setFieldValue, isSubmitting, isValid, dirty, values }) => (

                    <Form encType="multipart/form-data" className="modal-form-content">
                    <div className="container-fluid p-0 mb-5">
                        <div className="modal-scroll-body">
                            <div className="row g-4">

                                <div className="col-md-6 border-end p-5">

                                    {/* FIRST NAME */}
                                    <div className="form-group">
                                        <label>First name</label>
                                        <Field 
                                            name="first_name" 
                                            className="form-control" 
                                            id="first_name" 
                                            aria-describedby="firstNameHelp" 
                                            placeholder="Enter first name"
                                        />
                                        {errors.first_name && touched.first_name ? (
                                            <><small id="firstNameHelp" className="form-text text-danger">{errors.first_name}</small><br /></>
                                        ) : null}
                                        {/* <small id="phoneHelp" className="form-text text-muted">We'll never share your email with anyone else.</small> */}
                                    </div>

                                    {/* LAST NAME */}
                                    <div className="form-group">
                                        <label>Last name</label>
                                        <Field 
                                            name="last_name" 
                                            className="form-control" 
                                            id="last_name" 
                                            aria-describedby="lastNameHelp" 
                                            placeholder="Enter last name"
                                        />
                                        {errors.last_name && touched.last_name ? (
                                            <><small id="lastNameHelp" className="form-text text-danger">{errors.last_name}</small><br /></>
                                        ) : null}
                                        {/* <small id="phoneHelp" className="form-text text-muted">We'll never share your email with anyone else.</small> */}
                                    </div>

                                    {/* USERNAME */}
                                    <div className="form-group">
                                        <label>Username</label>
                                        <Field 
                                            name="username" 
                                            className="form-control" 
                                            id="username" 
                                            aria-describedby="usernameHelp" 
                                            placeholder="Enter username"
                                        />
                                        {errors.username && touched.username ? (
                                            <><small id="usernameHelp" className="form-text text-danger">{errors.username}</small><br /></>
                                        ) : null}
                                    </div>

                                    {/* PASSWORD */}
                                    <div className="form-group">
                                        <label>Password</label>
                                        <Field 
                                            name="password" 
                                            className="form-control" 
                                            id="password" 
                                            aria-describedby="passwordHelp" 
                                            placeholder="Enter password"
                                        />
                                        <small id="passwordHelp" className="form-text text-muted"><b style={{fontWeight: 800}}>Password must be at least 8 characters long.</b></small>
                                        {errors.password && touched.password ? (
                                            <><small id="usernameHelp" className="form-text text-danger">{errors.password}</small><br /></>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="col-md-6 p-5">



                                    {/* EMAIL */}
                                    <div className="form-group">
                                        <label>Email</label>
                                        <Field 
                                            name="email" 
                                            className="form-control" 
                                            id="email" 
                                            aria-describedby="emailHelp" 
                                            placeholder="Enter email"
                                            ref={this.emailRef}
                                        />
                                        {errors.email && touched.email ? (
                                            <><small id="emailHelp" className="form-text text-danger">{errors.email}</small><br /></>
                                        ) : null}
                                        {/* <small id="phoneHelp" className="form-text text-muted">We'll never share your email with anyone else.</small> */}
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Name</label>
                                        <Field name="name" className="form-control" placeholder="Enter name of your User" aria-describedby="nameHelp"/>
                                        {errors.name && touched.name ? (
                                            <><small id="nameHelp" className="form-text text-danger">{errors.name}</small><br /></>
                                        ) : null}
                                        <small id="nameHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                                    </div>

                                    {/* ROLE */}
                                    <div className="form-group">
                                        <label className="form-label">Role</label>
                                        <Field 
                                            as="select"
                                            name="role"
                                            className="form-control"
                                            id="role"
                                        >
                                            {this.getRoles().map(((val, key) => (
                                                <option key={key} value={val[1]}>
                                                    {val[1].charAt(0).toUpperCase() + val[1].slice(1)}
                                                </option>
                                            )))}
                                        </Field>
                                        {/* 5. Display validation errors */}
                                        <ErrorMessage name="role" component="div" />
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
        )
    }

    onSubmit = async(event: any) => {
        // (event as Event).stopPropagation();
        // (event as Event).preventDefault();
        let form = event.target;
        let data: TUser = {
            name: event.name,
            first_name: event.first_name,
            last_name: event.last_name,
            username: event.username,
            email: event.email,
            role: event.role,
            company_id: Store.getState().app.defaultCompany.id,
            id: this.props.currentUser.id
        }

        if(event.password && event.password.length) {
            data['password'] = event.password;
        }

        Store.dispatch(enableLoading({}));
        const response = await UsersAPI.editUser(data);
        setTimeout(() => {
            Store.dispatch(disableLoading({}));
        })
        if(response && response.success == true) {
            // update user items
            this.closeModal();
            const data: UserResponseItem = response.data as UserResponseItem;
            this.props.editCurrentUser(data.item);
            showToast.success('User created successfully');
        }
        else {
            showToast.error('There\'s problem creating user. Try again later');
        }
    }
}

export default EditUser;