import React from "react";
import TUser, { TUsers } from "@/types/TUser";
import UsersAPI from "@/api/UsersAPI";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import Delete from "@/components/Delete";
import Edit from "@/components/Edit";
import View from "@/components/View";
import CreateCompanyTable from "@/components/tables/CreateCompanyTable";
import { TComponentProps } from "@/types/TComponentProps";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { GrView } from "react-icons/gr";
import { Store } from "@/reducers/Store";
import { ADMIN_ROLE } from "@/types/Roles";
import { showToast } from "@/helpers/Toast";
import CreateUser from "@/components/users/CreateUser";

interface IProps {};
interface IState {
    users: TUsers;
    isCreateUserModalOpened: boolean;
    isEditUserModalOpened: boolean;
    isDeleteUserModalOpened: boolean;
    isViewUserModalOpened: boolean;
    currentItem: TUser;
    deleteItemText: string;
    animationRefreshKey: number;
};


class Users extends React.Component<IProps, IState>
{
    constructor(props: IProps)
    {
        super(props);
        this.state = {
            users: [],
            isCreateUserModalOpened: false,
            isEditUserModalOpened: false,
            isDeleteUserModalOpened: false,
            isViewUserModalOpened: false,
            currentItem: {} as TUser,
            deleteItemText: "",
            animationRefreshKey: Math.random()
        }
    }

    componentDidMount(): void {
        this.loadUsers();
    }

    render(): React.ReactNode {
        return (
            <>
            <div className="tables-page page" >
                {/* <Navigation /> */}

                <div className="main-content" data-key={this.state.animationRefreshKey}>
                    <div className="p-5">
                        <div className="w-12 d-flex justify-content-between">
                            <h4>Users</h4>
                            <h3>
                                <button 
                                    className="btn btn-primary"
                                    onClick={this.openCreateUserModal}
                                >
                                    Create user
                                </button>
                            </h3>
                        </div>
                        <TableContainer>
                            <Table className="data-table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><b>Id</b></TableCell>
                                        <TableCell><b>Name</b></TableCell>
                                        <TableCell><b>Email</b></TableCell>
                                        <TableCell><b>Company</b></TableCell>
                                        {/* {(this.state.user?.role == ADMIN_ROLE) && <TableCell><b>Controls</b></TableCell>} */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.users.length && this.state.users.map((user: TUser) => {
                                        return this.getUserRow(user);
                                    })}

                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>
                <CreateUser
                    isOpen={this.state.isCreateUserModalOpened} 
                    type="modal" 
                    closeCreateUserModal={this.closeCreateUserModal}
                    addNewUserItem={this.addNewUserItem} 
                />
                <View
                    type="user"
                    currentItem={this.state.currentItem as TComponentProps}
                    isOpen={this.state.isViewUserModalOpened}
                    closeModal={this.closeViewUserModal}
                />
                <Edit
                    type="user"
                    currentItem={this.state.currentItem as TComponentProps}
                    isOpen={this.state.isEditUserModalOpened}
                    editCurrentItem={this.editCurrentItem}
                    closeModal={this.closeEditUserModal}
                />
                <Delete
                    onDeleteClicked={this.onDeleteModalClicked}
                    closeModal={this.closeDeleteUserModal}
                    isOpen={this.state.isDeleteUserModalOpened}
                    text={this.state.deleteItemText}
                />
                </>
        )
    }

    getUserRow = (user: TUser) => {
        return (
            <TableRow>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.first_name}</TableCell>
                <TableCell>{user.last_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                    {Store.getState().user.user.role == ADMIN_ROLE && (
                        <>
                            <a 
                                role="button"
                                onClick={() => this.onViewClicked(user)}
                            >
                                <GrView />
                            </a>
                            <a
                                role="button"
                            >
                                <CiEdit onClick={() => this.onEditClicked(user)}/>
                            </a>
                            <MdDelete size={'22pt'} onClick={() => this.onDeleteClicked(user)}/>
                        </>
                    )
                }
                </TableCell>
            </TableRow>
        )
    }

    // Update card info on edit, without refresh
    editCurrentItem = (newItemData: TUser) => {
        const users = this.state.users;
        const updatedItems = users.map((user: TUser) => {
            if(user.id == newItemData.id) 
                return newItemData;
            else return user;
        });
        this.setState({ users: updatedItems });
    }

    onEditClicked = (item: TUser) => {
        this.setState({ currentItem: item });
        this.openEditUserModal();
    }

    onDeleteClicked = (user: TUser) => {
        this.setState({ currentItem: user });
        this.setState({ deleteItemText: `Do you wanna delete user: <b>${user.first_name + ' ' + user.last_name}</b> ?` });
        this.openDeleteUserModal();
    }

    onViewClicked = (user: TUser) => {
        this.setState({ currentItem: user });
        this.openViewUserModal();
    }

    onDeleteModalClicked = async() => {
        const currentItem = this.state.currentItem;
        if(currentItem && currentItem.id) {
            const res = await UsersAPI.deleteUser(currentItem.id);
            if(res && res.success) {
                const newItems: TUsers = this.state.users.filter((user: TUser, index: number) => user.id != currentItem.id);
                this.setState({ users: newItems });
                this.closeDeleteUserModal();
                showToast.success('User deleted successfully');
            }else {
                showToast.error('There\'s problem deleting user. Try again later');
            }
        }else {
            showToast.error('There\'s problem deleting user. Try again later');
        }
    }

   addNewUserItem = (newUser: TUser) => {
        this.setState({ users: [...this.state.users, newUser] });
    }

    openCreateUserModal = () => {
        this.setState({ isCreateUserModalOpened: true });
    }

    closeCreateUserModal = () => {
        this.setState({ isCreateUserModalOpened: false });
    }

    openViewUserModal = () => {
        this.setState({ isViewUserModalOpened: true });
    }

    closeViewUserModal = () => {
        this.setState({ isViewUserModalOpened: false });
    }

    openEditUserModal = () => {
        this.setState({ isEditUserModalOpened: true });
    }

    closeEditUserModal = () => {
        this.setState({ isEditUserModalOpened: false });
    }

    openDeleteUserModal = () => {
        this.setState({ isDeleteUserModalOpened: true });
    }

    closeDeleteUserModal = () => {
        this.setState({ isDeleteUserModalOpened: false });
    }

    loadUsers = async() => {
        let users = await UsersAPI.getUsers();
        this.setState({ users: users }); 
    }
}

export default Users;