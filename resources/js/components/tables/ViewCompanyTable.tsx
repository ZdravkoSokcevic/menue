import AppHelper from "@/helpers/AppHelper";
import { ImageDownloadResponse } from "@/types/Media";
import { TMenu } from "@/types/Menu";
import { ICompanyTable } from "@/types/TCompanyTables";
import React from "react";
import { FaLink } from "react-icons/fa6";
import {saveAs} from 'file-saver';
interface IProps {
    currentItem: ICompanyTable;
    closeModal: Function;
}
interface IState {
    isAdminLoggedIn: boolean;
}

class ViewCompanyTable extends React.Component<IProps, IState>
{
    constructor(props: IProps) {
        super(props);
        this.state = {
            isAdminLoggedIn: false
        }
    }

    componentDidMount(): void {
        const isAdmin: boolean = AppHelper.isAdmin();
        if(isAdmin)
            this.setState({ isAdminLoggedIn: isAdmin });
    }

    async downloadQRImage()
    {
        const link = "/storage/"+this.props.currentItem.code?.qr_code + ".svg";
        saveAs(link, this.props.currentItem.name + '.svg')
    }

    closeModal() {
        this.props.closeModal()
    }

    render(): React.ReactNode {
        let item = this.props.currentItem;
        return(
            <div className="form-page">
                <div className="modal-header">
                    <h2>Table overview</h2>
                    <button className="close-btn" onClick={() => this.closeModal()}>&times;</button>
                </div>

                <div className="d-flex flex-column modal-form-content">
                    <div className="modal-scroll-body">
                        <div className="col-md-12 d-flex p-2 pt-4">
                            <br />

                            <div> 
                                <p className="h4">Name: <b>{this.props.currentItem.name}</b></p>    
                            </div>
                        </div>

                        {this.state.isAdminLoggedIn && <div className="col-md-12 d-flex p-2" >
                            <h3>
                                    Code: {this.props.currentItem.code?.code}
                            </h3>
                        </div>}

                        <div className="col-md-12 d-flex p-2" >
                            <h3>
                                <a target="_blank" href={"/shorts/" + this.props.currentItem.code?.code}>
                                    <FaLink /> Open site
                                </a>
                            </h3>
                        </div>

                        <div className="col-md-12 d-flex p-2" >
                        <img src={"/storage/"+this.props.currentItem.code?.qr_code + ".svg"} alt="alter" />
                        </div>

                        <div className="col-md-12 d-flex p-2" >
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={(e) => this.downloadQRImage()}
                            >
                                Download qr image
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ViewCompanyTable;