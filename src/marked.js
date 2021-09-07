import React, { Component } from "react"
import { NavLink } from "react-router-dom"
import deagle from '.\\gfx\\DEAGLE.png'
const axios = require("axios")

class SkinSelect extends Component {
    constructor(props, context){
        super(props, context);
        this.state = {
            // Active classes
            categories: {
                knive: "category knive",
                pistol: "category pistol",
                riffel: "category riffel",
                smg: "category smg",
                shotgun: "category shotgun",
                lmg: "category lmg",
                handsker: "category handsker",
                sticker: "category sticker",
                mere: "category mere"
            },
        }
        this.toggleOnOff = this.toggleOnOff.bind(this)
    }

    toggleOnOff(name, index)
    {
        var p = this.state.categories
        if(p[name].indexOf("active") == -1)
        {
            for (const key in p)
            {
                p[key] = "category " + key
            }
            p[name] = "category " + name + " active"
            this.props.callback(index)
        }
        else
        {
            p[name] = "category " + name
            this.props.callback(-1)
        }
        this.setState({p})
    }

    render(){
        return(
            <div className="skinSelect rounded noselect">
                <span onClick={() => this.toggleOnOff("knive", 0)} className={this.state.categories.knive}>
                    knive
                </span>
                <span onClick={() => this.toggleOnOff("pistol", 1)} className={this.state.categories.pistol}>
                    pistoler
                </span>
                <span onClick={() => this.toggleOnOff("riffel", 2)} className={this.state.categories.riffel}>
                    rifler
                </span>
                <span onClick={() => this.toggleOnOff("smg", 3)} className={this.state.categories.smg}>
                    smg'er
                </span>
                <span onClick={() => this.toggleOnOff("shotgun", 4)} className={this.state.categories.shotgun}>
                    shotguns
                </span>
                <span onClick={() => this.toggleOnOff("lmg", 5)} className={this.state.categories.lmg}>
                    lmg'er
                </span>
                <span onClick={() => this.toggleOnOff("handsker", 6)} className={this.state.categories.handsker}>
                    handsker
                </span>
                <span onClick={() => this.toggleOnOff("sticker", 7)} className={this.state.categories.sticker}>
                    stickers
                </span>
                <span onClick={() => this.toggleOnOff("mere", 8)} className={this.state.categories.mere}>
                    andet
                </span>
            </div>
        )
    }
}

class SubMenu extends Component {
    constructor(props, context){
        super(props, context)
        this.state = {
            quality: -1,
            vquality: "Kvalitet",
            rarity: -1,
            vrarity: "Kategori",
            wear: -1,
            vwear: "Stand",
            searchquery: ""
        }
        this.search = this.search.bind(this)
    }

    componentDidUpdate(prevProps, prevState)
    {
        if(prevState.quality != this.state.quality || prevState.rarity != this.state.rarity || prevState.wear != this.state.wear)
        {
            this.props.callback(this.state.quality, this.state.rarity, this.state.wear)
        }
    }

    search()
    {
        this.props.search(this.state.searchquery)
    }

    render(){
        return(
            <div className="subMenu noselect">
                <span className="searchParent">
                    <input className="search rounded_l" type="text" placeholder="Indtast søgeord" onChange={(e) => this.setState({ searchquery: e.target.value })} />
                    <button className="searchButton rounded_r" onClick={this.search}>Søg</button>
                </span>
                <span className="dropDownParent">
                    <span className="dropDown">
                        <span className="trigger rounded z5">
                            {this.state.vquality}
                        </span>
                        <div className="content rounded_b z4">
                            <a onClick={() => this.setState({ quality: -1, vquality: "Alle" })} style={{color: "#ffffff"}}>Alle</a>
                            <a onClick={() => this.setState({ quality: 0, vquality: "Forbrugerkvalitet" })} style={{color: "#b0c3d9"}}>Forbrugerkvalitet</a>
                            <a onClick={() => this.setState({ quality: 1, vquality: "Mil-spec-kvalitet" })} style={{color: "#4b69ff"}}>Mil-spec-kvalitet</a>
                            <a onClick={() => this.setState({ quality: 2, vquality: "Industrikvalitet" })} style={{color: "#5e8aa7"}}>Industrikvalitet</a>
                            <a onClick={() => this.setState({ quality: 3, vquality: "Begrænset" })} style={{color: "#8840c9"}}>Begrænset</a>
                            <a onClick={() => this.setState({ quality: 4, vquality: "Klassificeret" })} style={{color: "#b12be6"}}>Klassificeret</a>
                            <a onClick={() => this.setState({ quality: 5, vquality: "Tilsløret" })} style={{color: "#df4b4b"}}>Tilsløret</a>
                            <a onClick={() => this.setState({ quality: 6, vquality: "Smuglergods" })} style={{color: "#e4ae3a"}}>Smuglergods</a>
                            <a onClick={() => this.setState({ quality: 7, vquality: "Ekstraordinær" })} style={{color: "#eb453b"}}>Ekstraordinær</a>
                        </div>
                    </span>
                    <span className="dropDown">
                        <span className="trigger rounded z5">
                            {this.state.vrarity}
                        </span>
                        <div className="content rounded_b z4">
                            <a onClick={() => this.setState({ rarity: -1, vrarity: "Alle" })} style={{color: "#ffffff"}}>Alle</a>
                            <a onClick={() => this.setState({ rarity: 0, vrarity: "Normal" })} style={{color: "#b2acae"}}>Normal</a>
                            <a onClick={() => this.setState({ rarity: 1, vrarity: "StatTrack™" })} style={{color: "#cf6a33"}}>StatTrack™</a>
                            <a onClick={() => this.setState({ rarity: 2, vrarity: "Souvenir" })} style={{color: "#ffb829"}}>Souvenir</a>
                            <a onClick={() => this.setState({ rarity: 3, vrarity: "★" })} style={{color: "#8840c9"}}>★</a>
                            <a onClick={() => this.setState({ rarity: 4, vrarity: "★ StatTrack™" })} style={{color: "#8650ac"}}>★ StatTrack™</a>
                        </div>
                    </span>

                    <span className="dropDown">
                        <span className="trigger rounded z5">
                            {this.state.vwear}
                        </span>
                        <div className="content rounded_b z4">
                            <a onClick={() => this.setState({ wear: -1, vwear: "Alle" })} style={{color: "#ffffff"}}>Alle</a>
                            <a onClick={() => this.setState({ wear: 0, vwear: "Fabriksny" })} style={{color: "#008000"}}>Fabriksny</a>
                            <a onClick={() => this.setState({ wear: 1, vwear: "Lidt slidt" })} style={{color: "#5cb85c"}}>Lidt slidt</a>
                            <a onClick={() => this.setState({ wear: 2, vwear: "Afprøvet i marken" })} style={{color: "#f0ad4e"}}>Afprøvet i marken</a>
                            <a onClick={() => this.setState({ wear: 3, vwear: "Velbrugt" })} style={{color: "#d9534f"}}>Velbrugt</a>
                            <a onClick={() => this.setState({ wear: 4, vwear: "Kampvansiret" })} style={{color: "#993a38"}}>Kampvansiret</a>
                            <a onClick={() => this.setState({ wear: 5, vwear: "Ikke malet" })} style={{color: "#b2acae"}}>Ikke malet</a>
                        </div>
                    </span>
                </span>
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
                        Sæt prisgrænse
                    </span>
                    <input className="rounded" type="text" placeholder="Min. pris" id="pricemin" onFocus="setMinPrice('pricemin', 'pricemax')" />
                     -
                    <input className="rounded" type="text" placeholder="Maks pris" id="pricemax" onBlur="setMaxPrice('pricemin', 'pricemax')" />
                </div>
                <div className="sortingParent">
                    <span className="text">
                        Sorter efter
                    </span>
                    <span className="dropDown sortingDropDown" style={{marginLeft: "15px"}}>
                        <span className="trigger rounded z3">
                            Relevans
                        </span>
                        <div className="content rounded_b z2">
                            <a href="">Relevans</a>
                            <a href="">Dato tilføjet</a>
                            <a href="">Pris</a>
                        </div>
                    </span>
                    <span className="dropDown" style={{width: "50px!important"}}>
                        <span className="trigger sortingOrder rounded"><div className="sortingImg">&nbsp;</div></span>
                    </span>
                </div>
            </div>
        )
    }
}

class ItemBox extends Component {
    constructor(props, context){
        super(props, context);
        this.isStattrak = this.isStattrak.bind(this)
        //this.renderFloat = this.renderFloat.bind(this)
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

    render(){
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
            backgroundSize: "80%",
            backgroundRepeat: 'no-repeat',
            marginTop: "-10px",
            paddingTop: "0px"
        }

        let c = "rounded_b condition " + this.props.w
        return(
            <NavLink to={{
                pathname:"/item",
                state: { 
                    weaponname: this.props.weaponname, 
                    skinname: this.props.skinname, 
                    stattrak: this.props.stattrak, 
                    wear: this.props.wear,
                    url: this.props.url
                }
            }}>
                <div className="itemBox">
                    <div className="imgBox rounded_t">
                        <div className={"rounded_b condition " + colmap.get(this.props.wear)}>
                            {wearmap.get(this.props.wear)}
                        </div>
                        <div className="img" style={{...bgstyle}}></div>
                        {this.isStattrak()}
                    </div>
                    <div className="textBox rounded_b">
                        <div className="text weapon">
                            {this.props.weaponname}
                        </div>
                        <div className="text skin">
                            {this.props.skinname}
                        </div>
                        <div className="text price">
                            <span className="dkk">DKK</span> {this.props.price}
                        </div>
                        <div className="text stock">
                            <span className="x">x</span>{this.props.quantity}
                        </div>
                    </div>
                </div>
            </NavLink>
        )
    }
}

class Marked extends Component {
    constructor(props, context){
        super(props, context);
        this.updateType = this.updateType.bind(this)
        this.getMarketPlace = this.getMarketPlace.bind(this)
        this.search = this.search.bind(this)
        this.state = { 
            arr: [],
            quality: -1,
            rarity: -1,
            wear: -1,
            type: -1,
            searchquery: ""
        }
        this.firstCall = true
    }

    search(query)
    {
        this.getMarketPlace(this.state.quality, this.state.rarity, this.state.wear, this.state.type, query)
    }

    updateType(type)
    {
        this.getMarketPlace(this.state.quality, this.state.rarity, this.state.wear, type)
    }

    getMarketPlace(quality, rarity, wear, type=222, searchquery="")
    {
        this.setState({
            rarity: rarity,
            quality: quality,
            wear: wear
        })

        let c = this
        let obj = {
            rarity: -1,
            quality: -1,
            wear: -1,
            type: this.state.type,
            searchquery: this.state.searchquery
        }
        if(rarity != undefined)
        {
            obj.rarity = rarity;
        }
        if(quality != undefined)
        {
            obj.quality = quality;
        }
        if(wear != undefined)
        {
            obj.wear = wear;
        }
        if(type != 222)
        {
            obj.type = type
            this.setState({ type: type })
        }
        obj.searchquery = searchquery
        this.setState({ searchquery: searchquery })
        axios.get("/api/market", {
            params: {
                wear: obj.wear,
                quality: obj.quality,
                rarity: obj.rarity,
                type: obj.type,
                searchquery: obj.searchquery
            }
        }).then(function(response){
            let arr = []
            // For each item
            for (var i = 0; i < response.data.length; i++)
            {
                let item = response.data[i]
                arr.push(<ItemBox 
                    weaponID={item.listingid} 
                    quantity={item.amount} 
                    price={item.price} 
                    wear={item.wear} 
                    weaponname={item.weaponname} 
                    skinname={item.skinname} 
                    url={item.url}
                    stattrak={item.stattrak}
                />)
            }
            c.setState({ arr: arr })
        })
    }

    render(){
        if(this.firstCall)
        {
            this.getMarketPlace()
            this.firstCall = false
        }
        return(
            <div className="wrapper">
                <div className="subHeader">
                    CSGO Boost &gt; Marked
                </div>
                <div className="marketMenu rounded">
                    <SkinSelect callback={this.updateType} />
                    <SubMenu callback={this.getMarketPlace} search={this.search} />
                </div>
                <SortingMenu />
                <div className="itemParent noselect">
                    {this.state.arr}
                </div>
            </div>
        )
    }
}

export default Marked
