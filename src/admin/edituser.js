import axios from "axios";
import React, { Component } from "react"

class EditUser extends Component {
    constructor(props, context){
        super(props, context);
        this.getUserInfo = this.getUserInfo.bind(this)
        this.state = {
            username: "",
            avatar: "",
            money: 0,
            admin: false,
            city: "",
            country: "",
            email: "",
            phonenr: "",
            postnr: "",
            realname: "",
            region: "",
            road: "",
            tradeurl: "",
            apikey: "",
            fee: "",
            banned: false
        }
        this.firstCall = true
    }

    getUserInfo()
    {
        let c = this
        axios.get("/api/admin/user", {
            params: {
                token: localStorage.getItem("token"),
                steamId: this.props.location.state.steamId
            }
        }).then((response) => {
            this.setState({
                username: response.data.name,
                avatar: response.data.avatar,
                money: response.data.money,
                admin: response.data.admin,
                city: response.data.city,
                country: response.data.country,
                email: response.data.email,
                phonenr: response.data.phonenr,
                postnr: response.data.postnr,
                realname: response.data.realname,
                region: response.data.region,
                road: response.data.road,
                tradeurl: response.data.tradeurl,
                apikey: response.data.apikey,
                fee: response.data.fee,
                banned: response.data.banned
            })
        })
    }

    render()
    {
        if(this.firstCall)
        {
            this.getUserInfo()
            this.firstCall = false
        }

        return(
            <>
                <div className="subHeader">
                    CSGO Boost &gt; Admin &gt; Redigér Bruger &gt; {this.props.location.state.username}
                </div>
                <div className="contentBox rounded">
                    <div class="header">
                        Redigér bruger
                    </div>
                    <div className="subtext flexsplit">
                        <div>
                            <span className="inputLabel">
                                Brugernavn
                            </span>
                            <input value={this.state.username} onChange={e => this.setState({ username: e.target.value })} className="rounded" type="text" />
                            
                            <span className="inputLabel">
                                Navn
                            </span>
                            <input value={this.state.realname} onChange={e => this.setState({ realname: e.target.value })} className="rounded" type="text" />

                            <span className="inputLabel">
                                Email
                            </span>
                            <input value={this.state.email} onChange={e => this.setState({ email: e.target.value })} className="rounded" type="text" />

                            <span className="inputLabel">
                                Telefonnummer
                            </span>
                            <input value={this.state.phonenr} onChange={e => this.setState({ phonenr: e.target.value })} className="rounded" type="text" />

                            <span className="inputLabel">
                                Post nr
                            </span>
                            <input value={this.state.postnr} onChange={e => this.setState({ postnr: e.target.value })} className="rounded" type="text" />

                            <span className="inputLabel">
                                Region
                            </span>
                            <input value={this.state.region} onChange={e => this.setState({ region: e.target.value })} className="rounded" type="text" />

                            <span className="inputLabel">
                                Vej
                            </span>
                            <input value={this.state.road} onChange={e => this.setState({ road: e.target.value })} className="rounded" type="text" />

                            <span className="inputLabel">
                                By
                            </span>
                            <input value={this.state.city} onChange={e => this.setState({ city: e.target.value })} className="rounded" type="text" />

                            <span className="inputLabel">
                                Country
                            </span>
                            <input value={this.state.country} onChange={e => this.setState({ country: e.target.value })} className="rounded" type="text" />
                        </div>
                        <div>
                            <span className="inputLabel">
                                Penge
                            </span>
                            <input value={this.state.money} onChange={e => this.setState({ money: e.target.value })} className="rounded" type="text" />

                            <span className="inputLabel">
                                Trade URL
                            </span>
                            <input value={this.state.tradeurl} onChange={e => this.setState({ tradeurl: e.target.value })} className="rounded" type="text" />

                            <span className="inputLabel">
                                API Key
                            </span>
                            <input value={this.state.apikey} onChange={e => this.setState({ apikey: e.target.value })} className="rounded" type="text" />

                            <span className="inputLabel">
                                Fee
                            </span>
                            <input value={this.state.fee} onChange={e => this.setState({ fee: e.target.value })} className="rounded" type="text" />
                            
                            <span className="inputLabel">
                                Admin
                            </span>
                            <input defaultChecked={this.state.admin} onChange={e => this.setState({ admin: e.target.value })} className="rounded" type="checkbox" />
                            
                            <span className="inputLabel">
                                Banned
                            </span>
                            <input defaultChecked={this.state.banned} onChange={e => this.setState({ banned: e.target.value })} className="rounded" type="checkbox" />
                        </div>
                    </div>
                    <div className="flexright">
                        <input onClick={this.updateInfo} type="submit" className="button rounded" value="Gem oplysninger" />
                    </div>
                </div>
            </>
        )
    }
}

export default EditUser