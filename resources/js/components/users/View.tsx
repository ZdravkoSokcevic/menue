import CountriesAPI from "@/api/CountriesAPI";
import { ICountry, TCountries } from "@/types/TCountries";
import TUser from "@/types/TUser";
import React from "react";
interface IProps {
    currentUser: TUser;
    closeModal: Function;
}
interface IState {
    countries: TCountries;
}

class ViewUser extends React.Component<IProps, IState>
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
            <div className="form-page">
                    <div className="modal-header">
                        <h2>User profile</h2>
                        <button className="close-btn" onClick={() => this.props.closeModal()}>&times;</button>
                    </div>
                    <div className="container-fluid p-0 mb-5">
                            <div className="modal-scroll-body">
                                <div className="row g-4">
                                    {/* <div className="modal-content shadow-lg"> */}

                                            {/* Modal Body */}
                                            <div className="modal-body">
                                            {/* User Header Info */}
                                            <div className="d-flex align-items-center mb-4">
                                                <div
                                                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3 fw-bold fs-4"
                                                style={{ width: '56px', height: '56px' }}
                                                >
                                                {this.props.currentUser.first_name?.[0]}{this.props.currentUser.last_name?.[0]}
                                                </div>
                                                <div>
                                                <h5 className="mb-0 fw-bold">{this.props.currentUser.first_name} {this.props.currentUser.last_name}</h5>
                                                <small className="text-muted">@{this.props.currentUser.username}</small>
                                                </div>
                                            </div>

                                            {/* User Details List */}
                                            <div className="list-group list-group-flush">
                                                <div className="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                                                <span className="text-muted">Email</span>
                                                <a href={`mailto:${this.props.currentUser.email}`} className="text-decoration-none fw-semibold">
                                                    {this.props.currentUser.email}
                                                </a>
                                                </div>

                                                <div className="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                                                <span className="text-muted">Company</span>
                                                <span className="fw-semibold">{this.props.currentUser.company?.name || 'N/A'}</span>
                                                </div>

                                                <div className="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                                                <span className="text-muted">Accepted Orders</span>
                                                <span className="badge bg-success rounded-pill px-3 py-2 fs-6">
                                                    {this.props.currentUser.accepted_orders_count ?? 0}
                                                </span>
                                                </div>
                                            </div>
                                            </div>

                                            {/* Modal Footer */}
                                            <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" onClick={() => this.props.closeModal()}>
                                                Close
                                            </button>
                                            </div>
                                        </div>
                                {/* </div> */}
                            </div>
                    </div>
            </div>
        )
    }
}

export default ViewUser;