import { RootState, Store } from '@/reducers/Store';
import { TCompany } from '@/types/TCompanies';
import TUser, { TUserSettings } from '@/types/TUser';
import React from 'react';
import { connect } from 'react-redux';

interface IProps {
    userSettings: TUserSettings;
    defaultCompany: TCompany
};
interface IState {

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
    }

    // UNSAFE_componentWillReceiveProps() {
    //     let cond = {
    //         full: this.props.userSettings && this.props.userSettings.user && this.props.userSettings.user.role == 'admin' && this.props.defaultCompany.id != '',
    //         userSett: this.props.userSettings,
    //         defaultCompany: this.props.defaultCompany
    //     }
    //     // debugger;
    // }

    render(): React.ReactNode {
        let {defaultCompany} = this.props;
        // debugger;
        return (
            // <nav>
            //     <a href="#">Navitem1</a>
            //     <a href="#">Navitem2</a>
            // </nav>
        <div id="sidebar" className="sidebar p-3" data-key={this.props.userSettings.user.id}>
        <h4 className="fw-bold mb-4">Navigation</h4>
        <a href="/dashboard">Dashboard</a>
        {this.props.userSettings && this.props.userSettings.user && this.props.userSettings.user.role == 'admin' && (Store.getState().app.defaultCompany.id == '') && <a href="/companies">Companies</a>}
        <a href="/menu">Menu</a>
        <a href="/regression">Regression</a>
        <a href="/fap">FAP</a>
        <a href="/users">Users</a>
        <a href="/settings">Settings</a>
        </div>
        )
    }
}

// @ts-ignore
export default connect(mapStateToProps)(Navigation);