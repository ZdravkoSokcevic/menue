import React, { ReactNode } from "react";
import { Table, TableBody, TableRow, TableHead, TableContainer, TableCell } from "@mui/material";
import Navigation from "../admin/Navigation";
import { CiCirclePlus } from "react-icons/ci"
import { IoEye } from "react-icons/io5";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { MdDelete, MdOutlineTranslate } from "react-icons/md";



import "../../../sass/allergens.scss"
import View from "@/components/View";
import { TComponentProps } from "@/types/TComponentProps";
import Edit from "@/components/Edit";
import Delete from "@/components/Delete";
import CreateAllergen from "@/components/allergen/CreateAllergen";
import { Store } from "@/reducers/Store";
import { IAllergen, TAllergens } from "@/types/Allergen";
import AllergensAPI from "@/api/AllergensAPI";
import Translations from "@/components/Translations";

interface IProps {};
interface IState {
    isCreateAllergenModalOpened: boolean;
    isViewAllergenModalOpened: boolean;
    isEditAllergenModalOpened: boolean;
    isDeleteModalOpened: boolean;
    isTranslationsModalOpened: boolean;
    allergens: TAllergens;
    currentItem: IAllergen;
};
class Allergens extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            isCreateAllergenModalOpened: false,
            isViewAllergenModalOpened: false,
            isEditAllergenModalOpened: false,
            isDeleteModalOpened: false,
            isTranslationsModalOpened: false,
            allergens: [],
            currentItem: {} as IAllergen
        }
    }

    componentDidMount(): void {
        this.fetchAllergens();
    }

    render(): ReactNode {
        return (
            <div className="allergens-page page" key={Math.random()}>
                {/* <Navigation /> */}

                <div className="main-content p-5">
                    {/* <div className="p-5"> */}
                        <div className="w-12 d-flex justify-content-between">
                            <h4>Allergens</h4>
                            <h3>{'Exchange <- ->'}</h3>
                        </div>

                        {/* MAIN CONTAINER */}
                        <div className="col-12 mt-5 main-container">


                            {/* MAIN CONTAINER ITEMS */}
                            {this.state.allergens.map((item: IAllergen, index) => {
                                let picPath: String = item.icon as String;
                                const picFullPath = (picPath) ? "url('/storage/" + picPath.replaceAll('\'', '') + "')" : '';
                                return <div 
                                            className="rounded-dotted-div m-2" 
                                            style={{backgroundImage: picFullPath ? picFullPath : ''}}
                                            key={Math.random()}
                                        >
                                    <span className="name">{item.name}</span> 
                                    <div className="allergen-info">
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
                <CreateAllergen 
                    isOpen={this.state.isCreateAllergenModalOpened} 
                    type="modal" 
                    closeCreateAllergenModal={this.closeCreateAllergenModal}
                    addNewAllergenItem={this.addNewItem} 
                />
                <View 
                    isOpen={this.state.isViewAllergenModalOpened} 
                    type="allergen" 
                    closeModal={this.closeViewAllergenModal} 
                    currentItem={this.state.currentItem as TComponentProps} 
                />
                <Edit 
                    isOpen={this.state.isEditAllergenModalOpened} 
                    type="allergen" 
                    closeModal={this.closeEditAllergenModal} 
                    currentItem={this.state.currentItem as TComponentProps } 
                    editCurrentItem={this.editCurrentItem}
                /> 
                <Delete 
                    isOpen={this.state.isDeleteModalOpened} 
                    text={`Do you realy want to delete allergen <b>${this.state.currentItem.name}</b>?`} 
                    closeModal={this.closeDeleteAllergenModal}
                    onDeleteClicked={this.onDeleteModalClicked}
                />
               <Translations
                    type="allergen"
                    isOpen={this.state.isTranslationsModalOpened}
                    currentItem={this.state.currentItem}
                    closeModal={this.closeAllergenTranslationsModal}
                    editTranslationItem={this.editTranslationItem}
                />
            </div>

        )
    }

    fetchAllergens = async() => {
        const items = await AllergensAPI.getItems();
        if(items) {
            this.setState({ allergens: items });
        }
    }

    addNewItem = (newItem: IAllergen) => {
        this.setState({ allergens: [...this.state.allergens, newItem] });
    }

    // Update card info on edit, without refresh
    editCurrentItem = (newItemData: IAllergen) => {
        const items = this.state.allergens;
        const updatedItems = items.map((item: IAllergen) => {
            if(item.id == newItemData.id) 
                return newItemData;
            else return item;
        });
        this.setState({ allergens: updatedItems });
    }

    onViewClicked = (item: IAllergen) => {
        this.setState({ currentItem: item });
        this.openViewModal();
    }

    onEditClicked = (item: IAllergen) => {
        this.setState({ currentItem: item });
        this.openEditAllergenModal();
    }

    onDeleteClicked = (item: IAllergen) => {
        this.setState({ currentItem: item });
        this.openDeleteAllergenModal();
    }

    onTranslationClicked = (item: IAllergen) => {
        this.setState({ currentItem: item });
        this.openAllergenTranslationsModal();
    }

    onDeleteModalClicked = async() => {
        const currentItem = this.state.currentItem;
        if(currentItem && currentItem.id) {
            const res = await AllergensAPI.deleteAllergen(currentItem.id);
            if(res && res.success) {
                const newItems: Array<IAllergen> = this.state.allergens.filter((item: IAllergen, index: number) => item.id != currentItem.id);
                this.setState({ allergens: newItems });
                this.closeDeleteAllergenModal();
            }else {
                alert('Cannot delete allergen!');
            }
        }else {
            alert('Cannot delete allergen');
        }
    }

    openCreateModal = () => {
        this.setState({ isCreateAllergenModalOpened: true });
    }

    openViewModal = () => {
        this.setState({ isViewAllergenModalOpened: true });
    }
    
    openEditAllergenModal = () => {
        this.setState({ isEditAllergenModalOpened: true });
    }

    openAllergenTranslationsModal = () => {
        this.setState({ isTranslationsModalOpened: true });
    }

    openDeleteAllergenModal = () => {
        this.setState({ isDeleteModalOpened: true });
    }

    closeCreateAllergenModal = () => {
        this.setState({ isCreateAllergenModalOpened: false });
    }

    closeViewAllergenModal = () => {
        this.setState({ currentItem: {} as IAllergen });
        this.setState({ isViewAllergenModalOpened: false });
    }

    closeEditAllergenModal = () => {
        this.setState({ currentItem: {} as IAllergen });
        this.setState({ isEditAllergenModalOpened: false })
    }

    closeDeleteAllergenModal = () => {
        this.setState({ currentItem: {} as IAllergen });
        this.setState({ isDeleteModalOpened: false })
    }

   closeAllergenTranslationsModal = () => {
        this.setState({ currentItem: {} as IAllergen });
        this.setState({ isTranslationsModalOpened: false });
    }

    editTranslationItem = (item: IAllergen) => {
        let stat = this.state.allergens;
        let newState = stat.map((allergen: IAllergen) => {
            if(item.id == allergen.id) {
                allergen.translations = item.translations;
            }
            return allergen;
        })

        this.setState({ allergens: newState });
    }
}


export default Allergens;