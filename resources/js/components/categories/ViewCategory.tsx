import { TMenu } from "@/types/Menu";
import React from "react";
interface IProps {
    currentItem: TMenu
}
interface IState {}

class ViewCategory extends React.Component<IProps, IState>
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
                <div className="col-md-12 d-flex p-2">
                    <br />

                    <div
                        style={{
                            border: "2px dashed #ccc",
                            padding: "20px",
                            textAlign: "center",
                            borderRadius: "10px",
                            backgroundColor: "#f0f8ff",
                            height: '600px',
                            width: '400px',
                            backgroundImage: this.props.currentItem.picture ? `url(/storage/${this.props.currentItem.picture})` : '',
                            backgroundSize: 'cover',
                            position: 'relative'
                        }}
                    ></div>
                </div>
            </div>
        )
    }
}

export default ViewCategory;