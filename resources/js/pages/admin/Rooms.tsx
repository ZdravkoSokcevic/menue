import React from "react";
import { connect } from "react-redux";
import TUser from "@/types/TUser";
import { CiEdit } from "react-icons/ci";
import { GrView } from "react-icons/gr";
import {
    Table, 
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import { TCompaniesArr } from "@/types/TCompanies";
import Login from "@/api/Login";
import { RootState } from "@/reducers/Store";
import View from "@/components/View";
import { TComponentProps } from "@/types/TComponentProps";
import Edit from "@/components/Edit";
import { IRoom, TRooms } from "@/types/TRooms";
import RoomsAPI from "@/api/RoomsAPI";
import Delete from "@/components/Delete";
import { MdDelete } from "react-icons/md";
import { ADMIN_ROLE } from "@/types/Roles";
import { showToast } from "@/helpers/Toast";
import CreateRoom from "@/components/rooms/CreateRoom";

interface IProps {
    animationRefreshKey?: number
};
interface IState {
    user: TUser | null;
    rooms: TRooms;
    animationRefreshKey: number;
    isVisitAllowed: boolean;
    isCreateRoomModalOpened: boolean;
    isEditRoomModalOpened: boolean;
    isDeleteRoomModalOpened: boolean;
    isViewRoomModalOpened: boolean;
    currentItem: IRoom;
    companies: TCompaniesArr;
    deleteItemText: string;
};


class Rooms extends React.Component<IProps, IState>
{

    constructor(props: IProps) {
        super(props);
        this.state = {
            rooms: [],
            user: {} as TUser,
            animationRefreshKey: Math.random(),
            isVisitAllowed: false,
            isCreateRoomModalOpened: false,
            isEditRoomModalOpened: false,
            isViewRoomModalOpened: false,
            isDeleteRoomModalOpened: false,
            currentItem: {} as IRoom,
            companies: [],
            deleteItemText: '',
        }
    }

    // PREVENTION LOADING ADMIN PAGE WHEN LOGGED IN
    componentDidMount(): void {
        this.loadRooms();
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
            <div className="rooms-page page" >
                {/* <Navigation /> */}

                <div className="main-content" data-key={this.state.animationRefreshKey}>
                    <div className="p-5">
                        <div className="w-12 d-flex justify-content-between">
                            <h4>Rooms</h4>
                            <h3>
                                <button 
                                    className="btn btn-primary"
                                    onClick={this.openCreateRoomModal}
                                >
                                    Create room
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
                                        {(this.state.user?.role == ADMIN_ROLE) && <TableCell><b>Controls</b></TableCell>}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.rooms.length && this.state.rooms.map((room: any) => {
                                        return this.getTableRow(room);
                                    })}

                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
                <CreateRoom 
                    isOpen={this.state.isCreateRoomModalOpened} 
                    type="modal" 
                    closeCreateRoomModal={this.closeCreateRoomModal}
                    addNewRoomItem={this.addNewCompanyTableItem} 
                />
                <View
                    type="room"
                    currentItem={this.state.currentItem as TComponentProps}
                    isOpen={this.state.isViewRoomModalOpened}
                    closeModal={this.closeViewRoomModal}
                />
                <Edit
                    type="room"
                    currentItem={this.state.currentItem as TComponentProps}
                    isOpen={this.state.isEditRoomModalOpened}
                    editCurrentItem={this.editCurrentItem}
                    closeModal={this.closeEditRoomModal}
                />
                <Delete
                    onDeleteClicked={this.onDeleteModalClicked}
                    closeModal={this.closeDeleteRoomModal}
                    isOpen={this.state.isDeleteRoomModalOpened}
                    text={this.state.deleteItemText}
                />
            </div>
        )
    }

    getTableRow = (room: IRoom) => {
        return (
            <TableRow>
                <TableCell>{room.id}</TableCell>
                <TableCell>{room.name}</TableCell>
                <TableCell>{room.company_id}</TableCell>
                <TableCell>
                    {this.state.user?.role == ADMIN_ROLE && (
                        <>
                            <a 
                                role="button"
                                onClick={() => this.onViewClicked(room)}
                            >
                                <GrView />
                            </a>
                            <a
                                role="button"
                            >
                                <CiEdit onClick={() => this.onEditClicked(room)}/>
                            </a>
                            <MdDelete size={'22pt'} onClick={() => this.onDeleteClicked(room)}/>
                        </>
                    )
                }
                </TableCell>
            </TableRow>
        )
    }

    loadRooms = async() => {
        let rooms = await RoomsAPI.getItems();
        this.setState({ rooms: rooms as TRooms}); 
    }

    getLoggedIn = async() => {
        let user = await Login.getLoggedIn();
        if(user)
            this.setState({ user: user as TUser });
    }

   addNewCompanyTableItem = (newItem: IRoom) => {
        this.setState({ rooms: [...this.state.rooms, newItem] });
    }

    // Update card info on edit, without refresh
    editCurrentItem = (newItemData: IRoom) => {
        const items = this.state.rooms;
        const updatedItems = items.map((item: IRoom) => {
            if(item.id == newItemData.id) 
                return newItemData;
            else return item;
        });
        this.setState({ rooms: updatedItems });
    }

    onViewClicked = (item: IRoom) => {
        this.setState({ currentItem: item });
        this.openViewRoomModal();
    }

    onEditClicked = (item: IRoom) => {
        this.setState({ currentItem: item });
        this.openEditRoomModal();
    }

    onDeleteClicked = (item: IRoom) => {
        this.setState({ currentItem: item });
        this.setState({ deleteItemText: `Do you wanna delete room: <b>${item.name}</b> ?` });
        this.openDeleteRoomModal();
    }

    onDeleteModalClicked = async() => {
        const currentItem = this.state.currentItem;
        if(currentItem && currentItem.id) {
            const res = await RoomsAPI.deleteRoom(currentItem.id);
            if(res && res.success) {
                const newItems: TRooms = this.state.rooms.filter((item: IRoom, index: number) => item.id != currentItem.id);
                this.setState({ rooms: newItems });
                this.closeDeleteRoomModal();
                showToast.success('Table deleted successfully');
            }else {
                showToast.error('There\'s problem deleting room. Try again later');
            }
        }else {
            showToast.error('There\'s problem deleting room. Try again later');
        }
    }

    openCreateRoomModal = () => {
        this.setState({ isCreateRoomModalOpened: true });
    }

    openViewRoomModal = () => {
        this.setState({ isViewRoomModalOpened: true });
    }
    
    openEditRoomModal = () => {
        this.setState({ isEditRoomModalOpened: true });
    }

    openDeleteRoomModal = () => {
        this.setState({ isDeleteRoomModalOpened: true });
    }

    closeCreateRoomModal = () => {
        this.setState({ isCreateRoomModalOpened: false });
    }

    closeViewRoomModal = () => {
        this.setState({ currentItem: {} as IRoom });
        this.setState({ isViewRoomModalOpened: false });
    }

    closeEditRoomModal = () => {
        this.setState({ currentItem: {} as IRoom });
        this.setState({ isEditRoomModalOpened: false })
    }

    closeDeleteRoomModal = () => {
        this.setState({ currentItem: {} as IRoom });
        this.setState({ isDeleteRoomModalOpened: false })
    }
    
}

const mapStateToProps = (state: RootState) => {
    return {
        animationRefreshKey: state.app.animationRefreshKey
    }
}

export default connect(mapStateToProps) (Rooms);