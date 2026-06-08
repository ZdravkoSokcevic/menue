import CountriesAPI from "@/api/CountriesAPI";
import { TMenu } from "@/types/Menu";
import { ICountry, TCountries } from "@/types/TCountries";
import React from "react";
interface IProps {
    currentItem: TMenu
}
interface IState {
    countries: TCountries;
}

class ViewMenu extends React.Component<IProps, IState>
{
    constructor(props: IProps) {
        super(props);
        this.state = {
            countries: [],
        }
    }

    componentWillUnmount(): void {
        this.getCountries();    
    }

    getCountries = async() => {
        let countries = await CountriesAPI.getCountries();
        if(countries)
            this.setState({countries: countries});
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
                <div className="col-md-12 d-flex">
                    <br />
                    <div className="col-md-6 border-end p-2">
                    <p>{this.props.currentItem.description}</p>

                    <div
                    style={{
                        border: "2px dashed #ccc",
                        padding: "20px",
                        textAlign: "center",
                        borderRadius: "10px",
                        backgroundColor: "#f0f8ff",
                        height: '200px',
                        width: '200px',
                        backgroundImage: this.props.currentItem.picture ? `url(/storage/${this.props.currentItem.picture})` : '',
                        backgroundSize: 'cover',
                        position: 'relative'
                    }}
                    ></div>
                    </div>
                    <div className="col-md-6 p-2">
                        <br />
                        <div className="col-12 text-right">
                            <p><small>Quantity:</small>{this.props.currentItem.quantity}</p>

                        </div>
                    </div>
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

                                    <div className="mt-2">
                                        <strong>Description:</strong>
                                        <div className="text-muted">
                                            {translation.description || '-'}
                                        </div>
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

export default ViewMenu;