import { TMenu } from "@/types/Menu";
import { IOrder, OrderItem } from "@/types/Order";
import React from "react";
interface IProps {
    currentItem: IOrder
}
interface IState {}

class ViewOrder extends React.Component<IProps, IState>
{
    constructor(props: IProps) {
        super(props);
    }

    render(): React.ReactNode {
        return(
            <div className="d-flex flex-column">
                <div className="col-md-12">
                    <h1>{this.props.currentItem.slug}</h1>

                </div>
                <div className="col-md-12 d-flex">
                    <br />
                    <div className="col-md-6 border-end p-2">
                    <p>{this.props.currentItem.slug}</p>
                    </div>
                    <div className="col-md-6 p-2">
                        <br />
                        <div className="col-12 text-right">
                            <p><small>License:</small>{this.props.currentItem.status}</p>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ViewOrder;