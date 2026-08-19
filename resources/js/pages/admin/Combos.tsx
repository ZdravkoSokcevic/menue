import React, { ReactNode } from "react";
import { CiCirclePlus } from "react-icons/ci"
import { IoEye } from "react-icons/io5";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";

import "../../../sass/list-card.scss"
import "../../../sass/combos.scss"
import View from "@/components/View";
import { TComponentProps } from "@/types/TComponentProps";
import Edit from "@/components/Edit";
import Delete from "@/components/Delete";
import { ICombo, IComboItem, TCombos } from "@/types/Combo";
import CreateCombo from "@/components/combos/CreateCombo";
import CombosAPI from "@/api/CombosAPI";
import { Swiper, SwiperSlide } from 'swiper/react';
import { showToast } from "@/helpers/Toast";

interface IProps {};
interface IState {
    isCreateComboModalOpened: boolean;
    isViewComboModalOpened: boolean;
    isEditComboModalOpened: boolean;
    isDeleteModalOpened: boolean;
    comboItems: TCombos;
    currentItem: ICombo;
};
class Combos extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            isCreateComboModalOpened: false,
            isViewComboModalOpened: false,
            isEditComboModalOpened: false,
            isDeleteModalOpened: false,
            comboItems: [],
            currentItem: {} as ICombo
        }
    }

    componentDidMount(): void {
        this.fetchComboItems();
    }

    getItemName(item: ICombo) {
        let str = '';
        if(item.items)
        {
            item.items.map((comboItem: IComboItem, index) => {
                str += ' ' + comboItem.menu?.name;
                if(index < item.items!.length -1)
                    str += ' +';
            })
        }
        return str;
    } 

    render(): ReactNode {
        return (
            <div className="combo-page page" key={Math.random()}>
                {/* <Navigation /> */}

                <div className="main-content p-5 container">
                    {/* <div className="p-5"> */}
                        <div className="w-12 d-flex justify-content-between">
                            <h4>Combos</h4>
                            {/* <h3>{'Exchange <- ->'}</h3> */}
                        </div>

                        {/* MAIN CONTAINER */}
                        <div className="col-12 mt-5 main-container row">


                            {/* MAIN CONTAINER ITEMS */}
                            {this.state.comboItems.map((comboItem: ICombo) => {
                                // let picPath: String = (comboItem.items) ? comboItem.items[0].menu?.picture as String : '';
                                // const picFullPath = (picPath) ? "url('/storage/" + picPath.replaceAll('\'', '') + "')" : '';
                                return <div 
                                            className={'m-2 placeholder-4-3 col-3 rounded-dotted-div combo-item-container position-relative item-container position-relative overflow-hidden'}
                                            // style={{backgroundImage: picFullPath ? picFullPath : ''}}
                                            key={comboItem.id}
                                        >
                                            <div className="card-media-box">
                                                {/* Dark gradient */}
                                                <div className="card-overlay"></div>
                                                {/* {JSON.stringify(comboItem.items![0].menu)} */}
                                                {/* IMAGES */}
                                                <div className="image-grid">
                                                    {comboItem.items?.map((item: IComboItem) => (
                                                        <div key={item.menu?.id} className="photo-card">
                                                        <img 
                                                            src={'/storage/'+item.menu?.picture as string} 
                                                            alt={item.menu?.name} 
                                                            className="single-photo"
                                                            loading="lazy" // Optimizes performance
                                                        />
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* INDICATES WEATHER ITEM IS NEW */}
                                                {/* Ribbon */}
                                                {comboItem.new && (
                                                    <div className="ribbon ribbon-primary new">
                                                        NEW
                                                    </div>
                                                )}
                                                {/* <span className="name">{item.menu?.name}</span>  */}

                                                {/* Hover actions */}
                                                <div className="item-info allergen-info">
                                                    <div className="card-actions-wrapper">
                                                        {/* <MdOutlineTranslate onClick={() => this.onTranslationClicked(item)} className="text-primary"/> */}
                                                        <IoEye onClick={() => this.onViewClicked(comboItem)} className="text-info"/>
                                                        <HiMiniPencilSquare onClick={() => this.onEditClicked(comboItem)} className="text-warning"/>
                                                        <MdDelete onClick={() => this.onDeleteClicked(comboItem)} className="text-danger" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Title */}
                                            <div className="card-title-wrapper">
                                                <span className="card-title">
                                                    {this.getItemName(comboItem)}
                                                </span>
                                            </div>

                                            {/* <div className="item-info allergen-info">
                                                <span className="name name-hover">{item.menu?.name}</span> 
                                                <div className="d-flex flex-direction-column card-actions">
                                                    <MdOutlineTranslate onClick={() => this.onTranslationClicked(item)}/>
                                                    <IoEye onClick={() => this.onViewClicked(item)}/>
                                                    <HiMiniPencilSquare onClick={() => this.onEditClicked(item)}/>
                                                    <MdDelete onClick={() => this.onDeleteClicked(item)}/>
                                                </div>
                                            </div> */}
                                            
                                </div>
                            })}

                            {/* TEMPLATE CONTAINER ITEM */}
                            <div 
                                className="rounded-dotted-div m-2 col-3 add-template placeholder-4-3 item-container"
                                onClick={this.openCreateModal} // Making the entire container clickable is much better UX
                            >
                                <div className="add-content-wrapper">
                                    <CiCirclePlus className="add-icon" />
                                </div>
                                
                                {/* Bottom placeholder matching the style of the food card titles */}
                                <div className="card-title-wrapper">
                                    <span className="card-title-placeholder"></span>
                                </div>
                            </div>

                        </div>
                        
                    </div>
                {/* </div> */}
                <CreateCombo 
                    isOpen={this.state.isCreateComboModalOpened} 
                    type="modal" 
                    closeCreateDiscountModal={this.closeCreateComboModal}
                    addNewDiscountItem={this.addNewComboItem} 
                />
                <View 
                    isOpen={this.state.isViewComboModalOpened} 
                    type="combo" 
                    closeModal={this.closeViewComboModal} 
                    currentItem={this.state.currentItem as TComponentProps} 
                />
                <Edit 
                    isOpen={this.state.isEditComboModalOpened} 
                    type="combo" 
                    closeModal={this.closeEditComboModal} 
                    currentItem={this.state.currentItem as TComponentProps } 
                    editCurrentItem={this.editCurrentItem}
                /> 
                <Delete 
                    isOpen={this.state.isDeleteModalOpened} 
                    text={`Do you realy want to delete combo item?`} 
                    closeModal={this.closeDeleteComboModal}
                    onDeleteClicked={this.onDeleteModalClicked}
                />
            </div>

        )
    }

    fetchComboItems = async() => {
        const items = await CombosAPI.getItems();
        // debugger;
        if(items) {
            this.setState({ comboItems: items });
        }
    }

    addNewComboItem = (newItem: ICombo) => {
        this.setState({ comboItems: [...this.state.comboItems, newItem] });
    }

    // Update card info on edit, without refresh
    editCurrentItem = (newItemData: ICombo) => {
        const items = this.state.comboItems;
        const updatedItems = items.map((item: ICombo) => {
            if(item.id == newItemData.id) 
                return newItemData;
            else return item;
        });
        this.setState({ comboItems: updatedItems });
    }

    onViewClicked = (item: ICombo) => {
        this.setState({ currentItem: item });
        this.openViewModal();
    }

    onEditClicked = (item: ICombo) => {
        this.setState({ currentItem: item });
        this.openEditComboModal();
    }

    onDeleteClicked = (item: ICombo) => {
        this.setState({ currentItem: item });
        this.openDeleteComboModal();
    }

    onDeleteModalClicked = async() => {
        const currentItem = this.state.currentItem;
        if(currentItem && currentItem.id) {
            const res = await CombosAPI.deleteCombo(currentItem.id);
            if(res && res.success) {
                const newItems: TCombos = this.state.comboItems.filter((item: ICombo, index: number) => item.id != currentItem.id);
                this.setState({ comboItems: newItems });
                this.closeDeleteComboModal();
                showToast.success('Combo deleted successfully');
            }else {
                showToast.error('There\'s problem deleting combo. Try again later');
            }
        }else {
            showToast.error('There\'s problem deleting combo. Try again later');
        }
    }

    openCreateModal = () => {
        this.setState({ isCreateComboModalOpened: true });
    }

    openViewModal = () => {
        this.setState({ isViewComboModalOpened: true });
    }
    
    openEditComboModal = () => {
        this.setState({ isEditComboModalOpened: true });
    }

    openDeleteComboModal = () => {
        this.setState({ isDeleteModalOpened: true });
    }

    closeCreateComboModal = () => {
        this.setState({ isCreateComboModalOpened: false });
    }

    closeViewComboModal = () => {
        this.setState({ currentItem: {} as ICombo });
        this.setState({ isViewComboModalOpened: false });
    }

    closeEditComboModal = () => {
        this.setState({ currentItem: {} as ICombo });
        this.setState({ isEditComboModalOpened: false })
    }

    closeDeleteComboModal = () => {
        this.setState({ currentItem: {} as ICombo });
        this.setState({ isDeleteModalOpened: false })
    }
}


export default Combos;