import React, { Component } from 'react'
import UserService from '../utils/user'
import ConnectionsService from '../utils/connections'

class Profile extends Component {
    state = {
        username: "",
        email: "",
        firstName: "",
        lastName: "",
        bio: "",
        typeOfUser: "",
        connections: [],
        pendingConnections: []
    };


    componentDidMount() {
        const id = localStorage.getItem('loggedInUser')
        const userService = new UserService();
        let userPromise = userService.getUser(id)
        const connectionsService = new ConnectionsService()
        let connectionPromise = connectionsService.getUserConnections()
        Promise.all([userPromise, connectionPromise]).then(values => {
            let { username, email, firstName, lastName, bio, typeOfUser, connections } = values[0].data;
            let userConnections = values[1].data.map((connection) => {
                if (connection.from === id) {
                    return connection.to
                } else {
                    return connection.from
                }
            })
            this.setState({
                username: username,
                email: email,
                firstName: firstName,
                lastName: lastName,
                bio: bio,
                typeOfUser: typeOfUser,
                connections: connections,
                pendingConnections: userConnections
            })
        })
    }

    handleGetPendingUsers = () => {

    }


    render() {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }} >
                <h2>{this.state.username}</h2>
                <p>{this.state.firstName}</p>
                <p>{this.state.lastName}</p>
                <p>{this.state.email}</p>
                <p>{this.state.typeOfUser}</p>
                <p>{this.state.bio}</p>
                <button onClick={this.handleGetPendingUsers}>Pending</button>
            </div>
        );
    }
}

export default Profile;