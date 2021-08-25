import axios from "axios";
import React, { Component } from "react"

class Profile extends Component {
    constructor(props, context){
        super(props, context);
        this.updateInfo = this.updateInfo.bind(this)
        this.state = {
            name: "",
            road: "",
            postnr: "",
            city: "",
            region: "",
            country: "",
            apikey: "",
            tradeurl: "",
            email: "",
            phonenr: "",
            bankregistreringsnummer: "",
            kontonr: "",
            first: true
        }
    }

    async getUserInfo()
    {
        let c = this
        axios.get("/api/user", {
            params: {
                token: localStorage.getItem("token"),
            }
        }).then(function(response){
            c.setState({
                name: response.data.name,
                road: response.data.road,
                postnr: response.data.postnr,
                city: response.data.city,
                region: response.data.region,
                country: response.data.country,
                apikey: "****",
                tradeurl: response.data.tradeurl,
                email: response.data.email,
                phonenr: response.data.phonenr,
                bankregistreringsnummer: "****",
                kontonr: "****"
            })
        })
    }

    updateInfo()
    {
        let postdata = {
            token: localStorage.getItem("token"),
            name: this.state.name,
            road: this.state.road,
            postnr: this.state.postnr,
            city: this.state.city,
            region: this.state.region,
            country: this.state.country,
            tradeurl: this.state.tradeurl,
            email: this.state.email,
            phonenr: this.state.phonenr
        }
        if(this.state.apikey != "****")
        {
            postdata.apikey = this.state.apikey
        }
        if(this.state.bankregistreringsnummer != "****")
        {
            postdata.bankregistreringsnummer = this.state.bankregistreringsnummer
        }
        if(this.state.kontonr != "****")
        {
            postdata.kontonr = this.state.kontonr
        }

        axios.post("/api/user", postdata).then(function(response){
            if(response.data.status !== "OK")
            {
                alert("Din data blev ikke opdateret.")
            }
        })
    }

    render(){
        if(this.state.first)
        {
            this.state.first = false
            this.getUserInfo()
        }

        return(
            <div className="wrapper">
                <div className="subHeader">
                    CSGO Boost &gt; Profiloplysninger
                </div>
                <div className="contentBox rounded">
                    <div className="header">
                        Profiloplysninger
                    </div>
                    <form>
                        <div className="subtext flexsplit">
                            <div>
                                <div className="subheader">
                                    Navn og adresse
                                </div>
                                <span className="inputLabel">
                                    Fulde navn <span className="star">*</span>
                                </span>
                                <input value={this.state.name} onChange={e => this.setState({ name: e.target.value })} className="rounded" type="text" placeholder="Indtast dit fulde navn" required />
                                <span className="inputLabel">
                                    Vej <span className="star">*</span>
                                </span>
                                <input value={this.state.road} onChange={e => this.setState({ road: e.target.value })} className="rounded" type="text" placeholder="Indtast din adresse (vej)" required />
                                <span className="inputLabel">
                                    Post nr. <span className="star">*</span>
                                </span>
                                <input value={this.state.postnr} onChange={e => this.setState({ postnr: e.target.value })} className="rounded" type="text" placeholder="Indtast din adresse (post nr.)" required />
                                <span className="inputLabel">
                                    By <span className="star">*</span>
                                </span>
                                <input value={this.state.city} onChange={e => this.setState({ city: e.target.value })} className="rounded" type="text" placeholder="Indtast din adresse (by)" required />
                                <span className="inputLabel">
                                    Region
                                </span>
                                <input value={this.state.region} onChange={e => this.setState({ region: e.target.value })} className="rounded" type="text" placeholder="Indtast din adresse (region)" required />
                                <span className="inputLabel">
                                    Land <span className="star">*</span>
                                </span>
                                <input value={this.state.country} onChange={e => this.setState({ country: e.target.value })} className="rounded" type="text" placeholder="Vælg dit land på listen" required />
                            </div>
                            <div>
                                <div className="subheader">
                                    Yderligere information
                                </div>
                                <span className="inputLabel">
                                    API nøgle <span className="star">*</span>
                                </span>
                                <input value={this.state.apikey} onChange={e => this.setState({ apikey: e.target.value })} className="rounded" type="text" placeholder="Indsæt API nøgle fra Steam's website" required />
                                <a href="https://steamcommunity.com/dev/apikey" target="_blank"><div className="help">?</div></a>
                                <span className="inputLabel">
                                    Bytte URL <span className="star">*</span>
                                </span>
                                <input value={this.state.tradeurl} onChange={e => this.setState({ tradeurl: e.target.value })} className="rounded" type="text" placeholder="Indtast bytte URL fra Steams's website" required />
                                <a href="https://steamcommunity.com/id/mdut/tradeoffers/privacy#trade_offer_access_url" target="_blank"><div className="help">?</div></a>
                                <span className="inputLabel">
                                    Email adresse <span className="star">*</span>
                                </span>
                                <input value={this.state.email} onChange={e => this.setState({ email: e.target.value })} className="rounded" type="text" placeholder="Indtast din email adresse" required />
                                <span className="inputLabel">
                                    Telefonnummer <span className="star">*</span>
                                </span>
                                <input value={this.state.phonenr} onChange={e => this.setState({ phonenr: e.target.value })} className="rounded" type="text" placeholder="Indtast dit telefonnummer (uden landekode)" required />
                                <span className="inputLabel">
                                    Bank registeringsnummer (reg.) <span className="star">*</span>
                                </span>
                                <input value={this.state.bankregistreringsnummer} onChange={e => this.setState({ bankregistreringsnummer: e.target.value })} className="rounded" type="text" placeholder="Indtast dit bank registeringsnummer" required />
                                <span className="inputLabel">
                                    Bank kontonummer <span className="star">*</span>
                                </span>
                                <input value={this.state.kontonr} onChange={e => this.setState({ kontonr: e.target.value })} className="rounded" type="text" placeholder="Indtast dit bank kontonummer" required />
                            </div>
                        </div>
                        <div className="flexright">
                            <input onClick={this.updateInfo} type="submit" className="button rounded" value="Gem oplysninger" />
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default Profile
