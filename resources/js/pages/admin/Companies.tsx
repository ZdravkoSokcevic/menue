import React from "react";
import { connect } from "react-redux";
import Navigation from "../admin/Navigation";
import TUser from "@/types/TUser";
import { IoArrowRedoCircle } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { GrView } from "react-icons/gr";
import { Link, Navigate } from "react-router-dom";
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
import CreateCompany from "@/components/companies/CreateCompany";
import View from "@/components/View";
import { TComponentProps } from "@/types/TComponentProps";
import Edit from "@/components/Edit";
import Delete from "@/components/Delete";
import { MdDelete } from "react-icons/md";

interface IProps {
    animationRefreshKey?: number
};
interface IState {
    user: TUser | null;
    companies: TCompaniesArr;
    animationRefreshKey: number;
    isVisitAllowed: boolean;
    isCreateCompanyModalOpened: boolean;
    isEditCompanyModalOpened: boolean;
    isDeleteCompanyModalOpened: boolean;
    isViewCompanyModalOpened: boolean;
    currentItem: TCompany
};


class Companies extends React.Component<IProps, IState>
{

    constructor(props: IProps) {
        super(props);
        this.state = {
            companies: [],
            user: {} as TUser,
            animationRefreshKey: Math.random(),
            isVisitAllowed: false,
            isCreateCompanyModalOpened: false,
            isEditCompanyModalOpened: false,
            isViewCompanyModalOpened: false,
            isDeleteCompanyModalOpened: false,
            currentItem: {} as TCompany
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

        if(prevState.animationRefreshKey != this.state.animationRefreshKey) {
            // Do the component animation
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
            <div className="companies-page page" >
                {/* <Navigation /> */}

                <div className="main-content" data-key={this.state.animationRefreshKey}>
                    <div className="p-5">
                        <div className="w-12 d-flex justify-content-between">
                            <h4>Companies</h4>
                            <h3>
                                <button 
                                    className="btn btn-primary"
                                    onClick={this.openCreateModal}
                                >
                                    Create company
                                </button>
                            </h3>
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
                <CreateCompany 
                    isOpen={this.state.isCreateCompanyModalOpened} 
                    type="modal" 
                    closeCreateCompanyModal={this.closeCreateCompanyModal}
                    addNewCompanyItem={this.addNewCompanyItem} 
                />
                <View
                    type="company"
                    currentItem={this.state.currentItem as TComponentProps}
                    isOpen={this.state.isViewCompanyModalOpened}
                    closeModal={this.closeViewCompanyModal}
                />
                <Edit
                    type="company"
                    currentItem={this.state.currentItem as TComponentProps}
                    isOpen={this.state.isEditCompanyModalOpened}
                    closeModal={this.closeEditCompanyModal}
                    editCurrentItem={this.editCurrentItem}
                />
                <Delete
                    onDeleteClicked={this.onDeleteModalClicked}
                    closeModal={this.closeDeleteCompanyModal}
                    isOpen={this.state.isDeleteCompanyModalOpened}
                />
            </div>
        )
    }

    getCompanyRow = (company: TCompany) => {
        return (
            <TableRow>
                <TableCell>{company.id}</TableCell>
                <TableCell><img src={"/storage/"+ company.logo as string} alt="" style={{width:'50px'}}/></TableCell>
                <TableCell>{company.name}</TableCell>
                <TableCell>{company.email}</TableCell>
                <TableCell className="col-sm-5">{company.description}</TableCell>
                <TableCell>{company.phone}</TableCell>
                <TableCell>
                    {this.state.user?.role == 'admin' && (
                        <>
                            <a 
                                role="button"
                                onClick={() => this.onViewClicked(company)}
                            >
                                <GrView />
                            </a>
                            <Link to={"/admin"} title={'Act as ' + company.name} onClick={() => this.switchToCompany(company)} >
                                <IoArrowRedoCircle />
                            </Link>
                            <a
                                role="button"
                            >
                                <CiEdit onClick={() => this.onEditClicked(company)}/>
                            </a>
                            <MdDelete size={'22pt'} onClick={() => this.onDeleteClicked(company)}/>
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
        // Store.dispatch(setDefaultCompany(company));
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

   addNewCompanyItem = (newItem: TCompany) => {
        this.setState({ companies: [...this.state.companies, newItem] });
    }

    // Update card info on edit, without refresh
    editCurrentItem = (newItemData: TCompany) => {
        const items = this.state.companies;
        const updatedItems = items.map((item: TCompany) => {
            if(item.id == newItemData.id) 
                return newItemData;
            else return item;
        });
        this.setState({ companies: updatedItems });
    }

    onViewClicked = (item: TCompany) => {
        this.setState({ currentItem: item });
        this.openViewModal();
    }

    onEditClicked = (item: TCompany) => {
        this.setState({ currentItem: item });
        this.openEditCompanyModal();
    }

    onDeleteClicked = (item: TCompany) => {
        this.setState({ currentItem: item });
        this.openDeleteCompanyModal();
    }

    onDeleteModalClicked = async() => {
        const currentItem = this.state.currentItem;
        if(currentItem && currentItem.id) {
            const res = await CompaniesAPI.deleteCompany(currentItem.id);
            if(res && res.success) {
                const newItems: Array<TCompany> = this.state.companies.filter((item: TCompany, index: number) => item.id != currentItem.id);
                this.setState({ companies: newItems });
                this.closeDeleteCompanyModal();
            }else {
                alert('Cannot delete company!');
            }
        }else {
            alert('Cannot delete company');
        }
    }

    openCreateModal = () => {
        this.setState({ isCreateCompanyModalOpened: true });
    }

    openViewModal = () => {
        this.setState({ isViewCompanyModalOpened: true });
    }
    
    openEditCompanyModal = () => {
        this.setState({ isEditCompanyModalOpened: true });
    }

    openDeleteCompanyModal = () => {
        this.setState({ isDeleteCompanyModalOpened: true });
    }

    closeCreateCompanyModal = () => {
        this.setState({ isCreateCompanyModalOpened: false });
    }

    closeViewCompanyModal = () => {
        this.setState({ currentItem: {} as TCompany });
        this.setState({ isViewCompanyModalOpened: false });
    }

    closeEditCompanyModal = () => {
        this.setState({ currentItem: {} as TCompany });
        this.setState({ isEditCompanyModalOpened: false })
    }

    closeDeleteCompanyModal = () => {
        this.setState({ currentItem: {} as TCompany });
        this.setState({ isDeleteCompanyModalOpened: false })
    }
    
}

const mapStateToProps = (state: RootState) => {
    return {
        animationRefreshKey: state.app.animationRefreshKey
    }
}

export default connect(mapStateToProps) (Companies);