import React from "react";
import { Store } from "@/reducers/Store";
import ModalOrPage from "./ModalOrPage";
import { useNavigate } from "react-router-dom";
import { TComponentProps } from "@/types/TComponentProps";
import { withRouter } from "@/routes/withRouter";
import { WithRouterProps } from "@/types/WithRouterProps";
import { TMenu } from "@/types/Menu";
import EditMenu from "./menu/EditMenu";
import EditCategory from "./categories/EditCategory";
import { ICategory } from "@/types/Categories";

interface IProps {
    isOpen?: boolean;
    closeModal?: Function;
    type: string;
    // // Menu View, or Companies View
    // // Values `menu` or `companies`
    // page: string;
    currentItem: TComponentProps;
    editCurrentItem?: Function;
}
interface IState {}

// Convert to universal View component
class Edit extends React.Component<IProps & WithRouterProps, IState>
{
    constructor(props: IProps) {
        super(props as IProps & WithRouterProps);
    }
    
    shouldPutModal = (): boolean => {
        let shouldOpenModal = Store.getState().app.settings.useModals;
        // False for now
        return shouldOpenModal;
    }

    closeModal = () => {
        if(this.props.closeModal)
            this.props.closeModal();
    }

    render(): React.ReactNode {
        const useModal = this.shouldPutModal();
        if(!useModal)
            this.props.navigate(`/${this.props.type}/edit/${this.props.currentItem.id}`, {
                state: {
                    item: this.props.currentItem
                }
            })
            // return (<><Navigate to={`/admin/menue/view/${this.props.currentItem.id}`} item={this.props.currentItem}/></>)
        else return(
            <>
                <ModalOrPage isOpen={this.props.isOpen as boolean} closeModal={this.closeModal}>
                    {this.props.type == 'menu' && <EditMenu 
                        currentItem={this.props.currentItem as TMenu} 
                        closeModal={this.closeModal}
                        editCurrentItem={this.props.editCurrentItem as Function}
                    />}
                    {this.props.type == 'category' && <EditCategory
                        currentItem={this.props.currentItem as ICategory}
                        closeModal={this.closeModal}
                        editCurrentItem={this.props.editCurrentItem as Function}
                    />}
                </ModalOrPage>
            </>
        )
    }
}

export default withRouter(Edit);