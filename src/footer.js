import React, { Component } from "react"

class Footer extends Component {
    render(){
        return(
            <div className="footer">
                <div className="content">
                    <div className="left">
                        <a href="news.html">Nyheder</a>
                        <a href="about.html">Om CSGO Boost</a>
                        <a href="terms.html">Handelsbetingelser</a>
                        <a href="contact.html">Kontakt</a>
                    </div>
                    <div className="right">
                        <span>© CSGO Boost 2020</span>
                        <span>Powered by Steam</span>
                        <span>Not affiliated with Valve Corporation</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default Footer
