import { TMenu } from "@/types/Menu";
import { TCompany } from "@/types/TCompanies";
import React from "react";
interface IProps {
    currentItem: TCompany
}
interface IState {}

class ViewCompany extends React.Component<IProps, IState>
{
    constructor(props: IProps) {
        super(props);
    }

    render(): React.ReactNode {
        return(
            <div className="d-flex flex-column">
                <div className="col-md-12">
                    <h1>{this.props.currentItem.name}</h1>

                </div>
                <div className="col-md-12 d-flex">
                    <br />
                    <div className="col-md-6 border-end p-2">
                    <p>{this.props.currentItem.description}</p>

                    <div
                    style={{
                        border: "2px dashed #ccc",
                        padding: "20px",
                        textAlign: "center",
                        borderRadius: "10px",
                        backgroundColor: "#f0f8ff",
                        height: '200px',
                        width: '200px',
                        backgroundImage: this.props.currentItem.logo ? `url(/storage/${this.props.currentItem.logo})` : '',
                        backgroundSize: 'cover',
                        position: 'relative'
                    }}
                    ></div>
                    </div>
                    <div className="col-md-6 p-2">
                        <br />
                        <div className="col-12 text-right">
                            <p><small>License:</small>{this.props.currentItem.license?.name}</p>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ViewCompany;