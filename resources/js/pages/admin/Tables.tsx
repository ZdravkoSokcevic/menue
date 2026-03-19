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
import { ICompanyTable, TTables } from "@/types/TCompanyTables";
import CreateCompanyTable from "@/components/tables/CreateCompanyTable";
import TablesAPI from "@/api/TablesAPI";
import Delete from "@/components/Delete";
import { MdDelete } from "react-icons/md";

interface IProps {
    animationRefreshKey?: number
};
interface IState {
    user: TUser | null;
    tables: TTables;
    animationRefreshKey: number;
    isVisitAllowed: boolean;
    isCreateCompanyTableModalOpened: boolean;
    isEditCompanyTableModalOpened: boolean;
    isDeleteCompanyTableModalOpened: boolean;
    isViewCompanyTableModalOpened: boolean;
    currentItem: ICompanyTable;
    companies: TCompaniesArr;
};


class Tables extends React.Component<IProps, IState>
{

    constructor(props: IProps) {
        super(props);
        this.state = {
            tables: [],
            user: {} as TUser,
            animationRefreshKey: Math.random(),
            isVisitAllowed: false,
            isCreateCompanyTableModalOpened: false,
            isEditCompanyTableModalOpened: false,
            isViewCompanyTableModalOpened: false,
            isDeleteCompanyTableModalOpened: false,
            currentItem: {} as ICompanyTable,
            companies: []
        }
    }

    // PREVENTION LOADING ADMIN PAGE WHEN LOGGED IN
    componentDidMount(): void {
        this.loadCategories();
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
            <div className="tables-page page" >
                {/* <Navigation /> */}

                <div className="main-content" data-key={this.state.animationRefreshKey}>
                    <div className="p-5">
                        <div className="w-12 d-flex justify-content-between">
                            <h4>Tables</h4>
                            <h3>
                                <button 
                                    className="btn btn-primary"
                                    onClick={this.openCreateModal}
                                >
                                    Create table
                                </button>
                            </h3>
                        </div>
                        <TableContainer>
                            <Table className="data-table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><b>Id</b></TableCell>
                                        <TableCell><b>Name</b></TableCell>
                                        <TableCell><b>Company</b></TableCell>
                                        {(this.state.user?.role == 'admin') && <TableCell><b>Controls</b></TableCell>}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.tables.length && this.state.tables.map((table: any) => {
                                        return this.getTableRow(table);
                                        // return (
                                        //     <TableRow>
                                        //         <TableCell>{table.id}</TableCell>
                                        //         <TableCell><img src={table.logo} alt="" /></TableCell>
                                        //         <TableCell>{table.name}</TableCell>
                                        //         <TableCell>{table.email}</TableCell>
                                        //         <TableCell>{table.description}</TableCell>
                                        //         <TableCell>{table.phone}</TableCell>
                                        //     </TableRow> 
                                        // )
                                    })}

                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
                <CreateCompanyTable 
                    isOpen={this.state.isCreateCompanyTableModalOpened} 
                    type="modal" 
                    closeCreateCategoryTableModal={this.closeCreateCompanyTableModal}
                    addNewCategoryTableItem={this.addNewCompanyTableItem} 
                />
                <View
                    type="table"
                    currentItem={this.state.currentItem as TComponentProps}
                    isOpen={this.state.isViewCompanyTableModalOpened}
                    closeModal={this.closeViewCompanyTableModal}
                />
                <Edit
                    type="table"
                    currentItem={this.state.currentItem as TComponentProps}
                    isOpen={this.state.isEditCompanyTableModalOpened}
                    editCurrentItem={this.editCurrentItem}
                    closeModal={this.closeEditCompanyTableModal}
                />
                <Delete
                    onDeleteClicked={this.onDeleteModalClicked}
                    closeModal={this.closeDeleteCompanyTableModal}
                    isOpen={this.state.isDeleteCompanyTableModalOpened}
                />
            </div>
        )
    }

    getTableRow = (table: ICompanyTable) => {
        return (
            <TableRow>
                <TableCell>{table.id}</TableCell>
                <TableCell>{table.name}</TableCell>
                <TableCell>{table.company_id}</TableCell>
                <TableCell>
                    {this.state.user?.role == 'admin' && (
                        <>
                            <a 
                                role="button"
                                onClick={() => this.onViewClicked(table)}
                            >
                                <GrView />
                            </a>
                            <a
                                role="button"
                            >
                                <CiEdit onClick={() => this.onEditClicked(table)}/>
                            </a>
                            <MdDelete size={'22pt'} onClick={() => this.onDeleteClicked(table)}/>
                        </>
                    )
                }
                </TableCell>
            </TableRow>
        )
    }

    // switch view to specific table
    // to be able to see and modify menu by default
    // Otherwise menu will show all companies first
    // Then you must choose table there and will be able to see menu 
    // switchToCompany = async(table: TCompany) => {
    //     console.log('Switch to table');
    //     CompanyHelper.storeDefaultCompany(table);
    //     // Store.dispatch(setDefaultCompany(table));
    //     this.setState({ isVisitAllowed: false });
    //     Store.dispatch(animatedRefresh({}));
        
    // }

    loadCategories = async() => {
        let tables = await TablesAPI.getItems();
        this.setState({ tables: tables as TTables}); 
    }

    getLoggedIn = async() => {
        let user = await Login.getLoggedIn();
        if(user)
            this.setState({ user: user as TUser });
    }

   addNewCompanyTableItem = (newItem: ICompanyTable) => {
        this.setState({ tables: [...this.state.tables, newItem] });
    }

    // Update card info on edit, without refresh
    editCurrentItem = (newItemData: ICompanyTable) => {
        const items = this.state.tables;
        const updatedItems = items.map((item: ICompanyTable) => {
            if(item.id == newItemData.id) 
                return newItemData;
            else return item;
        });
        this.setState({ tables: updatedItems });
    }

    onViewClicked = (item: ICompanyTable) => {
        this.setState({ currentItem: item });
        this.openViewModal();
    }

    onEditClicked = (item: ICompanyTable) => {
        this.setState({ currentItem: item });
        this.openEditCompanyTableModal();
    }

    onDeleteClicked = (item: ICompanyTable) => {
        this.setState({ currentItem: item });
        this.openDeleteCompanyTableModal();
    }

    onDeleteModalClicked = async() => {
        const currentItem = this.state.currentItem;
        if(currentItem && currentItem.id) {
            const res = await TablesAPI.deleteCompanyTable(currentItem.id);
            if(res && res.success) {
                const newItems: TTables = this.state.tables.filter((item: ICompanyTable, index: number) => item.id != currentItem.id);
                this.setState({ tables: newItems });
                this.closeDeleteCompanyTableModal();
            }else {
                alert('Cannot delete menu!');
            }
        }else {
            alert('Cannot delete table');
        }
    }

    openCreateModal = () => {
        this.setState({ isCreateCompanyTableModalOpened: true });
    }

    openViewModal = () => {
        this.setState({ isViewCompanyTableModalOpened: true });
    }
    
    openEditCompanyTableModal = () => {
        this.setState({ isEditCompanyTableModalOpened: true });
    }

    openDeleteCompanyTableModal = () => {
        this.setState({ isDeleteCompanyTableModalOpened: true });
    }

    closeCreateCompanyTableModal = () => {
        this.setState({ isCreateCompanyTableModalOpened: false });
    }

    closeViewCompanyTableModal = () => {
        this.setState({ currentItem: {} as ICompanyTable });
        this.setState({ isViewCompanyTableModalOpened: false });
    }

    closeEditCompanyTableModal = () => {
        this.setState({ currentItem: {} as ICompanyTable });
        this.setState({ isEditCompanyTableModalOpened: false })
    }

    closeDeleteCompanyTableModal = () => {
        this.setState({ currentItem: {} as ICompanyTable });
        this.setState({ isDeleteCompanyTableModalOpened: false })
    }
    
}

const mapStateToProps = (state: RootState) => {
    return {
        animationRefreshKey: state.app.animationRefreshKey
    }
}

export default connect(mapStateToProps) (Tables);