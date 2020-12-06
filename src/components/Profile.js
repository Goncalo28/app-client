import React, { Component } from "react";
import UserService from "../utils/user";
import ConnectionsService from "../utils/connections";
import { toast } from 'react-toastify';
import { Button, Avatar, Typography } from '@material-ui/core';
import { green, red } from '@material-ui/core/colors';
import './profile.css'
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ClearIcon from '@material-ui/icons/Clear';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

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
            <div className='profile-container'>
                <Card >
                    <CardContent className='profile-section'>
                        <div className='avatar-section'>
                            <Avatar style={{ height: 100, width: 100 }} />
                            <Typography variant='h4' color='primary' style={{ marginTop: '20%' }}>{this.state.username}</Typography>
                        </div>
                        <hr style={{ width: 1, height: '100%', backgroundColor: 'lightgrey', border: 'none', marginRight: 10, marginLeft: -45 }} />
                        <div className='info-section'>
                            <Typography color='primary'>Name:</Typography>
                            <Typography>{this.state.firstName} {this.state.lastName}</Typography>
                            <Typography color='primary'>Email:</Typography>
                            <Typography>{this.state.email}</Typography>
                            <Typography color='primary'>I'm an:</Typography>
                            <Typography>{this.state.typeOfUser}</Typography>
                            <Typography color='primary'>Biography:</Typography>
                            <Typography>{this.state.bio}</Typography>
                        </div>
                    </CardContent>
                    <Card >
                        <CardContent>
                            <Typography variant='h6'>Pending requests:</Typography>
                            {this.state.pendingConnections.map((connection, index) => {
                                if (connection.from) {
                                    return (
                                        <div>
                                            <Card key={connection.id} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginTop: '3%', alignItems: 'center', height: 50 }}>
                                                <Typography variant='body1'>Sent to:</Typography>
                                                <Typography variant='body1' style={{ fontSize: 15 }}>{connection.user}</Typography>
                                                <CardMedia><Avatar /></CardMedia>
                                            </Card>
                                        </div>

                                    )
                                } else {
                                    return (
                                        <Card key={connection.id} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: '3%', alignItems: 'center', height: 50 }}>
                                            <Typography variant='body1'>From:</Typography>
                                            <CardMedia><Avatar /></CardMedia>
                                            <Typography variant='body1' style={{ fontSize: 15 }}>{connection.user}</Typography>
                                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                <Button size='small' variant='contained' style={{ backgroundColor: green[500], color: 'white', marginRight: 20 }} onClick={() => this.handleAccept(connection.id, connection, index)}><CheckCircleIcon /></Button>
                                                <Button size='small' variant='contained' style={{ backgroundColor: red[500], color: 'white' }} onClick={() => this.handleDecline(connection.id, index)}><ClearIcon /></Button>
                                            </div>
                                        </Card>
                                    )
                                }

                            })
                            }
                        </CardContent>
                    </Card>
                </Card>
            </div>
        );
    }
}

export default Profile;
