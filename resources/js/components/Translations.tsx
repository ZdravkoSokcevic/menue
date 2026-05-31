import React from "react";
import { Store } from "@/reducers/Store";
import ModalOrPage from "./ModalOrPage";
import { useNavigate } from "react-router-dom";
import { TComponentProps } from "@/types/TComponentProps";
import { withRouter } from "@/routes/withRouter";
import { WithRouterProps } from "@/types/WithRouterProps";
import ViewMenu from "./menu/ViewMenu";
import { TMenu } from "@/types/Menu";
import ViewCategory from "./categories/ViewCategory";
import ViewCompany from "./companies/ViewCompany";
import { TCompany } from "@/types/TCompanies";
import ViewCompanyTable from "./tables/ViewCompanyTable";
import { ICompanyTable } from "@/types/TCompanyTables";
import ViewAllergen from "./allergen/ViewAllergen";
import { IAllergen } from "@/types/Allergen";
import ViewExtra from "./extra/ViewExtra";
import { IExtra } from "@/types/Extra";
import ViewPreference from "./preferences/ViewPreference";
import { IPreference } from "@/types/Preference";
import { IOrder } from "@/types/Order";
import ViewOrder from "./order/ViewOrder";
import MenuTranslation from "./menu/MenuTranslation";

interface IProps {
    isOpen?: boolean;
    closeModal?: Function;
    type: string;
    // // Menu View, or Companies View
    // // Values `menu` or `companies`
    // page: string;
    currentItem: TComponentProps
}
interface IState {}

// Convert to universal View component
class Translations extends React.Component<IProps & WithRouterProps, IState>
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
            this.props.navigate(`/admin/${this.props.type}/view/${this.props.currentItem.id}`, {
                state: {
                    item: this.props.currentItem
                }
            })
            // return (<><Navigate to={`/admin/menue/view/${this.props.currentItem.id}`} item={this.props.currentItem}/></>)
        else return(
            <>
                <ModalOrPage isOpen={this.props.isOpen as boolean} closeModal={this.closeModal}>
                    {this.props.type == 'menu' && <MenuTranslation currentItem={this.props.currentItem as TMenu} />}
                </ModalOrPage>
            </>
        )
    }
}

export default withRouter(Translations);