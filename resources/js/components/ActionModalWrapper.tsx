import React, { PropsWithChildren } from "react";
interface IProps {
    Children: any;
};
interface IState {};

const ActionModalWrapper: React.FC<React.PropsWithChildren<IProps>> = ({ Children }: IProps) => {
    return (
        <React.Fragment>
            <Children />
        </React.Fragment>
    )
}