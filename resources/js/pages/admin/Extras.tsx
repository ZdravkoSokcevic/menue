import React, { ReactNode } from "react";
import { Table, TableBody, TableRow, TableHead, TableContainer, TableCell } from "@mui/material";



import "../../../sass/allergens.scss"
import View from "@/components/View";
import { TComponentProps } from "@/types/TComponentProps";
import Edit from "@/components/Edit";
import Delete from "@/components/Delete";
import TUser from "@/types/TUser";
import Login from "@/api/Login";
import { IExtra, TExtras } from "@/types/Extra";
import ExtrasAPI from "@/api/ExtrasAPI";
import { GrView } from "react-icons/gr";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import CreateExtra from "@/components/extra/CreateExtra";
import { FaRegSquarePlus } from "react-icons/fa6";
import { GoPlus } from "react-icons/go";

interface IProps {};
interface IState {
    user: TUser | null;
    isCreateExtrasModalOpened: boolean;
    isViewExtrasModalOpened: boolean;
    isEditExtrasModalOpened: boolean;
    isDeleteModalOpened: boolean;
    extras: TExtras;
    currentItem: IExtra;
};
class Extras extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            isCreateExtrasModalOpened: false,
            isViewExtrasModalOpened: false,
            isEditExtrasModalOpened: false,
            isDeleteModalOpened: false,
            extras: [],
            currentItem: {} as IExtra,
            user: {} as TUser,
        }
    }

    getLoggedIn = async() => {
        let user = await Login.getLoggedIn();
        if(user)
            this.setState({ user: user as TUser });
    }

    componentDidMount(): void {
        this.fetchExtras();
        this.getLoggedIn();
    }

    render(): ReactNode {
        return (
            <div className="companies-page page" key={Math.random() as number}>
                {/* <Navigation /> */}

                <div className="main-content">
                    <div className="p-5">
                        <div className="w-12 d-flex justify-content-between">
                            <h4><FaRegSquarePlus /> Extras</h4>
                            <h3>
                                <button 
                                    className="btn btn-primary"
                                    onClick={this.openCreateModal}
                                >
                                    <GoPlus /> Create extra
                                </button>
                            </h3>
                        </div>
                        <TableContainer>
                            <Table className="data-table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><b>Id</b></TableCell>
                                        <TableCell><b>Name</b></TableCell>
                                        <TableCell><b>Description</b></TableCell>
                                        {(this.state.user?.role == 'admin') && <TableCell><b>Controls</b></TableCell>}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.extras.length && this.state.extras.map((extra: IExtra) => {
                                        // return this.getExtraRow(company);
                                        return (
                                            <TableRow>
                                                <TableCell>{extra.id}</TableCell>
                                                <TableCell>{extra.name}</TableCell>
                                                <TableCell>{extra.description}</TableCell>
                                                <TableCell>
                                                    {this.state.user?.role == 'admin' && (
                                                        <>
                                                            <a 
                                                                role="button"
                                                                onClick={() => this.onViewClicked(extra)}
                                                            >
                                                                <GrView />
                                                            </a>
                                                            <a
                                                                role="button"
                                                            >
                                                                <CiEdit onClick={() => this.onEditClicked(extra)}/>
                                                            </a>
                                                            <MdDelete size={'22pt'} onClick={() => this.onDeleteClicked(extra)}/>
                                                        </>
                                                    )
                                                }
                                                </TableCell>
                                            </TableRow> 
                                        )
                                    })}

                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
                <CreateExtra 
                    isOpen={this.state.isCreateExtrasModalOpened} 
                    type="modal" 
                    closeCreateExtraModal={this.closeCreateExtrasModal}
                    addNewExtraItem={this.addNewItem} 
                />
                <View
                    type="extra"
                    currentItem={this.state.currentItem as TComponentProps}
                    isOpen={this.state.isViewExtrasModalOpened}
                    closeModal={this.closeViewExtrasModal}
                />
                <Edit
                    type="extra"
                    currentItem={this.state.currentItem as TComponentProps}
                    isOpen={this.state.isEditExtrasModalOpened}
                    closeModal={this.closeEditExtrasModal}
                    editCurrentItem={this.editCurrentItem}
                />
                <Delete
                    onDeleteClicked={this.onDeleteModalClicked}
                    closeModal={this.closeDeleteExtrasModal}
                    isOpen={this.state.isDeleteModalOpened}
                />
            </div>

        )
    }

    fetchExtras = async() => {
        const items = await ExtrasAPI.getItems();
        if(items) {
            this.setState({ extras: items });
        }
    }

    addNewItem = (newItem: IExtra) => {
        this.setState({ extras: [...this.state.extras, newItem] });
    }

    // Update card info on edit, without refresh
    editCurrentItem = (newItemData: IExtra) => {
        const items: TExtras = this.state.extras;
        const updatedItems = items.map((item: IExtra) => {
            if(item.id == newItemData.id) 
                return newItemData;
            else return item;
        });
        this.setState({ extras: updatedItems });
    }

    onViewClicked = (item: IExtra) => {
        this.setState({ currentItem: item });
        this.openViewModal();
    }

    onEditClicked = (item: IExtra) => {
        this.setState({ currentItem: item });
        this.openEditExtrasModal();
    }

    onDeleteClicked = (item: IExtra) => {
        this.setState({ currentItem: item });
        this.openDeleteExtrasModal();
    }

    onDeleteModalClicked = async() => {
        const currentItem = this.state.currentItem;
        if(currentItem && currentItem.id) {
            const res = await ExtrasAPI.deleteExtra(currentItem.id);
            if(res && res.success) {
                const newItems: Array<IExtra> = this.state.extras.filter((item: IExtra, index: number) => item.id != currentItem.id);
                this.setState({ extras: newItems });
                this.closeDeleteExtrasModal();
            }else {
                alert('Cannot delete extra!');
            }
        }else {
            alert('Cannot delete extra');
        }
    }

    openCreateModal = () => {
        this.setState({ isCreateExtrasModalOpened: true });
    }

    openViewModal = () => {
        this.setState({ isViewExtrasModalOpened: true });
    }
    
    openEditExtrasModal = () => {
        this.setState({ isEditExtrasModalOpened: true });
    }

    openDeleteExtrasModal = () => {
        this.setState({ isDeleteModalOpened: true });
    }

    closeCreateExtrasModal = () => {
        this.setState({ isCreateExtrasModalOpened: false });
    }

    closeViewExtrasModal = () => {
        this.setState({ currentItem: {} as IExtra });
        this.setState({ isViewExtrasModalOpened: false });
    }

    closeEditExtrasModal = () => {
        this.setState({ currentItem: {} as IExtra });
        this.setState({ isEditExtrasModalOpened: false })
    }

    closeDeleteExtrasModal = () => {
        this.setState({ currentItem: {} as IExtra });
        this.setState({ isDeleteModalOpened: false })
    }
}


export default Extras;