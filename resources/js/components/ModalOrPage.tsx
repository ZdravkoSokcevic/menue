import { RootState, Store } from "@/reducers/Store";
import React, { PropsWithChildren } from "react";
import { useSelector } from "react-redux";
import Modal from "react-modal";
interface IProps {
    children?: React.ReactNode | string;
    isOpen: boolean;
    closeModal: Function;
};
interface IState {};

const ModalOrPage: React.FC<IProps> = ({ children, isOpen, closeModal }: IProps) => {
    const useModal = useSelector((state: RootState) => state.app.settings.useModals);

    const renderWithModal = (): React.ReactNode => {
        return (
            <Modal
                isOpen={isOpen as boolean} 
                onRequestClose={() => closeModal()}
                className={`form-modal ${Math.random()}`}
                style={{}}
                contentLabel="Example"
            >
                <div className="form-page">
                    {/* <h2>Create </h2> */}
                    <button className="close-btn" onClick={() => closeModal()}>x</button>
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