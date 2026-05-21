import React, { ReactNode } from "react";
import { connect } from "react-redux";
import Navigation from "../admin/Navigation";
import TUser from "@/types/TUser";
import { IoArrowRedoCircle } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { GrView } from "react-icons/gr";
import { Link, Navigate } from "react-router-dom";
import {
    Box,
    Collapse,
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
import { IOrder, OrderItem, TOrders } from "@/types/Order";
import OrderAPI from "@/api/OrderAPI";

interface IProps {
    animationRefreshKey?: number
};
interface IState {
    user: TUser | null;
    orders: TOrders;
    animationRefreshKey: number;
    isVisitAllowed: boolean;
    isDeleteOrderModalOpened: boolean;
    isViewOrderModalOpened: boolean;
    currentItem: IOrder;
    page: number;
    selectedRow: IOrder;
};


class Companies extends React.Component<IProps, IState>
{

    constructor(props: IProps) {
        super(props);
        this.state = {
            orders: [],
            user: {} as TUser,
            animationRefreshKey: Math.random(),
            isVisitAllowed: false,
            isViewOrderModalOpened: false,
            isDeleteOrderModalOpened: false,
            currentItem: {} as IOrder,
            page: 0,
            selectedRow: {} as IOrder,
        }
    }

    // PREVENTION LOADING ADMIN PAGE WHEN LOGGED IN
    componentDidMount(): void {
        this.loadOrders();
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
            <div className="companies-page page" >
                {/* <Navigation /> */}

                <div className="main-content" data-key={this.state.animationRefreshKey}>
                    <div className="p-5">
                        <div className="w-12 d-flex justify-content-between">
                            <h4>Orders</h4>
                        </div>
                        <TableContainer>
                            <Table className="data-table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><b>Id</b></TableCell>
                                        <TableCell><b>Slug</b></TableCell>
                                        <TableCell><b>Number of items:</b></TableCell>
                                        {(this.state.user?.role == 'admin') && <TableCell><b>Controls</b></TableCell>}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.orders.length && this.state.orders.map((order: any) => {
                                        return this.getOrderRow(order);
                                    })}

                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
                <View
                    type="order"
                    currentItem={this.state.currentItem as TComponentProps}
                    isOpen={this.state.isViewOrderModalOpened}
                    closeModal={this.closeViewOrderModal}
                />
            </div>
        )
    }

    getOrderRow = (order: IOrder) => {
        return (
            <>
                <TableRow onClick={() => this.setSelectedRow(order)}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.slug}</TableCell>
                    <TableCell>{this.getOrderItemsLength(order)}</TableCell>
                    <TableCell>
                        {this.state.user?.role == 'admin' && (
                            <>
                                
                            </>
                        )
                    }
                    </TableCell>
                </TableRow>
                {order.id == this.state.selectedRow.id && <>
                    <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={order.id == this.state.selectedRow.id} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                                {order.items.map((item: OrderItem) => {
                                    if(item.menu) {
                                        return (
                                            <>
                                                <span>{item.menu.name}</span>
                                            </>
                                        )
                                    }
                                })}
                            </Box>
                        </Collapse>
                        </TableCell>
                    </TableRow>
                </>}
            </>
        )
    }

    setSelectedRow = (order: IOrder) => {
        // debugger;
        if(order.id != this.state.selectedRow.id)
            this.setState({ selectedRow: order });
        else this.setState({ selectedRow: {} as IOrder });
    }

    getOrderItemsLength = (order: IOrder): ReactNode => {
        let orderStr = '';
        switch(order.items.length)
        {
            case 0: orderStr = 'No order items!';break;
            case 1: orderStr = '1 order Item';break;
            default: orderStr = `${order.items.length} items.`;
        }

        return <span>{orderStr}</span>;
    }

    loadOrders = async() => {
        // let orders = await CompaniesAPI.getCompanies();
        let orders = await OrderAPI.getItems(this.state.page);
        if(orders)
            this.setState({ orders: orders }); 
    }

    getLoggedIn = async() => {
        let user = await Login.getLoggedIn();
        if(user)
            this.setState({ user: user as TUser });
    }

   addNewOrderItem = (newItem: IOrder) => {
        this.setState({ orders: [...this.state.orders, newItem] });
    }

    // Update card info on edit, without refresh
    editCurrentItem = (newItemData: IOrder) => {
        const items = this.state.orders;
        const updatedItems = items.map((item: IOrder) => {
            if(item.id == newItemData.id) 
                return newItemData;
            else return item;
        });
        this.setState({ orders: updatedItems });
    }

    onViewClicked = (item: IOrder) => {
        this.setState({ currentItem: item });
        this.openViewModal();
    }

    onDeleteClicked = (item: IOrder) => {
        this.setState({ currentItem: item });
        this.openDeleteOrderModal();
    }

    onDeleteModalClicked = async() => {
        const currentItem = this.state.currentItem;
        if(currentItem && currentItem.id) {
            const res = await CompaniesAPI.deleteCompany(currentItem.id);
            if(res && res.success) {
                const newItems: Array<IOrder> = this.state.orders.filter((item: IOrder, index: number) => item.id != currentItem.id);
                this.setState({ orders: newItems });
                this.closeDeleteOrderModal();
            }else {
                alert('Cannot delete order!');
            }
        }else {
            alert('Cannot delete order');
        }
    }

    openViewModal = () => {
        this.setState({ isViewOrderModalOpened: true });
    }

    openDeleteOrderModal = () => {
        this.setState({ isDeleteOrderModalOpened: true });
    }

    closeViewOrderModal = () => {
        this.setState({ currentItem: {} as IOrder });
        this.setState({ isViewOrderModalOpened: false });
    }

    closeDeleteOrderModal = () => {
        this.setState({ currentItem: {} as IOrder });
        this.setState({ isDeleteOrderModalOpened: false })
    }
    
}

const mapStateToProps = (state: RootState) => {
    return {
        animationRefreshKey: state.app.animationRefreshKey
    }
}

export default connect(mapStateToProps) (Companies);