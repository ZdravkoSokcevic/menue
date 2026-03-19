import { TMenu } from "@/types/Menu";
import { ICompanyTable } from "@/types/TCompanyTables";
import React from "react";
interface IProps {
    currentItem: ICompanyTable
}
interface IState {}

class ViewCompanyTable extends React.Component<IProps, IState>
{
    constructor(props: IProps) {
        super(props);
    }

    render(): React.ReactNode {
        let item = this.props.currentItem;
        console.log(item);
        return(
            <div className="d-flex flex-column">
                <div className="col-md-12">
                    <h1>Table overview</h1>

                </div>
                <div className="col-md-12 d-flex p-2 pt-4 border-top">
                    <br />

                    <div> 
                        <h3>Name: {this.props.currentItem.name}</h3>    
                    </div>
                </div>

                <div className="col-md-12 d-flex p-2" >
                    <h3>Qr code: {this.props.currentItem.code?.code}</h3>
                </div>

                <div className="col-md-12 d-flex p-2" >
                <img src={"/storage/"+this.props.currentItem.code?.qr_code} alt="" />
                </div>
            </div>
        )
    }
}

export default ViewCompanyTable;