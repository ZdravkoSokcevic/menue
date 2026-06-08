import { IAllergen } from "@/types/Allergen";
import { TMenu } from "@/types/Menu";
import { ICountry } from "@/types/TCountries";
import React from "react";
interface IProps {
    currentItem: IAllergen
}
interface IState {}

class ViewAllergen extends React.Component<IProps, IState>
{
    constructor(props: IProps) {
        super(props);
    }

   getFlag(code: any) {
    
        let flags = '';
        code.countries.map((country: ICountry) => {
            flags += country.flag as string;
            flags += ' '
        })

        return flags;
    }

    render(): React.ReactNode {
        return(
            <div className="d-flex flex-column">
                <div className="col-md-12">
                    <h1>{this.props.currentItem.name}</h1>

                </div>
                <div className="col-md-12 d-flex p-2">
                    <br />

                    <div
                        style={{
                            border: "2px dashed #ccc",
                            padding: "20px",
                            textAlign: "center",
                            borderRadius: "10px",
                            backgroundColor: "#f0f8ff",
                            height: '300px',
                            width: '300px',
                            backgroundImage: this.props.currentItem.icon ? `url(/storage/${this.props.currentItem.icon})` : '',
                            backgroundSize: 'cover',
                            position: 'relative'
                        }}
                    ></div>
                </div>
                <div className="mt-4">
                    <h6 className="fw-bold text-muted mb-3">
                        🌍 Translations
                    </h6>

                    {Object.entries(this.props.currentItem.translations || {}).map(
                        ([lang, translation]: [string, any]) => (
                            <div
                                key={lang}
                                data-lang={lang}
                                className="card mb-2 border-0 bg-light"
                            >
                                <div className="card-body py-2">

                                    <div className="d-flex align-items-center mb-2">
                                        <span className="fs-5 me-2">
                                            {this.getFlag(translation)}
                                        </span>

                                        <span className="badge bg-primary">
                                            {lang.toUpperCase()}
                                        </span>
                                    </div>

                                    <div>
                                        <strong>Name:</strong>
                                        <div>{translation.name || '-'}</div>
                                    </div>

                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        )
    }
}

export default ViewAllergen;