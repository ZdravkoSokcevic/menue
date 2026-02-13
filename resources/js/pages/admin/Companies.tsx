import React from "react";
import { connect } from "react-redux";
import Navigation from "../admin/Navigation";
import TUser from "@/types/TUser";
import { IoArrowRedoCircle } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { GrView } from "react-icons/gr";
import { Navigate } from "react-router-dom";
import {
    Table, 
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import { TCompaniesArr, TCompany } from "@/types/TCompanies";
import CompaniesAPI from "@/api/CompaniesAPI";
import Login from "@/api/Login";
import CompanyHelper from "@/helpers/CompanyHelper";
import { RootState, Store } from "@/reducers/Store";
import { animatedRefresh, setDefaultCompany } from "@/reducers/appSlice";

interface IProps {
    animationRefreshKey?: number
};
interface IState {
    user: TUser | null;
    companies: TCompaniesArr;
    animationRefreshKey: number;
    isVisitAllowed: boolean;
};


class Companies extends React.Component<IProps, IState>
{

    constructor(props: IProps) {
        super(props);
        this.state = {
            companies: [],
            user: {} as TUser,
            animationRefreshKey: Math.random(),
            isVisitAllowed: false
        }
    }

    // PREVENTION LOADING ADMIN PAGE WHEN LOGGED IN
    componentDidMount(): void {
        this.loadCompanies();
        this.getLoggedIn();
    }

    // componentWillReceiveProps(nextProps: Readonly<IProps>, nextContext: any): void {
    //     if(this.state.animationRefreshKey != nextProps.animationRefreshKey)
    //         this.setState({ animationRefreshKey: nextProps.animationRefreshKey as number });
    // }

    componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {

        console.log('Did update');
        if(prevState.animationRefreshKey != this.state.animationRefreshKey) {
            // Do the component animation
            console.log('Razlicito je');
            // debugger;
            (async() => {
            // debugger;
                // let el = document.getElementsByClassName('admin-nav-c')[0];
                let el = document.body;
                if(el)
                {
                    debugger;
                    el.classList.add('fadeInOut');
                    setTimeout(() => {
                        el.classList.remove('fadeInOut');

                        // Reroute user from companies page
                        // because he chooses one
                        this.setState({isVisitAllowed: false});
                    }, 1000);

                }
            })();
        }
    }

    render() {
        // if(!this.state.isVisitAllowed)
        //     return <Navigate to="/admin" replace={true} />

        return (
            <div className="admin-nav-c" data-key={this.state.animationRefreshKey}>
                <Navigation />

                <div className="main-content">
                    <div className="p-5">
                        <div className="w-12 d-flex justify-content-between">
                            <h4>Companies</h4>
                            <h3>{'Exchange <- ->'}</h3>
                        </div>
                        <TableContainer>
                            <Table className="data-table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><b>Id</b></TableCell>
                                        <TableCell><b>Logo</b></TableCell>
                                        <TableCell><b>Name</b></TableCell>
                                        <TableCell><b>Email</b></TableCell>
                                        <TableCell><b>Description</b></TableCell>
                                        <TableCell><b>Phone</b></TableCell>
                                        {(this.state.user?.role == 'admin') && <TableCell><b>Controls</b></TableCell>}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.companies.length && this.state.companies.map((company: any) => {
                                        return this.getCompanyRow(company);
                                        // return (
                                        //     <TableRow>
                                        //         <TableCell>{company.id}</TableCell>
                                        //         <TableCell><img src={company.logo} alt="" /></TableCell>
                                        //         <TableCell>{company.name}</TableCell>
                                        //         <TableCell>{company.email}</TableCell>
                                        //         <TableCell>{company.description}</TableCell>
                                        //         <TableCell>{company.phone}</TableCell>
                                        //     </TableRow> 
                                        // )
                                    })}

                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>
        )
    }

    getCompanyRow = (company: TCompany) => {
        return (
            <TableRow>
                <TableCell>{company.id}</TableCell>
                <TableCell><img src={company.logo} alt="" /></TableCell>
                <TableCell>{company.name}</TableCell>
                <TableCell>{company.email}</TableCell>
                <TableCell>{company.description}</TableCell>
                <TableCell>{company.phone}</TableCell>
                <TableCell>
                    {this.state.user?.role == 'admin' && (
                        <>
                            <a href="#">
                                <GrView />
                            </a>
                            <a href="#" title={'Act as ' + company.name} onClick={() => this.switchToCompany(company)}>
                                <IoArrowRedoCircle />
                            </a>
                            <a href="">
                                <CiEdit />
                            </a>
                        </>
                    )
                }
                </TableCell>
            </TableRow>
        )
    }

    // switch view to specific company
    // to be able to see and modify menu by default
    // Otherwise menu will show all companies first
    // Then you must choose company there and will be able to see menu 
    switchToCompany = async(company: TCompany) => {
        console.log('Switch to company');
        CompanyHelper.storeDefaultCompany(company);
        Store.dispatch(setDefaultCompany(company));
        this.setState({ isVisitAllowed: false });
        Store.dispatch(animatedRefresh({}));
        
    }

    loadCompanies = async() => {
        let companies = await CompaniesAPI.getCompanies();
        this.setState({ companies: companies }); 
    }

    getLoggedIn = async() => {
        let user = await Login.getLoggedIn();
        if(user)
            this.setState({ user: user as TUser });
    }
    
}

const mapStateToProps = (state: RootState) => {
    return {
        animationRefreshKey: state.app.animationRefreshKey
    }
}

export default connect(mapStateToProps) (Companies);