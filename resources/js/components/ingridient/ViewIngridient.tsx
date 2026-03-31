import { IAllergen } from "@/types/Allergen";
import { IIngridient } from "@/types/Ingridient";
import React from "react";
interface IProps {
    currentItem: IIngridient
}
interface IState {}

class ViewIngridient extends React.Component<IProps, IState>
{
    constructor(props: IProps) {
        super(props);
    }

    render(): React.ReactNode {
        return(
            <div className="d-flex flex-column">
                <div className="col-md-12">
                    <h1>{this.props.currentItem.name}</h1>

                </div>
                <div className="col-md-12">
                    <h5 className="text">Allergens</h5>

                </div>
                <div className="col-md-12 d-flex p-2">
                    {/* LIST ALLERGENS */}
                    {this.props.currentItem.allergens?.map((allergen: IAllergen) => (
                        <>{allergen.name}</>
                    ))}
                </div>
            </div>
        )
    }
}

export default ViewIngridient;