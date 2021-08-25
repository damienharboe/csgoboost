import React, { Component } from "react"

class History extends Component {
    render(){
        return(
            <div className="wrapper">
                <div class="subHeader">
                    CSGO Boost &gt; Købshistorik
                </div>
                <div className="contentBox rounded">
                    <div class="header">
                        Købshistorik
                    </div>
                    <div className="table w100">
                        <div class="tr header">
                            <div class="td">Dato</div>
                            <div class="td">Klokkeslæt</div>
                            <div class="td">Type</div>
                            <div class="td">Beløb (DKK)</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default History
