import React, { ReactNode } from "react";
import { Table, TableBody, TableRow, TableHead, TableContainer, TableCell } from "@mui/material";
import Navigation from "../admin/Navigation";
import { CiCirclePlus } from "react-icons/ci"
import { IoEye } from "react-icons/io5";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { MdDelete, MdOutlineTranslate } from "react-icons/md";



import "../../../sass/categories.scss"
import CategoriesAPI from "@/api/CategoriesAPI";
import { ICategory } from "@/types/Categories";
import View from "@/components/View";
import { TComponentProps } from "@/types/TComponentProps";
import Edit from "@/components/Edit";
import Delete from "@/components/Delete";
import CreateCategory from "@/components/categories/CreateCategory";
import { Store } from "@/reducers/Store";
import Translations from "@/components/Translations";

interface IProps {};
interface IState {
    isCreateCategoriesModalOpened: boolean;
    isViewCategoriesModalOpened: boolean;
    isEditCategoriesMOdalOpened: boolean;
    isTranslationsModalOpened: boolean;
    isDeleteModalOpened: boolean;
    categories: Array<ICategory>;
    currentItem: ICategory;
};
class Categories extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            isCreateCategoriesModalOpened: false,
            isViewCategoriesModalOpened: false,
            isEditCategoriesMOdalOpened: false,
            isTranslationsModalOpened: false,
            isDeleteModalOpened: false,
            categories: [],
            currentItem: {} as ICategory
        }
    }

    componentDidMount(): void {
        this.fetchCategories();
    }

    render(): ReactNode {
        return (
            <div className="categories-page page" key={Math.random()}>
                {/* <Navigation /> */}

                <div className="main-content p-5 container">
                    {/* <div className="p-5"> */}
                        <div className="w-12 d-flex justify-content-between">
                            <h4>Categories</h4>
                            {/* <h3>{'Exchange <- ->'}</h3> */}
                        </div>

                        {/* MAIN CONTAINER */}
                        <div className="col-12 mt-5 main-container row">


                            {/* MAIN CONTAINER ITEMS */}
                            {this.state.categories.map((item: ICategory, index) => {
                                let picPath: String = item.picture as String;
                                const picFullPath = (picPath) ? "url('/storage/" + picPath.replaceAll('\'', '') + "')" : '';
                                return <div 
                                    className={'m-2 placeholder-4-3 col-3 rounded-dotted-div menu-item-container position-relative item-container'}
                                    style={{backgroundImage: picFullPath ? picFullPath : ''}}
                                    key={index}
                                        >
                                    {/* Dark gradient */}
                                    <div className="card-overlay"></div>
                                    {/* INDICATES WEATHER ITEM IS NEW */}
                                    {item.new && <div className="ribbon ribbon-primary new">NEW</div>}
                                    <div className="item-info category-info">
                                        <div className="card-actions">
                                            <p className="hover-description">{item.name}</p> 
                                            <div className="card-actions-wrapper">
                                                <MdOutlineTranslate onClick={() => this.onTranslationClicked(item)} className="text-primary"/>
                                                <IoEye onClick={() => this.onViewClicked(item)} className="text-info"/>
                                                <HiMiniPencilSquare onClick={() => this.onEditClicked(item)} className="text-warning"/>
                                                <MdDelete onClick={() => this.onDeleteClicked(item)} className="text-danger"/>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Title */}
                                    <div className="card-title-wrapper">
                                        <span className="card-title">
                                            {item.name}
                                        </span>
                                    </div>
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
                <CreateCategory 
                    isOpen={this.state.isCreateCategoriesModalOpened} 
                    type="modal" 
                    closeCreateCategoryModal={this.closeCreateCategoryModal}
                    addNewCategoryItem={this.addNewItem} 
                />
                <View 
                    isOpen={this.state.isViewCategoriesModalOpened} 
                    type="category" 
                    closeModal={this.closeViewCategoryModal} 
                    currentItem={this.state.currentItem as TComponentProps} 
                />
                <Edit 
                    isOpen={this.state.isEditCategoriesMOdalOpened} 
                    type="category" 
                    closeModal={this.closeEditCategoryModal} 
                    currentItem={this.state.currentItem as TComponentProps } 
                    editCurrentItem={this.editCurrentItem}
                /> 
                <Delete 
                    isOpen={this.state.isDeleteModalOpened} 
                    text={`Do you realy want to delete category <b>${this.state.currentItem.name}</b>?`} 
                    closeModal={this.closeDeleteCategoryModal}
                    onDeleteClicked={this.onDeleteModalClicked}
                />
                <Translations
                    type="category"
                    isOpen={this.state.isTranslationsModalOpened}
                    currentItem={this.state.currentItem}
                    closeModal={this.closeCategoryTranslationsModal}
                    editTranslationItem={this.editTranslationItem}
                />
            </div>

        )
    }

    fetchCategories = async() => {
        const items = await CategoriesAPI.getItems();
        if(items) {
            this.setState({ categories: items });
        }
    }

    addNewItem = (newItem: ICategory) => {
        this.setState({ categories: [...this.state.categories, newItem] });
    }

    // Update card info on edit, without refresh
    editCurrentItem = (newItemData: ICategory) => {
        const items = this.state.categories;
        const updatedItems = items.map((item: ICategory) => {
            if(item.id == newItemData.id) 
                return newItemData;
            else return item;
        });
        this.setState({ categories: updatedItems });
    }

    onViewClicked = (item: ICategory) => {
        this.setState({ currentItem: item });
        this.openViewModal();
    }

    onEditClicked = (item: ICategory) => {
        this.setState({ currentItem: item });
        this.openEditCategoryModal();
    }

    onDeleteClicked = (item: ICategory) => {
        this.setState({ currentItem: item });
        this.openDeleteCategoryModal();
    }

    onTranslationClicked = (item: ICategory) => {
        this.setState({ currentItem: item });
        this.openCategoryTranslationsModal();
    }

    onDeleteModalClicked = async() => {
        const currentItem = this.state.currentItem;
        if(currentItem && currentItem.id) {
            const res = await CategoriesAPI.deleteCategory(currentItem.id);
            if(res && res.success) {
                const newItems: Array<ICategory> = this.state.categories.filter((item: ICategory, index: number) => item.id != currentItem.id);
                this.setState({ categories: newItems });
                this.closeDeleteCategoryModal();
            }else {
                alert('Cannot delete category!');
            }
        }else {
            alert('Cannot delete category');
        }
    }

    openCreateModal = () => {
        this.setState({ isCreateCategoriesModalOpened: true });
    }

    openViewModal = () => {
        this.setState({ isViewCategoriesModalOpened: true });
    }
    
    openEditCategoryModal = () => {
        this.setState({ isEditCategoriesMOdalOpened: true });
    }

    openDeleteCategoryModal = () => {
        this.setState({ isDeleteModalOpened: true });
    }

    closeCreateCategoryModal = () => {
        this.setState({ isCreateCategoriesModalOpened: false });
    }

    openCategoryTranslationsModal = () => {
        this.setState({ isTranslationsModalOpened: true });
    }

    closeViewCategoryModal = () => {
        this.setState({ currentItem: {} as ICategory });
        this.setState({ isViewCategoriesModalOpened: false });
    }

    closeEditCategoryModal = () => {
        this.setState({ currentItem: {} as ICategory });
        this.setState({ isEditCategoriesMOdalOpened: false })
    }

    closeDeleteCategoryModal = () => {
        this.setState({ currentItem: {} as ICategory });
        this.setState({ isDeleteModalOpened: false })
    }

    closeCategoryTranslationsModal = () => {
        this.setState({ currentItem: {} as ICategory })
        this.setState({ isTranslationsModalOpened: false });
    }

    editTranslationItem = (item: ICategory) => {
        let stat = this.state.categories;
        let newState = stat.map((category: ICategory) => {
            if(item.id == category.id) {
                category.translations = item.translations;
            }
            return category;
        })

        this.setState({ categories: newState });
    }
}


export default Categories;