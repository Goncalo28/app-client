import React, { Component } from 'react'
import UserService from '../utils/user'
import ConnectionsService from '../utils/connections'

class UsersProfile extends Component {
    state = {
        username: "",
        email: "",
        firstName: "",
        lastName: "",
        bio: "",
        typeOfUser: "",
        connections: [],
        id: ""
    };


    componentDidMount() {
        const id = this.props.match.params.id;
        const userService = new UserService();
        userService.getUser(id)
            .then((user) => {
                console.log(user)
                this.setState({
                    username: user.data.username,
                    email: user.data.email,
                    firstName: user.data.firstName,
                    lastName: user.data.lastName,
                    bio: user.data.bio,
                    typeOfUser: user.data.typeOfUser,
                    connections: user.data.connections,
                    id: user.data._id
                })
            })

    }

    handleConnection = (id) => {
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
                            console.log('Connection made', newConnection)
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
                <button onClick={() => this.handleConnection(this.state.id)}>Connect</button>
            </div>
        );
    }
}

export default UsersProfile;