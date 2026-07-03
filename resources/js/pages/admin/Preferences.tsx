import React, { ReactNode } from "react";
import { Table, TableBody, TableRow, TableHead, TableContainer, TableCell } from "@mui/material";



import "../../../sass/allergens.scss"
import View from "@/components/View";
import { TComponentProps } from "@/types/TComponentProps";
import Edit from "@/components/Edit";
import Delete from "@/components/Delete";
import TUser from "@/types/TUser";
import Login from "@/api/Login";
import { IPreference, TPreferences } from "@/types/Preference";
import { GrView } from "react-icons/gr";
import { CiEdit } from "react-icons/ci";
import { MdDelete, MdOutlineRoomPreferences, MdOutlineTranslate } from "react-icons/md";
import CreatePreference from "@/components/preferences/CreatePreference";
import PreferencesAPI from "@/api/PreferencesAPI";
import { GoPlus } from "react-icons/go";
import Translations from "@/components/Translations";

interface IProps {};
interface IState {
    user: TUser | null;
    isCreatePreferencesModalOpened: boolean;
    isViewPreferencesModalOpened: boolean;
    isEditPreferencesModalOpened: boolean;
    isTranslationsModalOpened: boolean;
    isDeleteModalOpened: boolean;
    preferences: TPreferences;
    currentItem: IPreference;
};
class Preferences extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            isCreatePreferencesModalOpened: false,
            isViewPreferencesModalOpened: false,
            isEditPreferencesModalOpened: false,
            isDeleteModalOpened: false,
            isTranslationsModalOpened: false,
            preferences: [],
            currentItem: {} as IPreference,
            user: {} as TUser,
        }
    }

    getLoggedIn = async() => {
        let user = await Login.getLoggedIn();
        if(user)
            this.setState({ user: user as TUser });
    }

    componentDidMount(): void {
        this.fetchExtras();
        this.getLoggedIn();
    }

    render(): ReactNode {
        return (
            <div className="companies-page page" key={Math.random() as number}>
                {/* <Navigation /> */}

                <div className="main-content">
                    <div className="p-5">
                        <div className="w-12 d-flex justify-content-between">
                            <h4><MdOutlineRoomPreferences /> Preferences</h4>
                            <h3>
                                <button 
                                    className="btn btn-primary"
                                    onClick={this.openCreateModal}
                                >
                                    <GoPlus /> Create preference
                                </button>
                            </h3>
                        </div>
                        <TableContainer>
                            <Table className="data-table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><b>Id</b></TableCell>
                                        <TableCell><b>Name</b></TableCell>
                                        <TableCell><b>Description</b></TableCell>
                                        {(this.state.user?.role == 'admin') && <TableCell><b>Controls</b></TableCell>}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.preferences.length && this.state.preferences.map((preference: IPreference) => {
                                        // return this.getExtraRow(company);
                                        return (
                                            <TableRow>
                                                <TableCell>{preference.id}</TableCell>
                                                <TableCell>{preference.name}</TableCell>
                                                <TableCell>{preference.description}</TableCell>
                                                <TableCell>
                                                    {this.state.user?.role == 'admin' && (
                                                        <>
                                                            <a 
                                                                role="button"
                                                                onClick={() => this.onTranslationClicked(preference)}
                                                                >
                                                                <MdOutlineTranslate />
                                                            </a>
                                                            <a 
                                                                role="button"
                                                                onClick={() => this.onViewClicked(preference)}
                                                            >
                                                                <GrView />
                                                            </a>
                                                            <a
                                                                role="button"
                                                            >
                                                                <CiEdit onClick={() => this.onEditClicked(preference)}/>
                                                            </a>
                                                            <MdDelete size={'22pt'} onClick={() => this.onDeleteClicked(preference)}/>
                                                        </>
                                                    )
                                                }
                                                </TableCell>
                                            </TableRow> 
                                        )
                                    })}

                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
                <CreatePreference
                    isOpen={this.state.isCreatePreferencesModalOpened} 
                    type="modal" 
                    closeCreatePreferenceModal={this.closeCreatePreferencesModal}
                    addNewPreferenceItem={this.addNewItem} 
                />
                <View
                    type="preference"
                    currentItem={this.state.currentItem as TComponentProps}
                    isOpen={this.state.isViewPreferencesModalOpened}
                    closeModal={this.closeViewPreferencesModal}
                />
                <Edit
                    type="preference"
                    currentItem={this.state.currentItem as TComponentProps}
                    isOpen={this.state.isEditPreferencesModalOpened}
                    closeModal={this.closeEditPreferencesModal}
                    editCurrentItem={this.editCurrentItem}
                />
                <Delete
                    onDeleteClicked={this.onDeleteModalClicked}
                    text={`Do you realy want to delete peference: <b>${this.state.currentItem.name}</b>?`} 
                    closeModal={this.closeDeletePreferencesModal}
                    isOpen={this.state.isDeleteModalOpened}
                />
               <Translations
                    type="preference"
                    isOpen={this.state.isTranslationsModalOpened}
                    currentItem={this.state.currentItem}
                    closeModal={this.closePreferencesTranslationModal}
                    editTranslationItem={this.editTranslationItem}
                />
            </div>

        )
    }

    fetchExtras = async() => {
        const items = await PreferencesAPI.getItems();
        if(items) {
            this.setState({ preferences: items });
        }
    }

    addNewItem = (newItem: IPreference) => {
        this.setState({ preferences: [...this.state.preferences, newItem] });
    }

    // Update card info on edit, without refresh
    editCurrentItem = (newItemData: IPreference) => {
        const items: TPreferences = this.state.preferences;
        const updatedItems = items.map((item: IPreference) => {
            if(item.id == newItemData.id) 
                return newItemData;
            else return item;
        });
        this.setState({ preferences: updatedItems });
    }

    onViewClicked = (item: IPreference) => {
        this.setState({ currentItem: item });
        this.openViewModal();
    }

    onEditClicked = (item: IPreference) => {
        this.setState({ currentItem: item });
        this.openEditPreferencesModal();
    }

    onDeleteClicked = (item: IPreference) => {
        this.setState({ currentItem: item });
        this.openDeletePreferencesModal();
    }

   onTranslationClicked = (item: IPreference) => {
        this.setState({ currentItem: item });
        this.openIngridientTranslationsModal();
    }

    onDeleteModalClicked = async() => {
        const currentItem = this.state.currentItem;
        if(currentItem && currentItem.id) {
            const res = await PreferencesAPI.deletePreference(currentItem.id);
            if(res && res.success) {
                const newItems: Array<IPreference> = this.state.preferences.filter((item: IPreference, index: number) => item.id != currentItem.id);
                this.setState({ preferences: newItems });
                this.closeDeletePreferencesModal();
            }else {
                alert('Cannot delete Preference!');
            }
        }else {
            alert('Cannot delete preference');
        }
    }

    openCreateModal = () => {
        this.setState({ isCreatePreferencesModalOpened: true });
    }

    openViewModal = () => {
        this.setState({ isViewPreferencesModalOpened: true });
    }
    
    openEditPreferencesModal = () => {
        this.setState({ isEditPreferencesModalOpened: true });
    }

    openDeletePreferencesModal = () => {
        this.setState({ isDeleteModalOpened: true });
    }

    openIngridientTranslationsModal = () => {
        this.setState({ isTranslationsModalOpened: true });
    }

    closeCreatePreferencesModal = () => {
        this.setState({ isCreatePreferencesModalOpened: false });
    }

    closeViewPreferencesModal = () => {
        this.setState({ currentItem: {} as IPreference });
        this.setState({ isViewPreferencesModalOpened: false });
    }

    closeEditPreferencesModal = () => {
        this.setState({ currentItem: {} as IPreference });
        this.setState({ isEditPreferencesModalOpened: false })
    }

    closeDeletePreferencesModal = () => {
        this.setState({ currentItem: {} as IPreference });
        this.setState({ isDeleteModalOpened: false })
    }

    closePreferencesTranslationModal = () => {
        this.setState({ currentItem: {} as IPreference });
        this.setState({ isTranslationsModalOpened: false })
    }

    editTranslationItem = (item: IPreference) => {
        let stat = this.state.preferences;
        let newState = stat.map((preference: IPreference) => {
            if(item.id == preference.id) {
                preference.translations = item.translations;
            }
            return preference;
        })

        this.setState({ preferences: newState });
    }
}


export default Preferences;