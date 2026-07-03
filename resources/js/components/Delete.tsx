import React from "react";
import { Store } from "@/reducers/Store";
import ModalOrPage from "./ModalOrPage";
import { useNavigate } from "react-router-dom";
import { TComponentProps } from "@/types/TComponentProps";
import { withRouter } from "@/routes/withRouter";
import { WithRouterProps } from "@/types/WithRouterProps";
import { TMenu } from "@/types/Menu";
import EditMenu from "./menu/EditMenu";
import Modal from "react-modal"

interface IProps {
    isOpen?: boolean;
    closeModal?: Function;
    onDeleteClicked: Function;
    // // Menu View, or Companies View
    // // Values `menu` or `companies`
    // page: string;
    text?: string;
}
interface IState {}

// Convert to universal View component
class Delete extends React.Component<IProps & WithRouterProps, IState>
{
    constructor(props: IProps) {
        super(props as IProps & WithRouterProps);
    }

    closeModal = () => {
        if(this.props.closeModal)
            this.props.closeModal();
    }

    render(): React.ReactNode {
        return(
            <Modal
                isOpen={this.props.isOpen as boolean} 
                // isOpen={true}
                onRequestClose={() => this.closeModal()}
                overlayClassName="modal-backdrop-blur"
                className="form-modal"
                contentLabel="Delete item"
            >
                <div className="modal-header">
                    <h2>Delete item</h2>
                    <button className="close-btn" onClick={() => this.closeModal()}>&times;</button>
                </div>

                <div className="modal-form-content">
                     <div className="modal-scroll-body">
                        <div className="container-fluid p-0 mb-5">
                            <div className="row g-4">
                                <h5 dangerouslySetInnerHTML={{__html: this.props.text as TrustedHTML}}></h5>
                            </div>
                        </div>
                     </div>
                </div>
                {/* FIXED STICKY FOOTER */}
                <div className="modal-actions-footer" onClick={this.closeModal}>
                    <button 
                        className="submit btn btn-primary btn-submit-save" 
                        onClick={() => this.props.onDeleteClicked()}
                    >
                        Delete
                    </button>
                </div>
            </Modal>
        )
    }
}

export default withRouter(Delete);