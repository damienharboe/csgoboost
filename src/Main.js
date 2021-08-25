import React, { Component } from "react";
import {
  Route,
  NavLink,
  BrowserRouter,
  Redirect
} from "react-router-dom";
import Marked from "./marked";
import Inventar from "./inventar";
import Help from "./help";
import Item from "./item"
import Footer from "./footer"
import Profile from "./account/profile"
import History from "./account/history"
import Deposit from "./account/deposit"
import Withdraw from "./account/withdraw"
import Pending from "./account/pending"
const axios = require("axios")

class User extends Component {
    constructor(props, context){
        super(props, context);
        this.showHideProfile = this.showHideProfile.bind(this)
        this.showHideNotifs = this.showHideNotifs.bind(this)
        this.handleLogin = this.handleLogin.bind(this);
        this.getUserInfo = this.getUserInfo.bind(this);
        this.state = { showProfile: false, showNotifs: false, money: 0, name: "", avatar: "" }
    }

    showHideProfile()
    {
        if(this.state.showProfile)
        {
            this.setState({ showProfile: false })
        }
        else {
            this.setState({ showProfile: true })
        }
        this.props.callback("showProfile", !this.state.showProfile)
    }

    showHideNotifs()
    {
        if(this.state.showNotifs)
        {
            this.setState({ showNotifs: false })
            this.props.notifcallback(false)
        }
        else {
            this.setState({ showNotifs: true })
            this.props.notifcallback(true)
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
            c.setState({ name: response.data.name, money: response.data.money, avatar: response.data.avatar })
            c.props.setMoney(response.data.money)
        })
    }

    handleLogin()
    {
        const popup = window.open(
            "http://localhost:8080/auth/steam",
            "_blank",
            "width=800, height=600"
        )
        if(window.focus) popup.focus()

        window.addEventListener("message", event => {
            if(event.origin !== "http://localhost:8080") return
            const { token, ok } = event.data
            if(ok)
            {
                localStorage.setItem("token", token)
                this.getUserInfo()
                popup.close()
            }
        })
    }

    render()
    {
        var profilec = "profile hidden"
        var accountc = "a account"
        var notifc = "a notification colorTextHighlight"
        if(this.state.showProfile)
        {
            profilec = "profile"
            accountc = "a account colorBgHeaderLight selected"
        }
        if(this.state.showNotifs)
        {
            var notifc = "a notification colorTextHighlight selected"
        }
        if(!localStorage.token)
        {
            return(
                <div className="right">
                    <img style={{marginTop: "10%"}} onClick={this.handleLogin} src="https://steamcommunity-a.akamaihd.net/public/images/signinthroughsteam/sits_01.png" />
                </div>
            )
        }
        else
        {
            if(this.state.name === "")
            {
                this.getUserInfo()
            }
            return(
                <div className="right">
                    <a className={notifc} id="notificationIcon" onClick={this.showHideNotifs} >
                        1
                    </a>
                    <a className={accountc} id="accountIcon" onClick={this.showHideProfile}>
                        <span className="text">
                            Konto
                        </span>
                        <div className="img">
                            <img src={this.state.avatar} />
                        </div>
                    </a>
                </div>
            )
        }
    }
}

class Notification extends Component {
    render()
    {
        return(
            <div class="notificationBox rounded" id="notification_1">
                <div class="img" /*style="background-image: url('gfx/DEAGLE.png');"*/>&nbsp;</div>
                <div class="right">
                    <span class="date">D. 20/01-2021 kl. 16:15 (5 minutter siden)</span>
                    <span class="header">
                        <b>Genstand solgt</b>: Desert Eagle | Printstream (Minimal Wear)
                    </span>
                    
                    Denne genstand er blevet solgt til <b><a href="https://steamcommunity.com/profiles/76561199021109632" target="_blank">M0rgenA1M | CSGOBOOST.DK</a></b>.
                    <br /> Genstanden skal leveres inden d. 21/01-2021 kl. 16:3
                    <div class="actions">
                        <div class="button rounded">
                            Levér genstand
                        </div>
                        <div class="button rounded">
                            Se alle salg
                        </div>
                    </div>
                    
                    <div class="button close">
                        X
                    </div>
                </div>
            </div> 
        )
    }
}

class Main extends Component {
    constructor(props, context){
        super(props, context);
        this.showHideProfile = this.showHideProfile.bind(this)
        this.showHideNotifs = this.showHideNotifs.bind(this)
        this.renderInventarButton = this.renderInventarButton.bind(this)
        this.getNotifs = this.getNotifs.bind(this)
        this.setMoney = this.setMoney.bind(this)
        this.logout = this.logout.bind(this)
        this.state = { showProfile: false, showNotifs: false, money: "...", first: true, notifs: [] }
    }

    logout()
    {
        window.localStorage.removeItem("token")
        window.location.replace("/marked")
    }

    showHideProfile(key, val)
    {
        this.setState({ showProfile: val })
    }

    showHideNotifs(val)
    {
        this.setState({ showNotifs: val })
    }

    setMoney(money)
    {
        this.setState({ money: money })
    }

    renderInventarButton()
    {
        if(localStorage.getItem("token") !== null)
        {
            return(
                <NavLink to="inventar" className="a" activeClassName="selected">
                    Inventar
                </NavLink>
            )
        }
    }

    async getNotifs()
    {
        console.log("test2")
        let c = this
        axios.get("/api/user/notifications", {
            params: {
                token: localStorage.getItem("token"),
            }
        }).then(function(response){
            var notifs = Array()
            for(var i = 0; i < response.data; i++)
            {
                let notif = response.data[i]
                notifs.push(<Notification 
                    type={notif.type}
                    time={notif.time}
                    name={notif.name}
                    weaponname={notif.weapon.weaponname}
                    skinname={notif.weapon.skinname}
                    wear={notif.weapon.wear}
                    url={notif.weapon.url}
                />)
            }
            c.setState({ notifs: notifs })
        })
    }

    render() {
        let accountc = "profile hidden"
        let notifc = "notificationsParent hidden"
        if(this.state.showProfile)
        {
            accountc = "profile"
        }
        if(this.state.showNotifs)
        {
            notifc = "notificationsParent"
        }
        if(this.state.first)
        {
            this.state.first = false
            this.getNotifs()
        }

        return (
            <BrowserRouter>
                <Redirect exact from="/" to="marked" />
                <div className="mainHeader noselect">
                    <div className="menu">
                        <div className="logo"></div>
                        <div className="left">
                            <NavLink to="marked" className="a" activeClassName="selected">
                              Marked
                            </NavLink>
                            {this.renderInventarButton()}
                            <NavLink to="help" className="a" activeClassName="selected">
                                Hjælp
                            </NavLink>
                        </div>
                        <User setMoney={this.setMoney} callback={this.showHideProfile} notifcallback={this.showHideNotifs} />
                    </div>
                </div>
                <div className={accountc} id="profileDropDown">
                    <div className="content">
                        <div className="left">
                            <NavLink to="pending">
                                Afventende Køb / Salg
                            </NavLink>
                            <NavLink to="history">
                                Købshistorik
                            </NavLink>
                            <NavLink to="profile">
                                Profiloplysninger
                            </NavLink>
                            <a onClick={this.logout} className="logout">Log ud</a>
                        </div>
                        <div className="right">
                            <span className="balance">
                                Indestående balance:
                                <span className="value">
                                    {this.state.money} kr
                                </span>
                            </span>
                            <NavLink to="deposit">
                                Indsæt balance
                            </NavLink>
                            <NavLink to="withdraw">
                                Udbetal balance
                            </NavLink>
                        </div>
                    </div>
                </div>
                <div className="content">
                    <div className={notifc} id="notifications">
                        {this.state.notifs}
                    </div>
                    <Route path="/marked" component={Marked} />
                    <Route path="/inventar" component={Inventar} />
                    <Route path="/help" component={Help} />
                    <Route path="/item" component={Item} />
                    <Route path="/profile" component={Profile} />
                    <Route path="/history" component={History} />
                    <Route path="/withdraw" component={Withdraw} />
                    <Route path="/deposit" component={Deposit} />
                    <Route path="/pending" component={Pending} />
                </div>
            </BrowserRouter>
        );
    }
}

export default Main;
