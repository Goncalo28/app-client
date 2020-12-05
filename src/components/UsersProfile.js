import React, { Component } from 'react'
import UserService from '../utils/user'
import ConnectionsService from '../utils/connections'
import { withRouter } from 'react-router-dom'
import { toast } from 'react-toastify';

class UsersProfile extends Component {
    state = {
        username: "",
        email: "",
        firstName: "",
        lastName: "",
        bio: "",
        typeOfUser: "",
        connections: [],
        id: "",
        status: ""
    };

    componentDidMount() {
        const id = this.props.match.params.id;
        if (id === localStorage.getItem("loggedInUser")) {
            this.props.history.push("/profile")
        }
        let connectionStatus = "";
        const userService = new UserService();
        userService.getUser(id)
            .then((user) => {
                const connectionsService = new ConnectionsService()
                connectionsService.getUserConnections()
                    .then((connections) => {
                        let userConnections = connections.data.filter((connection) => {
                            return ((connection.from === id &&
                                connection.to === localStorage.getItem("loggedInUser")) ||
                                (connection.to === id &&
                                    connection.from === localStorage.getItem("loggedInUser")
                                )
                            );
                        })
                        if (userConnections.length > 0) {
                            connectionStatus = "pending"
                        }
                        if (user.data.connections.includes(localStorage.getItem("loggedInUser")) && connectionStatus !== "pending") {
                            connectionStatus = "connected"
                        } else if (!user.data.connections.includes(localStorage.getItem("loggedInUser")) && connectionStatus !== "pending") {
                            connectionStatus = "notConnected"
                        }
                        console.log(user)
                        this.setState({
                            username: user.data.username,
                            email: user.data.email,
                            firstName: user.data.firstName,
                            lastName: user.data.lastName,
                            bio: user.data.bio,
                            typeOfUser: user.data.typeOfUser,
                            connections: user.data.connections,
                            id: user.data._id,
                            status: connectionStatus
                        })
                    })
            })
    }

    handleConnection = (id) => {
        console.log(id)
        let loggedUser = localStorage.getItem("loggedInUser")
        const connectionsService = new ConnectionsService()
        connectionsService.getUserConnections()
            .then((connections) => {
                let userConnections = connections.data.filter((connection) => {
                    return ((connection.from === id &&
                        connection.to === loggedUser._id) ||
                        (connection.to === id &&
                            connection.from === loggedUser._id)
                    )
                });
                if (!userConnections.length) {
                    connectionsService.createConnection(id)
                        .then((newConnection) => {
                            toast.success("Connection Requested")
                            return
                        })
                }

            })
    }

    render() {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <h2>{this.state.username}</h2>
                <p>{this.state.firstName}</p>
                <p>{this.state.lastName}</p>
                <p>{this.state.email}</p>
                <p>{this.state.typeOfUser}</p>
                <p>{this.state.bio}</p>
                {
                    this.state.status === 'connected' ? <p>You're already connected</p> :
                        this.state.status === 'pending' ? <p>Waiting</p> :
                            <button onClick={() => this.handleConnection(this.state.id)}>Connect</button>
                }
            </div>
        );
    }
}

export default withRouter(UsersProfile);