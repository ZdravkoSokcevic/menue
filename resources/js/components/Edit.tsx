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
import EditCompany from "./companies/EditCompany";
import { TCompany } from "@/types/TCompanies";
import EditCompanyTable from "./tables/EditCompanyTable";
import { ICompanyTable } from "@/types/TCompanyTables";
import EditAllergen from "./allergen/EditAllergen";
import { IAllergen } from "@/types/Allergen";
import EditIngridient from "./ingridient/EditIngridient";
import { IIngridient } from "@/types/Ingridient";
import EditExtra from "./extra/EditExtra";
import { IExtra } from "@/types/Extra";
import { IPreference } from "@/types/Preference";
import EditPreference from "./preferences/EditPreference";
import EditDiscount from "./ciscount/EditDiscount";
import { IDiscount } from "@/types/Discount";
import EditCombo from './combos/EditCombo';
import { ICombo } from "@types/Combo";

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
                <ModalOrPage 
                    isOpen={this.props.isOpen as boolean} 
                    closeModal={this.closeModal}
                    type={`edit-form ${this.props.type}` }
                >
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
                    {this.props.type == 'company' && <EditCompany
                        currentItem={this.props.currentItem as TCompany}
                        closeModal={this.closeModal}
                        editCurrentItem={this.props.editCurrentItem as Function}
                    /> }
                    {this.props.type == 'table' && <EditCompanyTable
                        currentItem={this.props.currentItem as ICompanyTable}
                        closeModal={this.closeModal}
                        editCurrentItem={this.props.editCurrentItem as Function}
                    />}
                    {this.props.type == 'allergen' && <EditAllergen 
                        currentItem={this.props.currentItem as IAllergen}
                        closeModal={this.closeModal}
                        editCurrentItem={this.props.editCurrentItem as Function}
                    />}

                    {this.props.type == 'ingridient' && <EditIngridient 
                        currentItem={this.props.currentItem as IIngridient}
                        closeModal={this.closeModal}
                        editCurrentItem={this.props.editCurrentItem as Function}
                    />}

                    {this.props.type == 'extra' && <EditExtra 
                        currentItem={this.props.currentItem as IExtra}
                        closeModal={this.closeModal}
                        editCurrentItem={this.props.editCurrentItem as Function}
                    />}

                    {this.props.type == 'preference' && <EditPreference 
                        currentItem={this.props.currentItem as IPreference}
                        closeModal={this.closeModal}
                        editCurrentItem={this.props.editCurrentItem as Function}
                    />}
                    {this.props.type == 'discount' && <EditDiscount 
                        type="modal"
                        currentItem={this.props.currentItem as IDiscount}
                        closeModal={this.closeModal}
                        editCurrentItem={this.props.editCurrentItem as Function}
                    />}
                    {this.props.type == 'combo' && <EditCombo 
                        type="modal"
                        currentItem={this.props.currentItem as ICombo}
                        closeModal={this.closeModal}
                        editCurrentItem={this.props.editCurrentItem as Function}
                    />}
                </ModalOrPage>
            </>
        )
    }
}

export default withRouter(Edit);