import React, { Component } from 'react'
import AuthService from '../../utils/auth';
import { Link, withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, FormControl, TextField, Modal, Fade, Backdrop } from '@material-ui/core';
import Signup from './Signup';
import './login.css'

class Login extends Component {
    state = {
        username: '',
        password: '',
        open: false
    }

    modal = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }

    paper = {
        backgroundColor: "lightblue",
        /*         boxShadow: theme.shadows[5],
                padding: theme.spacing(2, 4, 3), */
        width: '40vw',
        height: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }
    handleOpen = () => {
        this.setState({
            open: true
        })
    };

    handleClose = () => {
        this.setState({
            open: false
        })
    };

    handleFormSubmit = (e) => {
        e.preventDefault();
        const { username, password } = this.state;
        const authService = new AuthService();
        authService.login(username, password)
            .then((res) => {
                let user = res.data;
                this.props.setCurrentUser(user);
                //save user id browser local storage
                localStorage.setItem('loggedInUser', user._id);
                this.props.history.push('/dashboard');
            })
            .catch(() => {
                toast.error('Invalid Login')
            })
    }

    render() {
        return (
            <div className='login-container'>
                <form onSubmit={this.handleFormSubmit} className='form-container'>
                    <FormControl style={{ width: '16vw' }}>
                        <TextField style={{ marginBottom: 30 }} color="primary" type="text" name="username" label='Username' value={this.state.username} onChange={this.handleChange} />
                        <TextField color="primary" type="password" name="password" label='Password' value={this.state.password} onChange={this.handleChange} />
                        <Button type="submit" color='primary' variant="contained" style={{ marginTop: 50, height: 45, fontSize: 18 }}>Login</Button>
                    </FormControl>
                </form>
                <div>
                    <p style={{ fontSize: 20, marginTop: -50 }}>Don't have account?
                        <Link to={"/"} onClick={this.handleOpen} style={{ textDecoration: 'none', color: 'blue' }}> Signup</Link>
                        <Modal
                            aria-labelledby="transition-modal-title"
                            style={this.modal}
                            aria-describedby="transition-modal-description"
                            open={this.state.open}
                            onClose={this.handleClose}
                            closeAfterTransition
                            BackdropComponent={Backdrop}
                            BackdropProps={{
                                timeout: 500,
                            }}
                        >
                            <Fade in={this.state.open}>
                                <div style={this.paper}>
                                    <Signup loggedInUser={this.props.loggedInUser} setCurrentUser={this.props.setCurrentUser} handleClose={this.handleClose} />
                                </div>
                            </Fade>
                        </Modal>
                    </p>
                </div>
            </div>
        )
    }
}

export default withRouter(Login);
