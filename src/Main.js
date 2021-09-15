import React, { Component } from "react";
import {
  Route,
  NavLink,
  BrowserRouter,
  Redirect
} from "react-router-dom";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
import EditUser from "./admin/edituser"
import GlobalSettings from "./admin/globalsettings"
import UserList from "./admin/userlist"

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
                        {this.props.notifCount}
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

class NotifOffer extends Component {
    constructor(props, context){
        super(props, context);
        this.acceptOffer = this.acceptOffer.bind(this)
        this.rejectOffer = this.rejectOffer.bind(this)
        this.removeNotif = this.removeNotif.bind(this)
    }

    acceptOffer()
    {
        var postdata = {
            token: localStorage.getItem("token"),
            classid: this.props.classid
        }
        axios.post("/api/market/addorder", postdata)
    }

    rejectOffer()
    {
        var postdata = {
            token: localStorage.getItem("token"),
            classid: this.props.classid
        }
        axios.post("/api/market/offer/reject", postdata)
    }

    removeNotif()
    {

    }

    render()
    {
        const wearmap = new Map()
        wearmap.set(0, "Factory New")
        wearmap.set(1, "Minimal Wear")
        wearmap.set(2, "Field-Tested")
        wearmap.set(3, "Well-Worn")
        wearmap.set(4, "Battle-Scarred")

        var addzero = (t) => {
            if(t < 10)
                t = "0" + t.toString()
            return t
        }

        var timeSince = (date) => {

            var seconds = Math.floor((new Date() - date) / 1000);
          
            var interval = seconds / 31536000;
          
            if (interval > 1) {
              return Math.floor(interval) + " år siden";
            }
            interval = seconds / 2592000;
            if (interval > 1) {
              return Math.floor(interval) + " måneder siden";
            }
            interval = seconds / 86400;
            if (interval > 1) {
              return Math.floor(interval) + " dage siden";
            }
            interval = seconds / 3600;
            if (interval > 1) {
              return Math.floor(interval) + " timer siden";
            }
            interval = seconds / 60;
            if (interval > 1) {
              return Math.floor(interval) + " minutter siden";
            }
            return Math.floor(seconds) + " sekunder siden";
          }

        var imgstyle = {
            backgroundImage: "url(" + this.props.url + ")",
            backgroundSize: "90%",
            backgroundRepeat: "no-repeat",
            position: "absolute",
            backgroundPosition: "center"
        }

        var removeprop = () => {
            this.props.removeNotif(this.props.classid)
        }

        var d = new Date(this.props.time)

        return(
            <div className="notificationBox rounded" id="notification_1">
                <div className="img" style={{...imgstyle}}>&nbsp;</div>
                <div className="right">
                    <span className="date">D. {addzero(d.getDate())}/{addzero(d.getMonth() + 1)}/{d.getFullYear()} kl. {addzero(d.getHours())}:{addzero(d.getMinutes())} ({timeSince(this.props.time)})</span>
                    <span className="header">
                        <b>Tilbud</b>: {this.props.weaponname} | {this.props.weaponname} ({wearmap.get(this.props.wear)})
                    </span>
                    
                    Tilbud fra <b><a href={"https://steamcommunity.com/profiles/" + this.props.steamId} target="_blank">{this.props.name}</a></b>.
                    <div className="actions">
                        <div className="button rounded" onClick={this.acceptOffer}>
                            Accepter tilbud
                        </div>
                        <div className="button rounded" onClick={this.rejectOffer}>
                            Afvis tilbud
                        </div>
                    </div>
                    
                    <div className="button close" onClick={removeprop}>
                        X
                    </div>
                </div>
            </div> 
        )
    }
}

class Notification extends Component {
    render()
    {
        if(this.props.type == "offer")
        {
            return(
                <NotifOffer 
                    time={this.props.time}
                    name={this.props.name}
                    weaponname={this.props.weaponname}
                    skinname={this.props.skinname}
                    wear={this.props.wear}
                    url={this.props.url}
                    steamId={this.props.steamId}
                    classid={this.props.classid}
                    removeNotif={this.props.removeNotif}
                />
            )
        }
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
        this.removeNotif = this.removeNotif.bind(this)
        this.getadmin = this.getadmin.bind(this)
        this.renderAdminButton = this.renderAdminButton.bind(this)
        this.state = { showProfile: false, showNotifs: false, money: "...", first: true, notifs: [], admin: false, adminclass: false }
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

    removeNotif(id)
    {
        var newarr = this.state.notifs
        newarr.forEach((elem, index) => {
            if(elem.props.classid == id)
            {
                newarr.splice(index)
            }
        })
        this.setState({ notifs: newarr })
        
        // Post notif
        var postdata = {
            token: localStorage.getItem("token"),
            classid: id
        }
        axios.post("/api/user/notifications/remove", postdata)
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
                <NavLink to="/inventar" className="a" activeClassName="selected">
                    Inventar
                </NavLink>
            )
        }
    }

    async getNotifs()
    {
        let c = this
        axios.get("/api/user/notifications", {
            params: {
                token: localStorage.getItem("token"),
            }
        }).then(function(response){
            var notifs = Array()
            for(var i = 0; i < response.data.length; i++)
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
                    steamId={notif.steamId}
                    classid={notif.weapon.classid}
                    removeNotif={c.removeNotif}
                />)
            }
            c.setState({ notifs: notifs })
        })
    }

    getadmin()
    {
        let c = this
        axios.get("/api/user/isadmin", {
            params: {
                token: localStorage.getItem("token")
            }
        }).then(function(response){
            c.setState({ admin: response.data.admin })
        })
    }

    renderAdminButton()
    {
        if(this.state.admin)
        {
            return(
                <>
                    <a className="a" onClick={() => this.setState({ adminclass: !this.state.adminclass })}>Admin</a>
                    <div className={ "dropdown-content " + (this.state.adminclass ? "active" : "") }>
                        <br />
                        <NavLink to="/admin/userlist">
                            Brugerliste
                        </NavLink> <br /> <br />
                        <NavLink to="/admin/globalsettings">
                            Globale indstillinger
                        </NavLink>
                    </div>
                </>
            )
        }
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
            this.getadmin()
        }

        return (
            <BrowserRouter>
                <Redirect exact from="/" to="marked" />
                <div className="mainHeader noselect">
                    <div className="menu">
                        <div className="logo"></div>
                        <div className="left">
                            <NavLink to="/marked" className="a" activeClassName="selected">
                              Marked
                            </NavLink>
                            {this.renderInventarButton()}
                            <NavLink to="/help" className="a" activeClassName="selected">
                                Hjælp
                            </NavLink>
                            {this.renderAdminButton()}
                        </div>
                        <User setMoney={this.setMoney} notifCount={this.state.notifs.length} callback={this.showHideProfile} notifcallback={this.showHideNotifs} />
                    </div>
                </div>
                <div className={accountc} id="profileDropDown">
                    <div className="content">
                        <div className="left">
                            <NavLink to="/pending">
                                Afventende Køb / Salg
                            </NavLink>
                            <NavLink to="/history">
                                Købshistorik
                            </NavLink>
                            <NavLink to="/profile">
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
                    <Route path="/admin/edituser" component={EditUser} />
                    <Route path="/admin/globalsettings" component={GlobalSettings} />
                    <Route path="/admin/userlist" component={UserList} />
                </div>
            </BrowserRouter>
        );
    }
}

export default Main;
