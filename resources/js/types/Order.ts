import { TMenu } from "./Menu";
import TUser from "./TUser";

export interface OrderItem
{
    id: string;
    order_id: string;
    menu_id: string;
    portion_id: string;
    quantity: string;
    // TODO: status can be enum
    status: string;
    prep_time: string;
    note?: string;
    menu: TMenu;
}
export type OrderItems = Array<OrderItem>;

export interface IOrder
{
    id: string;
    slug: string;
    waiter_id: TUser,
    order_received_at: string;
    order_processed_at: string;
    prep_time: string;
    // TODO: status can be enum
    status: string; 
    items: OrderItems;
}

export type TOrders = Array<IOrder>;



