import { RootState, Store } from "@/reducers/Store";
import React, { PropsWithChildren } from "react";
import { useSelector } from "react-redux";
import Modal from "react-modal";
interface IProps {
    children?: React.ReactNode | string;
    isOpen: boolean;
    closeModal: Function;
    page?: string;
};
interface IState {};

const ModalOrPage: React.FC<IProps> = ({ children, isOpen, closeModal, page }: IProps) => {
    const useModal = useSelector((state: RootState) => state.app.settings.useModals);

    const renderWithModal = (): React.ReactNode => {
        return (
            <Modal
                isOpen={isOpen as boolean} 
                onRequestClose={() => closeModal()}
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 w-100 full-w-h"
                className={`${page} view-modal form-modal bg-white rounded-xl shadow-2xl max-w-md w-full p-6 outline-none ${Math.random()}`}
                style={{ }}
                contentLabel="Example"
            >
                <div className="form-page">
                    {/* <h2>Create </h2> */}
                    <button className="close-btn main-btn" onClick={() => closeModal()}>x</button>
                    <br />
                    {children}
                </div>
            </Modal>
        )
    }

    const renderWithoutModal = (): React.ReactNode => {
        return (
            <React.Fragment>
                {children}
            </React.Fragment>
        )
    }

    return (
        <React.Fragment>
        {useModal ? renderWithModal() : renderWithoutModal()}
        </React.Fragment>
    )
}

export default ModalOrPage;