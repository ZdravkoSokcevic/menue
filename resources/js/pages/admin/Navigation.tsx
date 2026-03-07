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

    goToAllCompanies = (e: any): void => {
        CompanyHelper.removeSelectedCompany();
        // eslint-disable-next-line
        this.setState({ refreshKey: Math.random() });
    }

    render(): React.ReactNode {
        // debugger;
        return (
            <div id="sidebar" className="sidebar p-3" key={this.state.refreshKey}>
                <h4 className="fw-bold mb-4">Navigation</h4>
                <Link 
                    to="/admin"
                    className={this.props.location?.pathname === '/admin' ? 'active': '' }      
                >Dashboard</Link>
                {this.isAllowedToRenderCategories() && <Link 
                    to="/categories"
                    className={this.props.location?.pathname === '/categories' ? 'active': '' }  
                >
                        Categories
                </Link>}
                {this.isAllowedToRenderCompanies() && <Link 
                    to="/companies"
                    className={this.props.location?.pathname === '/companies' ? 'active': '' }  
                >
                    Companies
                </Link>}
                <Link 
                    to="/menu"
                    className={this.props.location?.pathname === '/menu' ? 'active': '' }  
                >
                    Menu
                </Link>
                {/* <a href="/fap">FAP</a> */}
                {/* <a href="/users">Users</a> */}
                <Link to="/settings">Settings</Link>
                <Link to="#" onClick={(e: any) =>this.goToAllCompanies(e)}>Exit to all companies</Link>
            </div>
        )
    }
}

// @ts-ignore
export default connect(mapStateToProps)(withLocation(Navigation));