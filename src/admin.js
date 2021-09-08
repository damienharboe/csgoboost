import axios from "axios";
import React, { Component } from "react"

class UserEdit extends Component {
    render()
    {
        return(
            <>
                
            </>
        )
    }
}

class Admin extends Component {
    render()
    {
        return(
            <>
                <div className="subHeader">CSGO Boost &gt; Admin</div>
                <div className="contentBox rounded">
                    <div className="header nodot">Bruger:</div>
                    <label for="userlookup">Søg efter bruger: </label>
                    <input type="text" className="rounded" style={{ marginLeft: "4px", marginRight: "4px", marginBottom: "10px" }} id="userlookup" />
                    <button style={{ backgroundColor: "#25818a", border: "none" }} className="button rounded">Søg</button>
                    <UserEdit />
                </div>
                <div className="contentBox rounded" style={{ marginTop: "10px"}}>
                    <div className="header nodot">Globale indstillinger:</div>
                    <label for="globalfee">Default fee på hele siden (%): </label>
                    <input type="text" className="rounded" style={{ marginLeft: "4px", marginBottom: "10px" }} id="globalfee" /> 
                    <br />
                    <label for="namefee">Fee hvis bruger har CSGOBOOST.DK i deres brugernavn (%): </label>
                    <input type="text" className="rounded" style={{ marginLeft: "4px" }} id="namefee" />

                    <br /> <br />
                    <button style={{ backgroundColor: "#25818a", border: "none" }} className="button rounded">Gem ændringer</button>
                </div>
            </>
        )
    }
}

export default Admin
