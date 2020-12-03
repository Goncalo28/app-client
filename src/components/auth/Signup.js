import React, { Component } from 'react';
import AuthService from '../../utils/auth';
import { Link, withRouter } from 'react-router-dom';
import { FormControl, Button, TextField } from '@material-ui/core';


class Signup extends Component {
    state = {
        username: '',
        password: ''
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleFormSubmit = (e) => {
        e.preventDefault();
        const authService = new AuthService();
        authService.signup(this.state.username, this.state.password)
            .then((response) => {
                this.props.setCurrentUser(response.data);
                //save user id browser local storage
                localStorage.setItem('loggedInUser', response.data._id);
                this.props.handleClose();
                this.props.history.push('/feed');
            })
        this.setState({
            username: '',
            password: ''
        })
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleFormSubmit} style={{ marginTop: 100 }}>
                    <FormControl>
                        <TextField type="text" label="Username" name="username" value={this.state.username} onChange={this.handleChange} />
                        <TextField type="password" label="Password" name="password" value={this.state.password} onChange={this.handleChange} />
                        <Button type="submit" >Signup</Button>
                    </FormControl>
                </form>
                <p>Already have account?
                    <Link to={"/login"}>Login</Link>
                </p>
            </div>
        )
    }
}

export default withRouter(Signup);