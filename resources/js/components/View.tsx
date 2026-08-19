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
import { IDiscount } from "@/types/Discount";
import { ICombo } from "@/types/Combo";
import ViewCombo from "./combos/ViewCombo";
import TUser from "@/types/TUser";
import ViewUser from "./users/View";

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
class View extends React.Component<IProps & WithRouterProps, IState>
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
                <ModalOrPage 
                    isOpen={this.props.isOpen as boolean} 
                    closeModal={this.closeModal}
                    page={this.props.type}
                >
                    <div className="view-page">
                        {this.props.type == 'menu' && <ViewMenu currentItem={this.props.currentItem as TMenu} closeModal={this.props.closeModal as Function}/>}
                        {this.props.type == 'category' && <ViewCategory currentItem={this.props.currentItem as TMenu} closeModal={this.props.closeModal as Function}/>}
                        {this.props.type == 'company' && <ViewCompany currentItem={this.props.currentItem as TCompany} />}
                        {this.props.type == 'table' && <ViewCompanyTable currentItem={this.props.currentItem as ICompanyTable} />}
                        {this.props.type == 'allergen' && <ViewAllergen currentItem={this.props.currentItem as IAllergen} closeModal={this.props.closeModal as Function } />}
                        {this.props.type == 'extra' && <ViewExtra currentItem={this.props.currentItem as IExtra} closeModal={this.props.closeModal as Function}/>}
                        {this.props.type == 'preference' && <ViewPreference currentItem={this.props.currentItem as IPreference} closeModal={this.props.closeModal as Function}/>}
                        {this.props.type == 'order' && <ViewOrder currentItem={this.props.currentItem as IOrder} />}
                        {/* {this.props.type == 'discount' && <ViewDiscount currentItem={this.props.currentItem as IDiscount} closeModal={this.props.closeModal as Function} />} */}
                        {this.props.type == 'combo' && <ViewCombo currentItem={this.props.currentItem as ICombo} closeModal={this.props.closeModal as Function} />}
                        {this.props.type == 'user' && <ViewUser currentUser={this.props.currentItem as TUser} closeModal={this.props.closeModal as Function} />}
                    </div>
                </ModalOrPage>
            </>
        )
    }
}

export default withRouter(View);