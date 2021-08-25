import axios from "axios";
import React, { Component } from "react"
import {useLocation} from 'react-router-dom'

class ItemInfo extends Component {
    constructor(props, context){
        super(props, context);
        this.isStattrak = this.isStattrak.bind(this)
        this.getSteamPrice = this.getSteamPrice.bind(this)
        this.state = {
            steamprice: 0,
            steamlink: "",
            first: true
        }
    }

    isStattrak()
    {
        if(this.props.stattrak)
        {
            return(
                <div className="stattrack">StatTrack</div>
            )
        }
    }

    getSteamPrice()
    {
        const wearmap = new Map()
        wearmap.set(0, "Factory New")
        wearmap.set(1, "Minimal Wear")
        wearmap.set(2, "Field-Tested")
        wearmap.set(3, "Well-Worn")
        wearmap.set(4, "Battle-Scarred")

        // Create da market hash (weed lolol funny™)
        // MP5-SD | Dirt Drop (Battle-Scarred)
        var hash = this.props.weaponname + " | " + this.props.skinname + " (" + wearmap.get(this.props.wear) + ")"
        if(this.props.stattrak)
            hash = "StatTrak™ " + this.props.weaponname + " | " + this.props.skinname + " (" + wearmap.get(this.props.wear) + ")"
        
        this.setState({ steamlink: "https://steamcommunity.com/market/listings/730/" + hash })
        var c = this
        axios.get("/api/market/item/steamprice", {
            params: {
                weaponname: this.props.weaponname,
                skinname: this.props.skinname,
                wear: this.props.wear,
                stattrak: this.props.stattrak
            }
        }).then(function(response){
            c.setState({ steamprice: String(response.data.steamprice).replace(".", ",") })
        })
    }

    render(){
        if(this.state.first)
        {
            this.state.first = false
            this.getSteamPrice()
        }

        const wearmap = new Map()
        wearmap.set(0, "Factory New")
        wearmap.set(1, "Minimal Wear")
        wearmap.set(2, "Field-Tested")
        wearmap.set(3, "Well-Worn")
        wearmap.set(4, "Battle-Scarred")

        const colmap = new Map()
        colmap.set(0, "fn")
        colmap.set(1, "mw")
        colmap.set(2, "ft")
        colmap.set(3, "ww")
        colmap.set(4, "bs")

        let bgstyle = {
            backgroundImage: `url(${this.props.url}`,
            backgroundSize: "90%",
            backgroundRepeat: 'no-repeat',
            marginTop: "13px",
        }

        return(
            <div>
                <div class="subHeader">
                    CSGO Boost &gt; Market &gt; {this.props.weaponname} | {this.props.skinname}
                </div>
                <div className="itemInfo">
                    <div className="imgBox rounded">
                            <div className={"rounded_b condition " + colmap.get(this.props.wear)}>
                                {wearmap.get(this.props.wear)}
                            </div>
                            <div className="img" style={{...bgstyle}}></div>
                            {this.isStattrak()}
                    </div>
                    <div className="infoBox rounded">
                        <span className="weapon">{this.props.weaponname}</span>
                        <span className="skin">{this.props.skinname}</span>
                        <div className="subInfo">
                            <span>
                                <span className="#ffffff"><b>Stand</b>:</span> {wearmap.get(this.props.wear)}
                            </span>
                            <span className="refPrice">
                                <a href={this.state.steamlink}>Steam market: <span className="#ffffff"><b className="">{this.state.steamprice}</b> DKK</span></a>
                            </span>
                            <div className="conditionParent">
                                <div className="rounded condition fn">
                                    <span className="price">
                                        DKK 975
                                    </span>
                                        Factory New
                                    </div>
                                <div className="rounded condition mw">
                                    <span className="price">
                                        DKK 640
                                    </span>
                                    Minimal Wear
                                </div>
                                <div className="rounded condition ft">
                                    <span className="price">
                                        DKK 420
                                    </span>
                                    Field-Tested
                                </div>
                                <div className="rounded condition ww">
                                    <span className="price">
                                        DKK 380
                                    </span>
                                    Well-Worn
                                </div>
                                <div className="rounded condition bs">
                                    <span className="price">
                                        DKK 305
                                    </span>
                                    Battle-Scarred
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class SortingMenu extends Component {
    render(){
        return(
            <div className="sortingMenu rounded noselect">
                <div className="priceSortParent">
                    <span className="text">
                        Sæt float value
                    </span>
                    <input className="rounded" type="text" placeholder="0.0" id="floatlow" onfocus="setInputValue('floatlow', '0.0')" onfocusout="setMinFloat('floatlow', 0, 0.069)" />
                    -
                    <input className="rounded" type="text" placeholder="0.07" id="floathigh" onfocus="setInputValue('floathigh', '0.0')" onfocusout="setMaxFloat('floathigh', 0.001, 0.07)" />
                </div>
                <div className="sortingParent">
                    <span className="text">
                        Sorter efter
                    </span>
                    <span className="dropDown sortingDropDown" style={{marginLeft: "15px"}}>
                        <span className="trigger rounded z3">
                            Pris
                        </span>
                        <div className="content rounded_b z2">
                            <a href="">Pris</a>
                            <a href="">Float</a>
                            <a href="">Dato tilføjet</a>
                        </div>
                    </span>
                    <span className="dropDown" style={{width: "50px!important"}}>
                        <span className="trigger sortingOrder rounded">
                            <div className="sortingImg">&nbsp;</div>
                        </span>
                    </span>
                </div>
            </div>
        )
    }
}

class ItemListing extends Component {
    constructor(props, context){
        super(props, context);
        this.callbackBuy = this.callbackBuy.bind(this)
        this.callbackBargain = this.callbackBargain.bind(this)
        this.renderMoney = this.renderMoney.bind(this)
        this.renderbuy = this.renderbuy.bind(this)
        this.buy = this.buy.bind(this)
        this.offer = this.offer.bind(this)
        this.state = {
            offer: 0
        }
    }

    callbackBuy = () => {
        this.props.callback(this.props.id)
    }

    callbackBargain = () => {
        this.props.callback(this.props.id, true)
    }

    buy()
    {
        var postdata = {
            token: localStorage.getItem("token"),
            classid: this.props.classid
        }
        axios.post("/api/market/addorder", postdata).then(function(response){

        })
    }

    offer()
    {
        var postdata = {
            token: localStorage.getItem("token"),
            offer: this.state.offer,
            classid: this.props.classid
        }
        axios.post("/api/market/offer", postdata).then(function(response){

        })
    }

    renderbuy()
    {
        if(this.props.bargain)
        {
            return(
                <div className="bargainBox">
                    <input type="number" class="rounded" max="50" onChange={(e) => this.setState({ offer: e.target.value })} placeholder="Bud i DKK" />
                    <div className="button rounded" onClick={this.offer}>Afgiv bud</div>
                </div>
            )
        }
        else
        {
            return(
                <div className="buyBox">
                    <div className="button rounded" onClick={this.buy}>Bekræft køb</div>
                </div>
            )
        }
    }

    renderMoney()
    {
        if(this.props.bargain)
        {
            return(
                <div className="balance">
                    <span>
                        Balance efter tilbud:&nbsp;<b>DKK {this.props.money - this.state.offer}</b>
                    </span>
                </div>
            )
        }
        else
        {
            return(
                <div className="balance">
                    <span>
                        Balance efter køb:&nbsp;<b>DKK {this.props.money - this.props.price}</b>
                    </span>
                </div>
            )
        }
    }

    render(){
        let bgstyle = {
            backgroundImage: `url(${this.props.url}`,
            backgroundSize: "80%",
            backgroundRepeat: 'no-repeat',
            marginTop: "4px"
        }

        let picstyle = {
            backgroundImage: `url(${this.props.steampic}`,
            backgroundSize: "70%",
            backgroundRepeat: 'no-repeat',
            marginTop: "4px"
        }

        var c = "finalizePurchase hidden"
        var c2 = "button rounded"
        var text = "KØB"
        if(this.props.hidden === false)
        {
            c = "finalizePurchase"
            c2 = "button rounded gray"
            text = "LUK"
        }

        return(
            <div>
                <div className="itemListing rounded">
                    <div class="imgBox rounded_l">
                        <div class="img rounded_l" style={{...bgstyle}}></div>
                    </div>
                    <div class="info">
                        <div class="float">
                            <div class="value" id="floatValue_0">
                                {this.props.float}
                            </div>
                            <div class="floatbar">
                                <div class="indicator" id="floatIndicator_0" style={{left: "12.8905px"}}></div>
                                <div class="fn"></div>
                                <div class="mw"></div>
                                <div class="ft"></div>
                                <div class="ww"></div>
                                <div class="bs"></div>
                            </div>
                        </div>
                        <div class="stickers">
                            <div class="sticker" style={{backgroundImage: "url('gfx/icon_TEMP_account.jpg')"}}>
                                <div class="wear">100%</div>
                                <div class="alt">Slot 0:
                                    <b>Mastermind</b>
                                </div>
                            </div>
                            <div class="sticker" style={{backgroundImage: "url('gfx/icon_TEMP_account.jpg')"}}>
                                <div class="wear">100%</div>
                                <div class="alt" style={{left: "-100%"}}>Slot 1:
                                    <b>Mastermind</b>
                                </div>
                            </div>
                            <div class="sticker" style={{backgroundImage: "url('gfx/icon_TEMP_account.jpg')"}}>
                                <div class="wear">100%</div>
                                <div class="alt" style={{left: "-200%"}}>Slot 2:
                                    <b>Mastermind</b>
                                </div>
                            </div>
                            <div class="sticker" style={{backgroundImage: "url('gfx/icon_TEMP_account.jpg')"}}>
                                <div class="wear">100%</div>
                                <div class="alt" style={{left: "-300%"}}>Slot 3:
                                    <b>Mastermind</b>
                                </div>
                            </div>
                        </div>
                        <div class="seller">
                            <div class="img" style={{...picstyle}}></div>
                            <a href={"https://steamcommunity.com/profiles/" + this.props.steamId} class="name">
                                {this.props.steamname}
                            </a>
                        </div>
                        <div class="price">
                            <span>
                                <span class="dkk">DKK            </span>
                                <span>{this.props.price}</span>
                            </span>
                        </div>
                        <div class="buy">
                            <span class={c2} onClick={this.callbackBuy} id="buy_1">{text}</span>
                            <span class="offer">
                                <a onClick={this.callbackBargain}>
                                    BYD
                                </a>
                            </span>
                        </div>
                    </div>
                </div>
                <div className={c}>
                    <div>
                        <div className="button rounded">Se i inventar</div>
                        <div className="button rounded">Inspicér i spillet</div>
                    </div>

                    <div className="middle">
                        <div className="info">
                            <span>Paint index: <b>449</b></span>
                            <span>Pattern ID: <b>137</b></span>
                        </div>

                        {this.renderMoney()}
                    </div>
                    {this.renderbuy()}
                </div>
            </div>
        )
    }
}

class Item extends Component {
    constructor(props, context){
        super(props, context);
        this.state = {
            data: [],
            showingDialog: false,
            dialogId: null
        }

        this.showBuyDialog = this.showBuyDialog.bind(this)
        this.getItems = this.getItems.bind(this)
        this.firstCall = true
    }

    showBuyDialog(id, bargain = false)
    {
        var opendialog = () => {
            var d = this.state.data
            
            d[id] = <ItemListing 
                price={d[0].props.price} 
                wear={d[0].props.wear} 
                weaponname={d[0].props.weaponname} 
                skinname={d[0].props.skinname} 
                url={d[0].props.url}
                steamname={d[0].props.steamname}
                steampic={d[0].props.steampic}
                steamId={d[0].props.steamId}
                float={d[0].props.float}
                callback={this.showBuyDialog}
                id={id}
                hidden={false}
                money={this.state.money}
                bargain={bargain}
                classid={d[0].props.classid}
            />
            this.setState({
                dialogId: id,
                showingDialog: true,
                data: d
            })
        }

        var closedialog = () => {
            if(id == this.state.dialogId)
            {
                var d = this.state.data
                d[id] = <ItemListing 
                    price={d[0].props.price} 
                    wear={d[0].props.wear} 
                    weaponname={d[0].props.weaponname} 
                    skinname={d[0].props.skinname} 
                    url={d[0].props.url}
                    steamname={d[0].props.steamname}
                    steampic={d[0].props.steampic}
                    steamId={d[0].props.steamId}
                    float={d[0].props.float}
                    callback={this.showBuyDialog}
                    id={id}
                    hidden={true}
                    money={this.state.money}
                    bargain={false}
                    classid={d[0].props.classid}
                />
                this.setState({
                    dialogId: null,
                    showingDialog: false,
                    data: d
                })
            }
        }

        if(this.state.showingDialog)
        {
            if(id === this.state.dialogId)
            {
                if(bargain)
                {
                    opendialog(id, true)
                }
                else
                {
                    closedialog()
                }
            }
            else
            {
                closedialog()
                opendialog()
            }
        }
        else
        {
            // Open
            opendialog()
        }
    }

    getItems()
    {
        let c = this
        var s = this.props.location.state
        axios.get("/api/user", {
            params: {
                token: localStorage.getItem("token")
            }
        }).then(function(response){
            c.setState({ money: response.data.money })
            axios.get("/api/market/item", {
                params: {
                    weaponname: s.weaponname,
                    skinname: s.skinname,
                    stattrak: s.stattrak,
                    wear: s.wear
                }
            }).then(function(response){
                let data = []
                // For each item
                for (var i = 0; i < response.data.items.length; i++)
                {
                    let item = response.data.items[i]
                    console.log(item.classid)
                    data.push(<ItemListing 
                        price={item.price} 
                        wear={item.wear} 
                        weaponname={item.weaponname} 
                        skinname={item.skinname} 
                        url={s.url}
                        steamname={item.steamname}
                        steampic={item.steampic}
                        steamId={item.steamId}
                        float={item.float}
                        callback={c.showBuyDialog}
                        id={i}
                        hidden={true}
                        money={parseInt(response.data.money)}
                        classid={item.classid}
                    />)
                }
                c.setState({ data: data })
            })
        })
    }

    render(){
        if(this.firstCall)
        {
            this.getItems()
            this.firstCall = false
        }
        var s = this.props.location.state

        return(
            <div className="wrapper">
                <ItemInfo url={s.url} weaponname={s.weaponname} skinname={s.skinname} stattrak={s.stattrak} wear={s.wear} />
                <SortingMenu />
                <div className="itemList">
                    {this.state.data}
                </div>
            </div>
        )
    }
}

export default Item
