import React, { Component } from 'react'
import UserService from '../utils/user'
import ConnectionsService from '../utils/connections'
import { withRouter } from 'react-router-dom'
import { toast } from 'react-toastify';
import { Button, Avatar, Typography } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
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
                            <Avatar style={{ height: 100, width: 100 }} />
                            <Typography variant='h4' color='secondary' style={{ marginTop: '20%' }}>{this.state.username}</Typography>
                        </div>
                        <div className='info-section'>
                            <Typography color='secondary'>Name:</Typography>
                            <Typography>{this.state.firstName} {this.state.lastName}</Typography>
                            <Typography color='secondary'>Email:</Typography>
                            <Typography>{this.state.email}</Typography>
                            <Typography color='secondary'>I'm an:</Typography>
                            <Typography>{this.state.typeOfUser}</Typography>
                            <Typography color='secondary'>Biography:</Typography>
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