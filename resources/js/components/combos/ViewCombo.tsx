import { ICombo, IComboItem } from "@/types/Combo";
import "../../../sass/view-combo.scss"

import React from "react";
import { IPrice } from "@/types/Prices";
interface IProps {
    currentItem: ICombo;
    closeModal: Function;
}
interface IState {}

class ViewCombo extends React.Component<IProps, IState>
{
    constructor(props: IProps) {
        super(props);
    }

    render(): React.ReactNode {
        return(
            <div className="d-flex flex-column form-page">
                <div className="modal-header">
                    <h2>View combo</h2>
                    <button className="close-btn" onClick={() => this.props.closeModal()}>&times;</button>
                </div>
                <div className="col-md-12 d-flex modal-form-content">
                     <div className="modal-scroll-body">
                        <div className="row g-3">
                            <h2></h2>
                        </div>
                        <div className="row g-3">
                           
                            {/* CARD ITEM */}
                            {this.props.currentItem.items!.map((comboItem: IComboItem, index: number) => (
                                <>
                                    <div className="col-12" key={Math.random()}>
                                        <div className="cart-item-card">
                                            {/* ITEM PICTURE */}
                                            <img
                                                src={'/storage/' + comboItem.menu?.picture as string}
                                                className="cart-item-image"
                                                alt={comboItem.menu?.name}
                                            />
                                            {/* NAME */}
                                            <div className="cart-item-info">
                                                <h6>{comboItem.menu?.name}</h6>

                                                <span className="portion">
                                                    {comboItem.portion?.name}
                                                </span>
                                            </div>

                                            {/* TODO: add overall price for combo, for that portion without discount */}
                                            <div className="cart-item-price">
                                            e5.99
                                            </div>
                                        </div>
                                    </div>

                                    {/* PLUS SIGN */}
                                    {index < (this.props.currentItem.items!.length -1) && <div className="col-12" key={Math.random()}>
                                        <div className="cart-item-card">
                                            {/* ITEM PICTURE */}
                                            {/* NAME */}
                                            <div className="cart-item-info text-center">
                                                <h1>+</h1>
                                            </div>
                                        </div>
                                    </div>
                                    }
                                 </>
                            ))}

                            <div className="combo-summary">

                                <div className="summary-row">
                                    <span>Total Quantity</span>
                                    <strong>{this.props.currentItem.items![0].quantity}</strong>
                                </div>

                                <div className="summary-row total">
                                    <span>Total Price</span>
                                    <strong>{(this.props.currentItem.price as IPrice).price}</strong>
                                </div>

                            </div>
                            
                            {/* TRANSLATIONS
                            <div className="mt-4">
                                
                            </div> */}
                        </div>
                     </div>
                </div>
            </div>
        )
    }
}

export default ViewCombo;