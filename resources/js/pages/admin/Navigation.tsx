import LoginAPI from '@/api/Login';
import AppHelper from '@/helpers/AppHelper';
import CompanyHelper from '@/helpers/CompanyHelper';
import { RootState, Store } from '@/reducers/Store';
import { withLocation } from '@/routes/withLocation';
import { TCompany } from '@/types/TCompanies';
import TUser, { TUserSettings } from '@/types/TUser';
import React, { ReactNode } from 'react';
import { connect } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { IoIosExit } from "react-icons/io";
import { MdOutlineRestaurantMenu, MdOutlineRoomPreferences } from "react-icons/md";
import { BiCategory, BiShoppingBag } from "react-icons/bi";
import { TbShoppingCartDiscount } from "react-icons/tb";
import { PiDeskBold } from "react-icons/pi";
import { BiDish } from "react-icons/bi";
import { MdDashboard } from "react-icons/md";
import { MdSettings } from 'react-icons/md';
import { GrRestaurant } from "react-icons/gr";
import { LiaAllergiesSolid } from "react-icons/lia";
import { LuCookingPot } from "react-icons/lu";
import { FaRegSquarePlus } from 'react-icons/fa6';
import { ADMIN_ROLE } from '@/types/Roles';


interface IProps {
    userSettings: TUserSettings;
    defaultCompany: TCompany
    location?: Location;
};
interface IState {
    refreshKey: number
};

const mapStateToProps = (state: RootState) => {
    return {
        userSettings: {
            user:state.user.user as TUser,
            token: state.user.token as string,
            isLoggedIn: state.user.isLoggedIn as boolean
        },
        defaultCompany: state.app.defaultCompany
    }
}

type TProps = typeof mapStateToProps;

class Navigation extends React.Component<IProps, IState>
{
    constructor(props: IProps) {
        super(props);
        this.state = {
            refreshKey: Math.random()
            // userSettings: {
            //     user: {
            //         id: '',
            //         first_name: '',
            //         last_name: '',
            //         username: '',
            //         company_id: '',
            //         email: '',
            //         password: '',
            //         name: '',
            //         role: '',
            //     },
            //     isLoggedIn: false,
            //     token: ''
            // },
            // defaultCompany: {
            //     id: '',
            //     name: '',
            //     email: ''
            // }
        }
        console.log(this.props.userSettings);
    }

    // UNSAFE_componentWillReceiveProps() {
    //     let cond = {
    //         full: this.props.userSettings && this.props.userSettings.user && this.props.userSettings.user.role == ADMIN_ROLE && this.props.defaultCompany.id != '',
    //         userSett: this.props.userSettings,
    //         defaultCompany: this.props.defaultCompany
    //     }
    //     // debugger;
    // }

    isAllowedToRenderCategories = (): boolean => {
        // return true;
        let {defaultCompany} = this.props;
        const userSettings = this.props.userSettings;
        return userSettings.isLoggedIn && (Store.getState().app.defaultCompany.id != '')
            ? true
            : false;
    }

    isAllowedToRenderCompanies = (): boolean => {
        let {defaultCompany} = this.props;
        const userSettings = this.props.userSettings;
        // debugger;
        return userSettings && 
            userSettings.isLoggedIn && 
            userSettings.user.role == ADMIN_ROLE && 
            defaultCompany?.id == '' 
            ? true
            : false;
    }

    isAllowedToRenderUsers = (): boolean => {
        let {defaultCompany} = this.props;
        const userSettings = this.props.userSettings;
        return userSettings && 
            userSettings.isLoggedIn && 
            userSettings.user.role == ADMIN_ROLE && 
            Store.getState().app.defaultCompany?.id != '' 
            ? true
            : false;
    }

    // TODO: rewiew allergen permissions
    isAllowedToRenderAllergens = (): boolean => {
        let {defaultCompany} = this.props;
        const userSettings = this.props.userSettings;
        return userSettings && 
            userSettings.isLoggedIn && 
            userSettings.user.role == ADMIN_ROLE && 
            Store.getState().app.defaultCompany?.id == '' 
            ? true
            : false;
    }

    // TODO: rewiew ingridients permissions
    isAllowedToRenderIngridients = (): boolean => {
        let {defaultCompany} = this.props;
        const userSettings = this.props.userSettings;
        return userSettings && 
            userSettings.isLoggedIn && 
            userSettings.user.role == ADMIN_ROLE && 
            Store.getState().app.defaultCompany?.id == '' 
            ? true
            : false;
    }

    // TODO: rewiew ingridients permissions
    isAllowedToRenderExtras = (): boolean => {
        let {defaultCompany} = this.props;
        const userSettings = this.props.userSettings;
        return userSettings && 
            userSettings.isLoggedIn && 
            userSettings.user.role == ADMIN_ROLE && 
            Store.getState().app.defaultCompany?.id == '' 
            ? true
            : false;
    }

    isAllowedToRenderPreferences = (): boolean => {
        let {defaultCompany} = this.props;
        const userSettings = this.props.userSettings;
        return userSettings && 
            userSettings.isLoggedIn && 
            userSettings.user.role == ADMIN_ROLE && 
            Store.getState().app.defaultCompany?.id == '' 
            ? true
            : false; 
    }

    isAllowedToRenderTables = (): boolean => {
        // return true;
        let {defaultCompany} = this.props;
        const userSettings = this.props.userSettings;
        let store = Store.getState().app;

        return userSettings.isLoggedIn && (Store.getState().app.defaultCompany.id != '')
            ? true
            : false;
    }

    isAllowedToRenderMenus = (): boolean => {
        let {defaultCompany} = this.props;
        const userSettings = this.props.userSettings;
        // console.log('#### MENU PERMISSION FUNCTION::USER SETTINGS ####')
        // console.log(userSettings);
        // console.log('#### /MENU PERMISSION FUNCTION::/USER SETTINGS ####')

        // console.log('#### MENU PERMISSION FUNCTION::DEFAULT COMPANY ####')
        // console.log(Store.getState().app.defaultCompany);
        // console.log('#### /MENU PERMISSION FUNCTION::/DEFAULT COMPANY ####')
        return userSettings.isLoggedIn && (Store.getState().app.defaultCompany.id != '')
            ? true
            : false;
    }

    isAllowedToRenderOrders = (): boolean => {
        let {defaultCompany} = this.props;
        const userSettings = this.props.userSettings;
        // console.log('#### MENU PERMISSION FUNCTION::USER SETTINGS ####')
        // console.log(userSettings);
        // console.log('#### /MENU PERMISSION FUNCTION::/USER SETTINGS ####')

        // console.log('#### MENU PERMISSION FUNCTION::DEFAULT COMPANY ####')
        // console.log(Store.getState().app.defaultCompany);
        // console.log('#### /MENU PERMISSION FUNCTION::/DEFAULT COMPANY ####')
        return userSettings.isLoggedIn && (Store.getState().app.defaultCompany.id != '')
            ? true
            : false;   
    }

    isAllowedToRenderDiscounts = (): boolean => {
        let {defaultCompany} = this.props;
        const userSettings = this.props.userSettings;
        // console.log('#### MENU PERMISSION FUNCTION::USER SETTINGS ####')
        // console.log(userSettings);
        // console.log('#### /MENU PERMISSION FUNCTION::/USER SETTINGS ####')

        // console.log('#### MENU PERMISSION FUNCTION::DEFAULT COMPANY ####')
        // console.log(Store.getState().app.defaultCompany);
        // console.log('#### /MENU PERMISSION FUNCTION::/DEFAULT COMPANY ####')
        return userSettings.isLoggedIn && (Store.getState().app.defaultCompany.id != '')
            ? true
            : false;   
    }

    isAllowedToRenderCombos = (): boolean => {
        // return false;
        let {defaultCompany} = this.props;
        const userSettings = this.props.userSettings;
        // console.log('#### MENU PERMISSION FUNCTION::USER SETTINGS ####')
        // console.log(userSettings);
        // console.log('#### /MENU PERMISSION FUNCTION::/USER SETTINGS ####')

        // console.log('#### MENU PERMISSION FUNCTION::DEFAULT COMPANY ####')
        // console.log(Store.getState().app.defaultCompany);
        // console.log('#### /MENU PERMISSION FUNCTION::/DEFAULT COMPANY ####')
        return userSettings.isLoggedIn && (Store.getState().app.defaultCompany.id != '')
            ? true
            : false;   
    }

    renderCompanySidebarInfo = (): ReactNode => {
        const company = Store.getState().app.defaultCompany;
        return (
            <div className="mb-4 pb-3 border-bottom">
                <div
                className="w-100 rounded mb-3"
                style={{
                    height: '120px',
                    backgroundImage: `url('/storage/${company.logo}')`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'contain'
                }}
                ></div>

                <div className="text-center">
                <h5 className="mb-0 fw-bold">{company.name}</h5>
                <small className="text-muted">Admin Panel</small>
                </div>
            </div> 
        )
    }

    goToAllCompanies = (e: any): void => {
        CompanyHelper.removeSelectedCompany();
        // eslint-disable-next-line
        this.setState({ refreshKey: Math.random() });
    }

    logout = async(e: any) => {
        let success = await LoginAPI.logout();
        if(success) {
            return <Link to={"/login"} viewTransition/>
        }
    }

    render(): React.ReactNode {
        // debugger;
        const defaultCompany = Store.getState().app.defaultCompany;
        return (
            <div id="sidebar" className={`sidebar px-2 py-3 d-flex flex-column h-100 p-3 ${this.props.location?.pathname == '/login' ? 'd-none' : ''}` } key={this.state.refreshKey}>
                {defaultCompany.id == '' && <div className="text-center"><h4 className="fw-bold mb-4">Admin Panel</h4></div>}
                {defaultCompany.id && this.renderCompanySidebarInfo()}
                {/* TOP CONTENT */}
                <div>

                    {/* DASHBOARD */}
                    <Link 
                        to="/admin"
                        className={this.props.location?.pathname === '/admin' ? 'nav-link active': 'nav-link' }      
                        viewTransition
                    >
                        <MdDashboard /> Dashboard
                    </Link>

                    {/* COMPANIES */}
                    {this.isAllowedToRenderCompanies() && <Link 
                        to="/companies"
                        className={this.props.location?.pathname === '/companies' ? 'nav-link active': 'nav-link' }  
                        viewTransition
                    >
                        <GrRestaurant /> Companies
                    </Link>}

                    {/* USERS */}
                    {this.isAllowedToRenderUsers() && <Link 
                        to="/users"
                        className={this.props.location?.pathname === '/users' ? 'nav-link active': 'nav-link' }  
                        viewTransition
                    >
                        <GrRestaurant /> Users
                    </Link>}

                    {/* CATEGORIES */}
                    {this.isAllowedToRenderCategories() && <Link 
                        to="/categories"
                        className={this.props.location?.pathname === '/categories' ? 'nav-link active': 'nav-link' }  
                        viewTransition
                    >
                            <BiCategory /> Categories
                    </Link>}

                    {/* ORDER */}
                    {this.isAllowedToRenderCategories() && <Link 
                        to="/orders"
                        className={this.props.location?.pathname === '/orders' ? 'nav-link active': 'nav-link' }  
                        viewTransition
                    >
                            <BiShoppingBag /> Orders
                    </Link>}

                    {/* TABLES */}
                    {this.isAllowedToRenderTables() && <Link 
                        to="/tables"
                        className={this.props.location?.pathname === '/tables' ? 'nav-link active': 'nav-link' }  
                        viewTransition
                    >
                            <PiDeskBold /> Tables
                    </Link>}

                    {/* MENU */}
                    {this.isAllowedToRenderMenus() && <Link 
                        to="/menu"
                        className={this.props.location?.pathname === '/menu' ? 'nav-link active': 'nav-link' }  
                        viewTransition
                    >
                        <MdOutlineRestaurantMenu /> <span style={{lineHeight: '15px'}}>Menu</span>
                    </Link>}

                    {/* DISCOUNTS */}
                    {this.isAllowedToRenderDiscounts() && <Link 
                        to="/discounts"
                        className={this.props.location?.pathname === '/discounts' ? 'nav-link active': 'nav-link'}
                        viewTransition
                    > 
                        <TbShoppingCartDiscount /> <span style={{ lineHeight: '15px' }}>Discounts</span>
                    </Link>}

                    {/* COMBOS */}
                    {this.isAllowedToRenderCombos() && <Link 
                        to="/combos"
                        className={this.props.location?.pathname === '/combos' ? 'nav-link active': 'nav-link'}
                        viewTransition
                    > 
                        <TbShoppingCartDiscount /> <span style={{ lineHeight: '15px' }}>Combos</span>
                    </Link>}

                    {/* ALLERGENS */}
                    {this.isAllowedToRenderAllergens() || true && <Link 
                        to="/allergens"
                        className={this.props.location?.pathname === '/allergens' ? 'nav-link active': 'nav-link'}
                        viewTransition
                    >
                        <LiaAllergiesSolid /> <span style={{lineHeight: '15px'}}>Allergens</span>
                    </Link>}

                    {/* INGRIDIENTS */}
                    {this.isAllowedToRenderIngridients() || true && <Link
                        to="/ingridients"
                        className={this.props.location?.pathname === '/ingridients' ? 'nav-link active': 'nav-link'}
                        viewTransition
                    >
                        <LuCookingPot /> <span style={{lineHeight: '15px'}}>Ingridients</span>
                    </Link>}

                    {/* EXTRAS */}
                    {this.isAllowedToRenderExtras() || true && <Link
                        to="/extras"
                        className={this.props.location?.pathname === '/extras' ? 'nav-link active': 'nav-link'}
                        viewTransition
                    >
                        <FaRegSquarePlus /> <span style={{lineHeight: '15px'}}>Extras</span>
                    </Link>}

                    {/* PREFERENCES */}
                    {this.isAllowedToRenderPreferences() || true && <Link
                        to="/preferences"
                        className={this.props.location?.pathname === '/preferences' ? 'nav-link active': 'nav-link'}
                        viewTransition
                    >
                        <MdOutlineRoomPreferences /> <span style={{lineHeight: '15px'}}>Preferences</span>
                    </Link>}
                    {/* <a href="/fap">FAP</a> */}
                    {/* <a href="/users">Users</a> */}

                    {/* SETTINGS */}
                    <Link 
                        className={this.props.location?.pathname === '/settings' ? 'nav-link active': 'nav-link' } 
                        to="/settings" 
                        viewTransition
                    >
                        <MdSettings /> Settings
                    </Link>
                </div>

                <div className="mt-auto">
                    <div className="small text-muted mb-2">
                        <Link 
                            className='text-small' 
                            to="#" 
                            onClick={(e: any) =>this.goToAllCompanies(e)} 
                            viewTransition
                        ><IoIosExit /> Exit company</Link>
                    </div>
                    <div>
                        <Link className='fs-5' to="#" onClick={(e: any) =>this.logout(e)} viewTransition><IoIosExit /> Logout</Link>
                    </div>
                    <div className='pt-2 border-top'>
                        <div className='text-center fs-3'>&copy;</div>
                        <div>
                            <div style={{textAlign: 'center', justifyContent: 'center', width: '100%'}}>
                                Menue 2026
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        )
    }
}

// @ts-ignore
export default connect(mapStateToProps)(withLocation(Navigation));