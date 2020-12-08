import React, { Component } from 'react'
import UserService from '../utils/user'
import ConnectionsService from '../utils/connections'
import { withRouter } from 'react-router-dom'
import { toast } from 'react-toastify';
import { Button, Avatar, Typography } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import './profile.css'

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

    getUserDetails() {
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
                        console.log(connectionStatus)
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


    componentDidMount() {
        this.getUserDetails()
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.getUserDetails()
        }
    }

    handleConnection = (id) => {
        console.log(id)
        let loggedUser = localStorage.getItem("loggedInUser")
        const connectionsService = new ConnectionsService()
        connectionsService.getUserConnections()
            .then((connections) => {
                let userConnections = connections.data.filter((connection) => {
                    return ((connection.from === id &&
                        connection.to === loggedUser) ||
                        (connection.to === id &&
                            connection.from === loggedUser)
                    )
                });
                if (!userConnections.length) {
                    connectionsService.createConnection(id)
                        .then((newConnection) => {
                            toast.success("Connection Requested")
                            this.setState({
                                status: 'pending'
                            })
                            return
                        })
                }
            })
    }

    render() {
        return (
            <div className='profile-container'>
                <Card>
                    <CardContent className='profile-section'>
                        <div className='avatar-section'>
                            <Avatar style={{ backgroundColor: 'rgba(9, 161, 245)', height: 100, width: 100, fontSize: 55 }}>{this.state.username.charAt(0)}</Avatar>
                            <Typography variant='h4' style={{ marginTop: '20%', color: 'rgba(9, 161, 245)' }}>{this.state.username}</Typography>
                        </div>
                        <div className='info-section'>
                            <Typography style={{ color: '#4B9FE1' }}>Name:</Typography>
                            <Typography>{this.state.firstName} {this.state.lastName}</Typography>
                            <Typography style={{ color: '#4B9FE1' }}>Email:</Typography>
                            <Typography>{this.state.email}</Typography>
                            <Typography style={{ color: '#4B9FE1' }}>I'm an:</Typography>
                            <Typography>{this.state.typeOfUser}</Typography>
                            <Typography style={{ color: '#4B9FE1' }}>Biography:</Typography>
                            <Typography>{this.state.bio}</Typography>
                            {
                                this.state.status === 'connected' ? <Button disabled variant='contained' style={{ backgroundColor: green[500], color: 'white', width: '52%' }}>Connected &#129309;</Button> :
                                    this.state.status === 'pending' ? <Button disabled variant='contained' style={{ width: '50%', backgroundColor: 'lightgrey', color: 'black' }}>Pending &#8987;</Button> :
                                        <Button size='small' variant='contained' style={{ backgroundColor: green[500], color: 'white', width: '50%' }} onClick={() => this.handleConnection(this.state.id)}>Connect <CheckCircleIcon /></Button>
                            }
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }
}

export default withRouter(UsersProfile);