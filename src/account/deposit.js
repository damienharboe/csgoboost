import React, { Component } from "react"

class Deposit extends Component {
    render(){
        return(
            <div className="wrapper">
                <div className="subHeader">
                    CSGO Boost &gt; Indsæt balance
                </div>
                <div className="contentBox rounded">
                    <div className="header">
                        Indsæt balance
                    </div>
                    <form>
                        <div className="subtext flexsplit">
                            <div>
                                <p>Indtast det beløb du ønsker at indsætte på din CSGO Boost konto</p>
                                <span className="inputLabel">
                                    Beløb <span className="star">*</span>
                                </span>
                                <input className="rounded" type="text" required={true} placeholder="Indtast det beløb du ønsker at indsætte" />
                                <span className="inputLabel">
                                    Acceptér <a href="terms.html">handelsbetingelser</a> <span className="star">*</span>
                                </span>
                                <div className="center">
                                    <input className="rounded" type="checkbox" required={true} style={{width: "30px"}} />
                                </div>
                            </div>
                            <div>
                                <span className="inputLabel">
                                    Beløb der indsættes på konto
                                </span>
                                <input className="rounded" type="text" disabled={true} />
                                <span className="inputLabel">
                                    Håndteringsgebyr
                                </span>
                                <input className="rounded" type="text" disabled={true} />
                                <span className="inputLabel">
                                    Beløb til betaling
                                </span>
                                <input className="rounded" type="text" disabled={true} />
                            </div>
                        </div>
                        <div className="flexright">
                            <input type="submit" className="button rounded" value="Gå til betaling" />
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default Deposit
