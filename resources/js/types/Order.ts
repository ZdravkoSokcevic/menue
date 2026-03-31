import TUser from "./TUser";

export interface Order
{
    slug: string;
    waiter_id: TUser,
    order_received_at: string;
    order_processed_at: string;
    prep_time: string;
    // TODO: status can be enum
    status: string; 

}

export type Orders = Array<Order>;

export interface OrderItem
{
    order_id: string;
    menu_id: string;
    portion_id: string;
    quantity: string;
    // TODO: status can be enum
    status: string;
    prep_time: string;
}

export type OrderItems = Array<OrderItem>;

