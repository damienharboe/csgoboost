import axios from "axios";
import React, { Component } from "react"
import deagle from '.\\gfx\\DEAGLE.png'

class SortingMenu extends Component {
    render(){
        return(
            <div className="sortingMenu inventory rounded noselect">
                <span className="searchParent">
                    <form>
                        <input className="search rounded_l" type="text" placeholder="Indtast søgeord" />
                        <input type="submit" className="searchButton rounded_r" value="Søg" />
                    </form>
                </span>
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

class Item extends Component {
    constructor(props, context){
        super(props, context);
        this.showSellDialog = this.showSellDialog.bind(this)
        this.updateOrSell = this.updateOrSell.bind(this)
        this.isStattrak = this.isStattrak.bind(this)
        this.isSelling = this.isSelling.bind(this)
        this.renderFloat = this.renderFloat.bind(this)
        this.sell = this.sell.bind(this)
        this.delete = this.delete.bind(this)
        this.update = this.update.bind(this)
        this.state = { showSell: false, first: true, classid: this.props.classid, price: "" }
    }

    sell()
    {
        let postdata = {
            token: localStorage.getItem("token"),
            classid: this.state.classid,
            price: parseInt(this.state.price)
        }
        axios.post("/api/market/new", postdata).then(function(response){
            alert(response.success)
        })
    }

    delete()
    {
        let postdata = {
            token: localStorage.getItem("token"),
            classid: this.state.classid
        }
        axios.post("/api/market/delete", postdata).then(function(response){

        })
    }

    update()
    {
        let postdata = {
            token: localStorage.getItem("token"),
            classid: this.state.classid,
            price: parseInt(this.state.price)
        }
        axios.post("/api/market/edit", postdata).then(function(response){
            
        })
    }

    updateOrSell()
    {
        console.log(this.props.selling)
        if(this.props.selling)
        {
            return(
                <div className="wrapper">
                    <input type="text" className="rounded" placeholder="Pris" onChange={(e) => this.setState({ price: e.target.value })} defaultValue={this.props.price} />
                    <div className="updateParent">
                          <div className="button delete rounded" onClick={this.delete}>Slet</div>
                          <div className="button update rounded" onClick={this.update}>Opdater</div>
                    </div>
                </div>
            )
        }
        else
        {
            return(
                <div className="wrapper">
                    <input type="text" className="rounded" placeholder="Pris" onChange={(e) => this.setState({ price: e.target.value })} defaultValue={this.state.price} />
                    <div className="updateParent">
                        <div className="button sell rounded" onClick={this.sell}>Sæt til salg</div>
                    </div>
                </div>
            )
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

    isSelling()
    {
        if(this.props.selling)
        {
            return(
                <div className="forSale">Sælges: {this.props.price} DKK</div>
            )
        }
    }

    showSellDialog()
    {
        if(this.state.showSell)
        {
            this.setState({ showSell: false })
        }
        else {
            this.setState({ showSell: true })
        }
    }

    renderFloat()
    {

        if(this.props.float != -1)
        {
            console.log(this.props.float)
            var floatbarthign = this.props.float * 168 + "px"

            return(
                <div className="float">
                    <div className="floatbar w170">
                        <div className="indicator" id="floatIndicator_0" style={{left: floatbarthign}}></div>
                        <div className="fn"></div>
                        <div className="mw"></div>
                        <div className="ft"></div>
                        <div className="ww"></div>
                        <div className="bs"></div>
                    </div>
                    <div className="value" id="floatValue_0">
                        {this.props.float}
                    </div>
                </div>
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

        var c = "sellBox rounded_r update "
        if(!this.state.showSell)
            c += "hidden"
        
        return(
            <div className="item">
                <div className="itemBox st fs" onClick={this.showSellDialog}>
                    <div className="imgBox rounded_t">
                        <div className={"rounded_b condition " + colmap.get(this.props.wear)}>
                            {wearmap.get(this.props.wear)}
                        </div>
                        <div className="img" style={{...bgstyle}}></div>
                        {this.isStattrak()}
                        {this.isSelling()}
                    </div>
                    <div className="textBox rounded_b">
                        <div className="text weapon">
                            {this.props.wname}
                        </div>
                        <div className="text skin">
                            {this.props.sname}
                        </div>
                        {this.renderFloat()}
                    </div>
                </div>
                <div className={c}>
                    <div className="info">
                        <span>Paint index: <b>{this.props.paintIndex}</b></span>
                        <span>Pattern ID: <b>{this.props.patternID}</b></span>
                    </div>
                    {this.updateOrSell()}
                </div>
            </div>
        )
    }
}

class Inventar extends Component {
    constructor(props, context){
        super(props, context);
        this.getInventory = this.getInventory.bind(this)
        this.renderInventory = this.renderInventory.bind(this)
        this.state = { first: true, data: [] }
    }

    getInventory()
    {
        if(localStorage.getItem("token") !== null)
        {
            let c = this
            axios.get("/api/user/inventory", {
                params: {
                    token: localStorage.getItem("token")
                }
            }).then(function(response){
                console.log(response.data)
                c.setState({data : response.data})
            })
        }
    }

    renderInventory()
    {
        var c = this
        if(localStorage.getItem("token") === null)
        {
            return(
                <p>Du skal logge ind for at se inventory</p>
            )
        }
        else
        {
            return(
                <div className="itemParent noselect">
                    {c.state.data.map(element => (
                        <Item
                            key={element.name}
                            stattrak={element.stattrak} 
                            selling={element.selling} 
                            price={element.price} 
                            wear={element.wear} 
                            float={element.float} 
                            wname={element.weaponname} 
                            sname={element.skinname} 
                            paintIndex="449" 
                            patternID="137"
                            url={element.url}
                            classid={element.classid}
                        />
                    ))}
                </div>
            )
        }
    }

    render(){
        if(this.state.first)
        {
            this.state.first = false
            this.getInventory()
        }

        return(
            <div className="wrapper">
                <div className="subHeader">
                    CSGO Boost &gt; Inventar
                </div>
                <SortingMenu />
                {this.renderInventory()}
            </div>
        )
    }
}

export default Inventar
