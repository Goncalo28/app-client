import React, { Component } from "react";
import UserService from "../utils/user";
import ConnectionsService from "../utils/connections";
import { toast } from 'react-toastify';

class Profile extends Component {
    state = {
        username: "",
        email: "",
        firstName: "",
        lastName: "",
        bio: "",
        typeOfUser: "",
        connections: [],
        pendingConnections: [],
    };

    userService = new UserService();

    componentDidMount() {
        const id = localStorage.getItem("loggedInUser");
        let userPromise = this.userService.getUser(id);
        const connectionsService = new ConnectionsService();
        let connectionPromise = connectionsService.getUserConnections();
        Promise.all([userPromise, connectionPromise]).then((values) => {
            let {
                username,
                email,
                firstName,
                lastName,
                bio,
                typeOfUser,
                connections,
            } = values[0].data;

            let userConnections = values[1].data.map((connection) => {
                if (connection.from === id) {
                    return { user: connection.to, id: connection._id, from: true };
                } else {
                    return { user: connection.from, id: connection._id, from: false };
                }
            });

            const promisesUserConnections = [];
            userConnections.forEach((connection) => {
                promisesUserConnections.push(this.userService.getUser(connection.user))
            });

            Promise.all(promisesUserConnections).then((response) => {
                response.forEach((user, index) => {
                    userConnections[index].user = user.data.username;
                    userConnections[index].userId = user.data._id;
                    userConnections[index].connections = user.data.connections;
                });
                console.log(userConnections)

                this.setState({
                    username: username,
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    bio: bio,
                    typeOfUser: typeOfUser,
                    connections: connections,
                    pendingConnections: userConnections,
                });
            });
        });
    }

    handleAccept = (id, connection, index) => {

        const loggedInUser = localStorage.getItem("loggedInUser")
        connection.connections.push(loggedInUser)
        console.log(connection)
        const connectionsService = new ConnectionsService();
        let newPending = [...this.state.pendingConnections];
        newPending.splice(index, 1)
        let newConnections = [...this.state.connections];
        newConnections.push(connection.userId)
        console.log(`ID of user NOT LOGGED IN: ${connection.userId}`)
        console.log(`ID of user LOGGED IN: ${loggedInUser}`)
        let userLoggedInPromise = this.userService.editUser(loggedInUser, { $push: { connections: connection.userId } })
        let otherUserPromise = this.userService.editUser(connection.userId, { $push: { connections: loggedInUser } })
        let connectionPromise = connectionsService.deleteConnection(id)
        Promise.all([userLoggedInPromise, otherUserPromise, connectionPromise]).then((values) => {
            console.log(values)
            this.setState({
                connections: newConnections,
                pendingConnections: newPending
            })
            toast.success("HELL YEAH! I LOVE THAT GUY!")
        })
    }

    handleDecline = (id, index) => {
        const connectionsService = new ConnectionsService();
        let newPending = [...this.state.pendingConnections]
        newPending.splice(index, 1)
        this.setState({
            pendingConnections: newPending
        })
        connectionsService.deleteConnection(id)
            .then(() => {
                toast.success("HELL YEAH! FUCK THAT GUY")
            })
    }


    render() {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                }}
            >
                <h2>{this.state.username}</h2>
                <p>{this.state.firstName}</p>
                <p>{this.state.lastName}</p>
                <p>{this.state.email}</p>
                <p>{this.state.typeOfUser}</p>
                <p>{this.state.bio}</p>
                <h4>Pending:</h4>
                { this.state.pendingConnections.map((connection, index) => {

                    if (connection.from) {
                        return (
                            <div key={connection.id}>
                                <p>{connection.user}</p>

                            </div>
                        )
                    } else {
                        return (
                            <div key={connection.id}>
                                <p>{connection.user}</p>
                                <button onClick={() => this.handleAccept(connection.id, connection, index)}>Accept</button>
                                <button onClick={() => this.handleDecline(connection.id, index)}>Decline</button>
                            </div>
                        )
                    }

                })

                }
            </div>
        );
    }
}

export default Profile;
