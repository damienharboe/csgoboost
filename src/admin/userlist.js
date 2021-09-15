import axios from "axios"
import React, { Component } from "react"
import { NavLink } from "react-router-dom"

class User extends Component {
    render()
    {
        return(
            <tr>
                <td>{this.props.username}</td>
                <td>{this.props.steamId}</td>
                <td>
                    <NavLink to={{
                        pathname: "/admin/edituser",
                        state: {
                            steamId: this.props.steamId,
                            username: this.props.username
                        }
                    }}>
                        <button>Gå til bruger</button>
                    </NavLink>
                </td>
            </tr>
        )
    }
}

class UserList extends Component {
    constructor(props, context){
        super(props, context)
        this.getUserList = this.getUserList.bind(this)
        this.state = {
            first: true,
            users: []
        }
    }

    getUserList()
    {
        let c = this
        axios.get("/api/admin/users", {
            params: {
                token: localStorage.getItem("token")
            }
        }).then((response) => {
            let users = Array()
            response.data.forEach(element => {
                console.log(element)
                users.push(<User 
                    username={element.name}
                    steamId={element.steamId}  
                />)
            })
            c.setState({ users: users })
        })
    }

    render()
    {
        if(this.state.first)
        {
            this.getUserList()
            this.setState({ first: false })
        }

        console.log(this.state.users)

        return(
            <>
                <div className="subHeader">
                    CSGO Boost &gt; Admin &gt; Brugerliste
                </div>
                <table style={{ marginTop: "20px" }}>
                    <tr>
                        <th>Brugernavn</th>
                        <th>Steam ID</th>
                        <th>Edit</th>
                    </tr>
                    {this.state.users}
                </table>
            </>
        )
    }
}

export default UserList