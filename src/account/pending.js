import axios from "axios";
import React, { Component } from "react"
import { Link } from "react-router-dom";

class Offers extends Component {
    constructor(props, context){
        super(props, context);
        this.rejectOffer = this.rejectOffer.bind(this)
        this.acceptOffer = this.acceptOffer.bind(this)
    }

    acceptOffer()
    {
        console.log(this.props.classid)
        var postdata = {
            token: localStorage.getItem("token"),
            classid: this.props.classid
        }
        axios.post("/api/market/addorder", postdata).then(function(response){
            
        })
    }

    rejectOffer()
    {
        console.log(this.props.classid)
        var postdata = {
            token: localStorage.getItem("token"),
            classid: this.props.classid
        }
        axios.post("/api/market/offer/reject", postdata).then(function(response){
            
        })
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

        var style = {
            backgroundImage: "url(" + this.props.url + ")",
            backgroundSize: "90%"
        }

        var wearstyle = {
            color: "rgb(226, 226, 226)",
            display: "block",
            fontFamily: "Rubik, sans-serif",
            fontSize: "11px",
            fontWeight: 400,
            height: "20px",
            lineHeight: "20px",
            textAlign: "left",
            textTransform: "uppercase",
            width: "272.297px"
        }

        var namestyle = {
            color: "rgb(226, 226, 226)",
            display: "block",
            fontFamily: "Montserrat, sans-serif",
            fontSize: "13px",
            fontWeight: 400,
            height: "20px",
            lineHeight: "20px",
            textAlign: "left",
            width: "288.297px",
            textTransform: "none"
        }

        var d = new Date(this.props.time)

        return(
            <>
                <div className="tr showInfo">
                    <div className="td">{addzero(d.getDate()) + "-" + addzero(d.getMonth() + 1) + "-" + d.getFullYear()}</div>
                    <div className="td">{addzero(d.getHours()) + ":" + addzero(d.getMinutes())}</div>
                    <div className="td">Tilbud <b>(Afventer din respons)</b></div>
                    <div className="td">+{this.props.price}</div>
                </div>
                <div className="tr info">
                    <div className="td"></div>
                    <div className="itemListing rounded">

                        <div className="imgBox rounded_l">
                            <div className="img rounded_l" style={{...style}}></div>
                        </div>

                        <div className="info">

                            <div className="float">
                                <div className="value" id="floatValue_1">                                       
                                    
                                </div>                                                                      
                                <div className="floatbar">
                                    <div class="indicator" id="floatIndicator_1" /*style="left: 0.890823px;"*/></div>                     
                                    <div class="fn"></div>
                                    <div class="mw"></div>
                                    <div class="ft"></div>
                                    <div class="ww"></div>
                                    <div class="bs"></div>
                                </div>
                            </div>
                            <div className="stickers">
                                
                            </div>
                                <div className="item">
                                <Link to={{
                                    pathname: "/item",
                                    state: {
                                        weaponname: this.props.weaponname, 
                                        skinname: this.props.skinname, 
                                        stattrak: this.props.stattrak, 
                                        wear: this.props.wear,
                                        url: this.props.url
                                    }
                                }}>
                                    <span className="condition" style={{...wearstyle}}>
                                        {wearmap.get(this.props.wear)}
                                    </span>
                                    <span style={{...namestyle}}>
                                        {this.props.weaponname} | {this.props.skinname}
                                    </span>
                                </Link>
                            </div>
                            <div className="actions">
                                <div class="button rounded" onClick={this.acceptOffer}>Acceptér tilbud</div>
                                <div class="button rounded" onClick={this.rejectOffer}>Afvis tilbud</div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

class Orders extends Component {
    constructor(props, context){
        super(props, context);
        this.deliverItem = this.deliverItem.bind()
    }

    deliverItem()
    {
        var postdata = {
            token: localStorage.getItem("token"),
            classid: this.props.classid
        }
        axios.post("/api/market/deliver", postdata).then(function(response){
            
        })
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

        var style = {
            backgroundImage: "url(" + this.props.url + ")",
            backgroundSize: "90%"
        }

        var wearstyle = {
            color: "rgb(226, 226, 226)",
            display: "block",
            fontFamily: "Rubik, sans-serif",
            fontSize: "11px",
            fontWeight: 400,
            height: "20px",
            lineHeight: "20px",
            textAlign: "left",
            textTransform: "uppercase",
            width: "272.297px"
        }

        var namestyle = {
            color: "rgb(226, 226, 226)",
            display: "block",
            fontFamily: "Montserrat, sans-serif",
            fontSize: "13px",
            fontWeight: 400,
            height: "20px",
            lineHeight: "20px",
            textAlign: "left",
            width: "288.297px",
            textTransform: "none"
        }

        var d = new Date(this.props.time)

        return(
            <>
                <div className="tr showInfo">
                    <div className="td">{addzero(d.getDate()) + "-" + addzero(d.getMonth() + 1) + "-" + d.getFullYear()}</div>
                    <div className="td">{addzero(d.getHours()) + ":" + addzero(d.getMinutes())}</div>
                    <div className="td">Salg <b>(Afventer din respons)</b></div>
                    <div className="td">+{this.props.price}</div>
                </div>
                <div className="tr info">
                    <div className="td"></div>
                    <div className="itemListing rounded">

                        <div className="imgBox rounded_l">
                            <div className="img rounded_l" style={{...style}}></div>
                        </div>

                        <div className="info">

                            <div className="float">
                                <div className="value" id="floatValue_1">                                       
                                    
                                </div>                                                                      
                                <div className="floatbar">
                                    <div class="indicator" id="floatIndicator_1" /*style="left: 0.890823px;"*/></div>                     
                                    <div class="fn"></div>
                                    <div class="mw"></div>
                                    <div class="ft"></div>
                                    <div class="ww"></div>
                                    <div class="bs"></div>
                                </div>
                            </div>
                            <div className="stickers">
                                
                            </div>
                                <div className="item">
                                <Link to={{
                                    pathname: "/item",
                                    state: {
                                        weaponname: this.props.weaponname, 
                                        skinname: this.props.skinname, 
                                        stattrak: this.props.stattrak, 
                                        wear: this.props.wear,
                                        url: this.props.url
                                    }
                                }}>
                                    <span className="condition" style={{...wearstyle}}>
                                        {wearmap.get(this.props.wear)}
                                    </span>
                                    <span style={{...namestyle}}>
                                        {this.props.weaponname} | {this.props.skinname}
                                    </span>
                                </Link>
                            </div>
                            <div className="actions">
                                <div class="button rounded" onClick={this.acceptOffer}>Levér genstand</div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

class Pending extends Component {
    constructor(props, context){
        super(props, context);
        this.state = {
            first: true,
            offers: [],
            orders: [],
            renderOffers: true,
            renderOrders: true
        }
        this.getOffers = this.getOffers.bind(this)
        this.getOrders = this.getOrders.bind(this)
        this.renderOffers = this.renderOffers.bind(this)
        this.renderOrders = this.renderOrders.bind(this)
    }

    getOffers()
    {
        let c = this
        axios.get("/api/market/offers", {
            params: {
                token: localStorage.getItem("token")
            }
        }).then(function(response){
            var data = Array()
            if(response.data.quantity === 0)
            {
                c.setState({ renderOffers: false })
            }
            else
            {
                for(var i = 0; i < response.data.length; i++)
                {
                    let item = response.data[i]
                    data.push(<Offers 
                        price={item.offer.offer} 
                        time={item.offer.time}
                        weaponname={item.weapon.weaponname}
                        skinname={item.weapon.skinname}
                        url={item.weapon.url}
                        float={item.weapon.float}
                        stattrak={item.weapon.stattrak}
                        wear={item.weapon.wear}
                        price={item.offer.offer} 
                        seller={item.buyer.name}
                        steamId={item.buyer.steamId}
                        steampic={item.buyer.url}
                        classid={item.weapon.classid}
                        time={item.offer.time}
                    />)
                }
                c.setState({ offers: data })
            }
        })
    }

    getOrders()
    {
        let c = this
        axios.get("/api/market/orders", {
            params: {
                token: localStorage.getItem("token")
            }
        }).then(function(response){
            var data = Array()
            if(response.data.quantity === 0)
            {
                c.setState({ renderOrders: false })
            }
            else
            {
                for(var i = 0; i < response.data.length; i++)
                {
                    let item = response.data[i]
                    data.push(<Orders 
                        time={item.offer.time}
                        weaponname={item.weapon.weaponname}
                        skinname={item.weapon.skinname}
                        url={item.weapon.url}
                        float={item.weapon.float}
                        stattrak={item.weapon.stattrak}
                        wear={item.weapon.wear}
                        price={item.offer.price} 
                        seller={item.buyer.name}
                        steamId={item.buyer.steamId}
                        steampic={item.buyer.url}
                        classid={item.weapon.classid}
                        time={item.offer.time}
                    />)
                }
                c.setState({ orders: data })
            }
        })
    }

    renderOffers()
    {
        if(this.state.renderOffers)
        {
            return(
                <>
                    <div className="header">Afventende tilbud</div>
                    <div className="table w100">
                        <div class="tr header">
                            <div class="td">Dato</div>
                            <div class="td">Klokkeslæt</div>
                            <div class="td">Type</div>
                            <div class="td">Beløb (DKK)</div>
                        </div>
                        {this.state.orders}
                    </div>
                </>
            )
        }
    }

    renderOrders()
    {
        if(this.state.renderOrders)
        {
            return(
                <>
                    <div className="header" style={{ marginTop: "25px" }}>Afventende salg</div>
                    <div className="table w100">
                        <div class="tr header">
                            <div class="td">Dato</div>
                            <div class="td">Klokkeslæt</div>
                            <div class="td">Type</div>
                            <div class="td">Beløb (DKK)</div>
                        </div>
                        {this.state.orders}
                    </div>
                </>
            )
        }
        if(!this.state.renderOffers && !this.state.renderOffers)
        {
            return(
                <h2>Der er ingen køb/salg/tilbud tilgængelige.</h2>
            )
        }
    }

    render()
    {
        if(this.state.first)
        {
            this.getOffers()
            this.getOrders()
            this.state.first = false
        }

        return(
            <div>
                <div className="subHeader">
                    CSGO Boost &gt; Afventende køb / salg
                </div>
                <div className="contentBox rounded">
                    {this.renderOffers()}
                    {this.renderOrders()}
                </div>
            </div>
        )
    }
}

export default Pending
