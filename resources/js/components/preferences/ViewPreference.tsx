import { IPreference } from "@/types/Preference";
import React from "react";
interface IProps {
    currentItem: IPreference
}
interface IState {}

class ViewPreference extends React.Component<IProps, IState>
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
                    <h5>Price: &nbsp; {this.props.currentItem.description} </h5>
                </div>
            </div>
        )
    }
}

export default ViewPreference;