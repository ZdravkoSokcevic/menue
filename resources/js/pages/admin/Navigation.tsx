import LoginAPI from '@/api/Login';
import AppHelper from '@/helpers/AppHelper';
import CompanyHelper from '@/helpers/CompanyHelper';
import { RootState, Store } from '@/reducers/Store';
import { withLocation } from '@/routes/withLocation';
import { TCompany } from '@/types/TCompanies';
import TUser, { TUserSettings } from '@/types/TUser';
import React from 'react';
import { connect } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';


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
    //         full: this.props.userSettings && this.props.userSettings.user && this.props.userSettings.user.role == 'admin' && this.props.defaultCompany.id != '',
    //         userSett: this.props.userSettings,
    //         defaultCompany: this.props.defaultCompany
    //     }
    //     // debugger;
    // }

    isAllowedToRenderCategories = (): boolean => {
        // return true;
        let {defaultCompany} = this.props;
        const userSettings = this.props.userSettings;
        // debugger;
        return userSettings && 
            userSettings.isLoggedIn &&
            (userSettings.user.role == 'admin' || userSettings.user.role == 'company_admin' || userSettings.user.role == 'agent') 
                ? true
                : false;
    }

    isAllowedToRenderCompanies = (): boolean => {
        // return true;
        let {defaultCompany} = this.props;
        const userSettings = this.props.userSettings;
        // let allowed = userSettings && 
        //     userSettings.isLoggedIn && 
        //     userSettings.user.role == 'admin' && 
        //     (Store.getState().app.defaultCompany.id == '') ;
        //     debugger;
        return userSettings && 
            userSettings.isLoggedIn && 
            userSettings.user.role == 'admin' && 
            (Store.getState().app.defaultCompany?.id == '') 
            ? true
            : false;
    }

    isAllowedToRenderTables = (): boolean => {
        // return true;
        let {defaultCompany} = this.props;
        const userSettings = this.props.userSettings;
        // let allowed = userSettings && 
        //     userSettings.isLoggedIn && 
        //     userSettings.user.role == 'admin' && 
        //     (Store.getState().app.defaultCompany.id == '') ;
        //     debugger;
        return userSettings && 
            userSettings.isLoggedIn && 
            userSettings.user.role == 'admin' && 
            !(Store.getState().app.defaultCompany?.id == '') 
            ? true
            : false;
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
        return (
            <div id="sidebar" className={`sidebar p-3 ${this.props.location?.pathname == '/login' ? 'd-none' : ''}` } key={this.state.refreshKey}>
                <h4 className="fw-bold mb-4">Navigation</h4>
                <Link 
                    to="/admin"
                    className={this.props.location?.pathname === '/admin' ? 'active': '' }      
                    viewTransition
                >Dashboard</Link>
                {this.isAllowedToRenderCompanies() && <Link 
                    to="/companies"
                    className={this.props.location?.pathname === '/companies' ? 'active': '' }  
                    viewTransition
                >
                    Companies
                </Link>}
                {this.isAllowedToRenderCategories() && <Link 
                    to="/categories"
                    className={this.props.location?.pathname === '/categories' ? 'active': '' }  
                    viewTransition
                >
                        Categories
                </Link>}
                {this.isAllowedToRenderTables() && <Link 
                    to="/tables"
                    className={this.props.location?.pathname === '/tables' ? 'active': '' }  
                    viewTransition
                >
                        Tables
                </Link>}

                <Link 
                    to="/menu"
                    className={this.props.location?.pathname === '/menu' ? 'active': '' }  
                    viewTransition
                >
                    Menu
                </Link>
                {/* <a href="/fap">FAP</a> */}
                {/* <a href="/users">Users</a> */}
                <Link to="/settings" viewTransition>Settings</Link>
                <Link to="#" onClick={(e: any) =>this.goToAllCompanies(e)} viewTransition>Exit to all companies</Link>
                <Link to="#" onClick={(e: any) =>this.logout(e)} viewTransition>Logout</Link>

                <div style={{position: 'absolute', bottom: '20pt', fontSize: '20pt', left: '50%', transform: 'translateX(-50%)'}}>&copy;</div>
                <div style={{position: 'absolute', bottom: '10pt', width: '100%', left: '0'}}>
                    <div style={{textAlign: 'center', justifyContent: 'center', width: '100%'}}>
                        Menue 2026
                    </div>
                </div>
            </div>
        )
    }
}

// @ts-ignore
export default connect(mapStateToProps)(withLocation(Navigation));