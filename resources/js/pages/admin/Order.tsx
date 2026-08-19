import React, { ReactNode } from "react";
import { connect } from "react-redux";
import Navigation from "../admin/Navigation";
import TUser from "@/types/TUser";
import { IoArrowRedoCircle } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { GrCheckmark, GrView } from "react-icons/gr";
import { Link, Navigate } from "react-router-dom";
import {
    Box,
    Chip,
    Collapse,
    Paper,
    Skeleton,
    Table, 
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import "@/../sass/order.scss"
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
import { MdAccessTime, MdDelete } from "react-icons/md";
import { IOrder, OrderItem, TOrders } from "@/types/Order";
import OrderAPI from "@/api/OrderAPI";
import "react-time-ago/locale/en"
import ReactTimeAgo from "react-time-ago"
import { ADMIN_ROLE } from "@/types/Roles";
import { showToast } from "@/helpers/Toast";

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
    // all|new|preparing|ready|paid
    filter: string;
    loading: boolean;
    apiCallInterval: number;
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
             // all|new|preparing|ready|paid
            filter: 'all',
            loading: false,
            apiCallInterval: 0
        }
    }

    // PREVENTION LOADING ADMIN PAGE WHEN LOGGED IN
    componentDidMount(): void {
        // TODO: Init loading not working
        this.setState({ loading: true });
        this.loadAndFilterOrders();
        this.getLoggedIn();
    }

    componentWillUnmount(): void {
        // TODO: Interval not clearing itself
        // clear periodical api call
        // clearInterval(this.state.apiCallInterval);
        // console.log('Interval cleared');
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

                        <div className="d-flex flex-wrap gap-2 mb-4">

                            <button
                                className="btn btn-sm btn-primary rounded-pill"
                                onClick={() => {
                                    this.setState({ filter: 'all' })
                                    this.filterAll();
                                }}
                            >
                                {this.state.filter == 'all' && <GrCheckmark />}
                                All
                            </button>

                            <button
                                className="btn btn-sm btn-outline-primary rounded-pill"
                                onClick={() => {
                                    this.filterNew();
                                    this.setState({ filter: 'new' })}
                                }
                            >
                                {this.state.filter == 'new' && <GrCheckmark />}
                                New Orders
                            </button>

                            <button
                                className="btn btn-sm btn-outline-warning rounded-pill"
                                onClick={() => {
                                    this.setState({ filter: 'preparing' })
                                    this.filterPreparing();
                                }}
                            >
                                {this.state.filter == 'preparing' && <GrCheckmark />}
                                Preparing
                            </button>

                            <button
                                className="btn btn-sm btn-outline-success rounded-pill"
                                onClick={() => {
                                    this.filterReady();
                                    this.setState({ filter: 'ready' })}
                                }
                            >
                                {this.state.filter == 'ready' && <GrCheckmark />}
                                Ready
                            </button>

                            <button
                                className="btn btn-sm btn-outline-dark rounded-pill"
                                onClick={() => {
                                    this.filterPaid();
                                    this.setState({ filter: 'paid' })}
                                }
                            >
                                {this.state.filter == 'paid' && <GrCheckmark />}
                                Paid
                            </button>

                        </div>
                        {this.state.loading && this.OrdersTableLoader()}
                        {!this.state.loading && <TableContainer>
                            <Table className="data-table order-table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell className="w-20">Status:</TableCell>
                                        <TableCell className="w-10"><b>Id</b></TableCell>
                                        <TableCell className="w-25"><b>Table</b></TableCell>
                                        <TableCell className="w-25"><b>Number of items:</b></TableCell>
                                        <TableCell className="w-20"><b>Ago:</b></TableCell>
                                        {(this.state.user?.role == ADMIN_ROLE) && <TableCell className="text-end"><b>Controls</b></TableCell>}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.orders.length && this.state.orders.map((order: any) => {
                                        return this.getOrderRow(order);
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        }   
                    </div>
                </div>
                <View
                    type="order"
                    currentItem={this.state.currentItem as TComponentProps}
                    isOpen={this.state.isViewOrderModalOpened}
                    closeModal={this.closeViewOrderModal}
                />
                <Delete 
                    isOpen={this.state.isDeleteOrderModalOpened} 
                    text={`Do you realy want to delete order from table: <b>${(this.state.currentItem.table) ? this.state.currentItem.table.name : ''}</b>?`} 
                    closeModal={this.closeDeleteOrderModal}
                    onDeleteClicked={this.onDeleteModalClicked}
                />
            </div>
        )
    }

    getOrderRow = (order: IOrder) => {
        return (
            <>
                <TableRow onClick={() => this.setSelectedRow(order)} className={(this.state.selectedRow.id == order.id) ? 'bg-primary bg-opacity-10' : ''} key={order.id}>
                    <TableCell>
                        {this.getStatusBadge(parseInt(order.status))}
                    </TableCell>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{(order && order.table) ? order.table.name : ''}</TableCell>
                    {/* <TableCell>{order.slug}</TableCell> */}
                    <TableCell>{this.getOrderItemsLength(order)}</TableCell>
                    <TableCell><ReactTimeAgo date={order.created_at} locale="en"/></TableCell>
                    <TableCell className="text-end">
                        {this.state.user?.role == ADMIN_ROLE && (
                            <>
                                {(order.status == '0') ? 
                                    <button 
                                        className="btn btn-primary"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            this.changeOrderStatus(order, '1')}
                                        }
                                    >
                                        Start preparing
                                    </button> : ''}
                                {(order.status == '1') ? 
                                            <button 
                                                className="btn btn-warning"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    this.changeOrderStatus(order, '2')}
                                                }
                                            >
                                                Mark as ready
                                            </button> : ''}
                              {(order.status == '2') ? 
                                            <button 
                                                className="btn btn-success"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    this.changeOrderStatus(order, '3')}
                                                }
                                            >
                                                Mark as paid
                                            </button> : ''}
                                &nbsp;
                                <button 
                                    className="btn btn-danger"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        this.onDeleteClicked(order)}
                                    }
                                >
                                    <MdDelete size={'14pt'} />   
                                    Delete
                                </button>
                            </>
                        ) 
                    }
                    </TableCell>
                </TableRow>
                {order.id == this.state.selectedRow.id && <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={order.id == this.state.selectedRow.id} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                                <div className="d-flex flex-column gap-3 py-2">

                                    {order.items.map((item: OrderItem) => {

                                        if (!item.menu) return null;

                                        return (
                                            <div
                                                key={item.id}
                                                className="border rounded-4 p-3 bg-light-subtle shadow-sm"
                                            >

                                                <div className="d-flex gap-3">

                                                    {/* IMAGE */}
                                                    <div
                                                        style={{
                                                            width: 72,
                                                            height: 72,
                                                            borderRadius: 12,
                                                            backgroundImage: `url(/storage/${item.menu.picture})`,
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: 'center',
                                                            flexShrink: 0
                                                        }}
                                                    />

                                                    {/* CONTENT */}
                                                    <div className="flex-grow-1">

                                                        {/* NAME */}
                                                        <div className="d-flex justify-content-between align-items-start">
                                                            <h6 className="fw-bold mb-1">
                                                                {item.menu.name}
                                                            </h6>
                                                        </div>

                                                        {/* EXTRAS */}
                                                        {!!item.menu.extras?.length && (
                                                            <div className="mb-2">
                                                                <small className="text-muted d-block mb-1">
                                                                    Extras
                                                                </small>

                                                                <div className="d-flex flex-wrap gap-1">
                                                                    {item.menu.extras.map((extra) => (
                                                                        <span
                                                                            key={extra.id}
                                                                            className="badge text-bg-primary rounded-pill"
                                                                        >
                                                                            {extra.name}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* PREFERENCES */}
                                                        {!!item.menu.preferences?.length && (
                                                            <div className="mb-2">
                                                                <small className="text-muted d-block mb-1">
                                                                    Preferences
                                                                </small>

                                                                <div className="d-flex flex-wrap gap-1">
                                                                    {item.menu.preferences.map((pref) => (
                                                                        <span
                                                                            key={pref.id}
                                                                            className="badge text-bg-secondary rounded-pill"
                                                                        >
                                                                            {pref.name}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* NOTE */}
                                                        {!!item.note && (
                                                            <div className="mt-2 rounded-3 border bg-white p-2">
                                                                <small className="text-muted d-block">
                                                                    Special note
                                                                </small>

                                                                <div className="small">
                                                                    {item.note}
                                                                </div>
                                                            </div>
                                                        )}

                                                    </div>

                                                </div>

                                            </div>
                                        );
                                    })}

                                </div>
                            </Box>
                        </Collapse>
                        </TableCell>
                    </TableRow>}
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

    getStatusBadge = (status: number) => {

        switch(status) {

            case 0:
                return (
                    <Chip
                        label="New Order"
                        color="info"
                        size="small"
                        variant="outlined"
                    />
                );

            case 1:
                return (
                    <Chip
                        label="Preparing"
                        color="warning"
                        size="small"
                        variant="outlined"
                    />
                );

            case 2:
                return (
                    <Chip
                        label="Ready"
                        color="success"
                        size="small"
                        variant="outlined"
                    />
                );

            case 3:
                return (
                    <Chip
                        label="Paid"
                        color="default"
                        size="small"
                        variant="outlined"
                    />
                );

            default:
                return null;
        }
    }

    OrdersTableLoader = () => {
        return (
            <TableContainer component={Paper}>
                <Table>

                    <TableHead>
                        <TableRow>
                            <TableCell>Status</TableCell>
                            <TableCell>Id</TableCell>
                            <TableCell>Table</TableCell>
                            <TableCell>Num of items:</TableCell>
                            <TableCell>Ago</TableCell>
                            <TableCell>Controls</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>

                        {[...Array(5)].map((_, index) => (
                            <TableRow key={index}>

                                <TableCell>
                                    <Skeleton
                                        variant="rounded"
                                        width={110}
                                        height={32}
                                    />
                                </TableCell>

                                <TableCell>
                                    <Skeleton width={40} />
                                </TableCell>

                                <TableCell>
                                    <Skeleton width={80} />
                                </TableCell>

                                <TableCell>
                                    <Skeleton width={90} />
                                </TableCell>

                                <TableCell>
                                    <Skeleton width={100} />
                                </TableCell>

                                <TableCell>
                                    <div className="d-flex gap-2">
                                        <Skeleton
                                            variant="rounded"
                                            width={120}
                                            height={36}
                                        />

                                        <Skeleton
                                            variant="rounded"
                                            width={90}
                                            height={36}
                                        />
                                    </div>
                                </TableCell>

                            </TableRow>
                        ))}

                    </TableBody>

                </Table>
            </TableContainer>
        );
    };

    filterOrders = async() => {

        if(this.state.filter == 'all')
            this.setState({ orders: this.state.orders });
        else if(this.state.filter == 'new') {
            let filtered: TOrders = [];
            this.state.orders.map((order: IOrder) => {
                if(order.status == '0')
                    filtered.push(order);
            })
            this.setState({ orders: filtered });
        }
    }

    loadAndFilterOrders = async() => {
        this.loadOrders()
        // let interv = setInterval(() => {
            // TODO: Interval not clearing on unmount
            // Run this every 5s to update existing array
        //     this.loadOrders()
        // }, 60000);

        // this.setState({ apiCallInterval: interv });
        // console.log(location.pathname);
        // if(location.pathname != '/orders')
            // clearInterval(interv);
            // .then(() => { this.filterOrders() });
    }

    loadOrders = async() => {
        // let orders = await CompaniesAPI.getCompanies();
        this.setState({ loading: true });
        let orders = await OrderAPI.getItems(this.state.page, this.state.filter);
        // second condition is used 
        // if(orders && (orders.length != this.state.orders.length) && this.state.filter == 'all') {
        if(orders) {
            // debugger;
            this.setState({ orders: orders }); 
        }
        this.setState({ loading: false });
    }

    filterAll = async() => {
        return this.filter('all');
    }

    filterNew = async() => {
        return this.filter('0');
    }

    filterPreparing = async() => {
        return this.filter('1');
    }

    filterReady = async() => {
        return this.filter('2');
    }

    filterPaid = async() => {
        return this.filter('3');
    }

    filter = async(criteria: string) => {
        this.setState({ loading: true });
        let filtered: TOrders = [];
        let orders = await OrderAPI.getItems(this.state.page, criteria);
        if(orders) {
            this.setState({ orders: orders });
            this.setState({ loading: false }); 
        }

        return Promise.resolve();

    }

    changeOrderStatus = async(order: IOrder, status: string) => {
        // TODO: filter is somehow damaged here
        let changed = await OrderAPI.changeStatus(order.id, status);
        if(changed && changed.success) {
            const newOrders: TOrders = this.state.orders.map((stateOrder: IOrder) => {
                stateOrder.id === order.id ? order.status = status : order;
                return stateOrder;
            })

            this.setState({ orders: newOrders });
        }
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
            const res = await OrderAPI.deleteOrder(currentItem.id);
            if(res && res.success) {
                const newItems: Array<IOrder> = this.state.orders.filter((item: IOrder, index: number) => item.id != currentItem.id);
                this.setState({ orders: newItems });
                this.closeDeleteOrderModal();
                showToast.error('Order deleted successfully');
            }else {
                showToast.error('There\'s problem deleting order. Try again later');
            }
        }else {
            showToast.error('There\'s problem deleting order. Try again later');
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