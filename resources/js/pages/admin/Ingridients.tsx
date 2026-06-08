import React, { ReactNode } from "react";
import { Table, TableBody, TableRow, TableHead, TableContainer, TableCell } from "@mui/material";
import Navigation from "../admin/Navigation";
import { CiCirclePlus } from "react-icons/ci"
import { IoEye } from "react-icons/io5";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { MdDelete, MdOutlineTranslate } from "react-icons/md";
import { LuCookingPot } from "react-icons/lu";



import "../../../sass/ingridients.scss"
import View from "@/components/View";
import { TComponentProps } from "@/types/TComponentProps";
import Edit from "@/components/Edit";
import Delete from "@/components/Delete";
import CreateAllergen from "@/components/allergen/CreateAllergen";
import AllergensAPI from "@/api/AllergensAPI";
import { IIngridient, TIngridients } from "@/types/Ingridient";
import CreateIngridient from "@/components/ingridient/CreateIngridient";
import IngridientsAPI from "@/api/IngridientsAPI";
import Translations from "@/components/Translations";

interface IProps {};
interface IState {
    isCreateIngridientModalOpened: boolean;
    isViewIngridientModalOpened: boolean;
    isEditIngridientModalOpened: boolean;
    isTranslationsModalOpened: boolean;
    isDeleteModalOpened: boolean;
    ingridients: TIngridients;
    currentItem: IIngridient;
};
class Ingridients extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            isCreateIngridientModalOpened: false,
            isViewIngridientModalOpened: false,
            isEditIngridientModalOpened: false,
            isDeleteModalOpened: false,
            isTranslationsModalOpened: false,
            ingridients: [],
            currentItem: {} as IIngridient
        }
    }

    componentDidMount(): void {
        this.fetchIngridients();
    }

    render(): ReactNode {
        return (
            <div className="ingridients-page page" key={Math.random()}>
                {/* <Navigation /> */}

                <div className="main-content p-5">
                    {/* <div className="p-5"> */}
                        <div className="w-12 d-flex justify-content-between">
                            <h4><LuCookingPot /> Ingridients</h4>
                        </div>

                        {/* MAIN CONTAINER */}
                        <div className="col-12 mt-5 main-container">


                            {/* MAIN CONTAINER ITEMS */}
                            {this.state.ingridients.map((item: IIngridient, index) => {
                                return <div 
                                            className="rounded-dotted-div card shadow-sm border-0 card-soft" 
                                            key={Math.random()}
                                        >
                                    {/* <span className="name">{item.name}</span>  */}
                                    <div className="card-body">
                                        <h5 className="card-text text-muted mt-4">{<LuCookingPot style={{fontSize: '55pt'}}/>}</h5>
                                        <h5 className="card-title name">{item.name}</h5>
                                    </div>
                                    <div className="ingridient-info">
                                        <span>{item.name}</span> 
                                        <div className="d-flex flex-direction-column card-actions">
                                            <MdOutlineTranslate onClick={() => this.onTranslationClicked(item)}/>
                                            <IoEye onClick={() => this.onViewClicked(item)}/>
                                            <HiMiniPencilSquare onClick={() => this.onEditClicked(item)}/>
                                            <MdDelete onClick={() => this.onDeleteClicked(item)}/>
                                        </div>
                                    </div>
                                </div>
                            })}

                            {/* TEMPLATE CONTAINER ITEM */}
                            <div className="rounded-dotted-div m-2 add-template">
                                
                                <div className="temp-overlay">
                                    <CiCirclePlus onClick={this.openCreateModal}/>
                                </div>
                                    <div className="name-demo"></div>
                            </div>

                        </div>
                        
                    </div>
                {/* </div> */}
                <CreateIngridient 
                    isOpen={this.state.isCreateIngridientModalOpened} 
                    type="modal" 
                    closeCreateIngridientModal={this.closeCreateIngridientModal}
                    addNewIngridientItem={this.addNewItem} 
                />
                <View 
                    isOpen={this.state.isViewIngridientModalOpened} 
                    type="allergen" 
                    closeModal={this.closeViewIngridientModal} 
                    currentItem={this.state.currentItem as TComponentProps} 
                />
                <Edit 
                    isOpen={this.state.isEditIngridientModalOpened} 
                    type="ingridient" 
                    closeModal={this.closeEditIngridientModal} 
                    currentItem={this.state.currentItem as TComponentProps } 
                    editCurrentItem={this.editCurrentItem}
                /> 
                <Delete 
                    isOpen={this.state.isDeleteModalOpened} 
                    text={`Do you realy want to delete ingridient <b>${this.state.currentItem.name}</b>?`} 
                    closeModal={this.closeDeleteIngridientModal}
                    onDeleteClicked={this.onDeleteModalClicked}
                />
               <Translations
                    type="ingridient"
                    isOpen={this.state.isTranslationsModalOpened}
                    currentItem={this.state.currentItem}
                    closeModal={this.closeIngridientTranslationsModal}
                    editTranslationItem={this.editTranslationItem}
                />
            </div>

        )
    }

    fetchIngridients = async() => {
        const items = await IngridientsAPI.getItems();
        if(items) {
            this.setState({ ingridients: items });
        }
    }

    addNewItem = (newItem: IIngridient) => {
        this.setState({ ingridients: [...this.state.ingridients, newItem] });
    }

    // Update card info on edit, without refresh
    editCurrentItem = (newItemData: IIngridient) => {
        const items = this.state.ingridients;
        const updatedItems = items.map((item: IIngridient) => {
            if(item.id == newItemData.id) 
                return newItemData;
            else return item;
        });
        this.setState({ ingridients: updatedItems });
    }

    onViewClicked = (item: IIngridient) => {
        this.setState({ currentItem: item });
        this.openViewModal();
    }

    onEditClicked = (item: IIngridient) => {
        this.setState({ currentItem: item });
        this.openEditIngridientModal();
    }

    onDeleteClicked = (item: IIngridient) => {
        this.setState({ currentItem: item });
        this.openDeleteIngridientModal();
    }

    onTranslationClicked = (item: IIngridient) => {
        this.setState({ currentItem: item });
        this.openIngridientTranslationModal();
    }

    onDeleteModalClicked = async() => {
        const currentItem = this.state.currentItem;
        if(currentItem && currentItem.id) {
            const res = await IngridientsAPI.deleteIngridient(currentItem.id);
            if(res && res.success) {
                const newItems: Array<IIngridient> = this.state.ingridients.filter((item: IIngridient, index: number) => item.id != currentItem.id);
                this.setState({ ingridients: newItems });
                this.closeDeleteIngridientModal();
            }else {
                alert('Cannot delete allergen!');
            }
        }else {
            alert('Cannot delete allergen');
        }
    }

    openCreateModal = () => {
        this.setState({ isCreateIngridientModalOpened: true });
    }

    openViewModal = () => {
        this.setState({ isViewIngridientModalOpened: true });
    }
    
    openEditIngridientModal = () => {
        this.setState({ isEditIngridientModalOpened: true });
    }

    openDeleteIngridientModal = () => {
        this.setState({ isDeleteModalOpened: true });
    }

    openIngridientTranslationModal = () => {
        this.setState({ isTranslationsModalOpened: true });
    }

    closeCreateIngridientModal = () => {
        this.setState({ isCreateIngridientModalOpened: false });
    }

    closeViewIngridientModal = () => {
        this.setState({ currentItem: {} as IIngridient });
        this.setState({ isViewIngridientModalOpened: false });
    }

    closeEditIngridientModal = () => {
        this.setState({ currentItem: {} as IIngridient });
        this.setState({ isEditIngridientModalOpened: false })
    }

    closeDeleteIngridientModal = () => {
        this.setState({ currentItem: {} as IIngridient });
        this.setState({ isDeleteModalOpened: false })
    }

    closeIngridientTranslationsModal = () => {
        this.setState({ currentItem: {} as IIngridient });
        this.setState({ isTranslationsModalOpened: false })
    }

    editTranslationItem = (item: IIngridient) => {
        let stat = this.state.ingridients;
        let newState = stat.map((ingridient: IIngridient) => {
            if(item.id == ingridient.id) {
                ingridient.translations = item.translations;
            }
            return ingridient;
        })

        this.setState({ ingridients: newState });
    }
}


export default Ingridients;