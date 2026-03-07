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
                className={"form-modal"}
                contentLabel="Example"
            >
                <h2>Delete item</h2>
                <button className="close-btn" onClick={() => this.closeModal()}>x</button>
                <div className="content">
                    <h5 dangerouslySetInnerHTML={{__html: this.props.text as TrustedHTML}}></h5>
                </div>
                <div className="controls" style={{fontSize: '15pt'}} onClick={this.closeModal}>
                    <button>Cancel</button>
                    &nbsp;
                    <button className="text-danger" onClick={() => this.props.onDeleteClicked()}>
                        Delete
                    </button>
                </div>
            </Modal>
        )
    }
}

export default withRouter(Delete);