import React, { Component } from 'react';
import AuthService from '../../utils/auth';
import { Link, withRouter } from 'react-router-dom';
import { FormControl, Button, TextField, Select, MenuItem } from '@material-ui/core';


class Signup extends Component {
    state = {
        username: '',
        password: '',
        email: "",
        firstName: "",
        lastName: "",
        typeOfUser: ""
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleFormSubmit = (e) => {
        e.preventDefault();
        const authService = new AuthService();
        authService.signup(this.state)
            .then((response) => {
                this.props.setCurrentUser(response.data);
                //save user id browser local storage
                localStorage.setItem('loggedInUser', response.data._id);
                this.props.handleClose();
                this.props.history.push('/feed');
            })
        this.setState({
            username: '',
            password: '',
            email: "",
            firstName: "",
            lastName: "",
            typeOfUser: ""
        })
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleFormSubmit} style={{ marginTop: 100 }}>
                    <FormControl>
                        <TextField type="text" label="Username" name="username" value={this.state.username} onChange={this.handleChange} />
                        <TextField type="password" label="Password" name="password" value={this.state.password} onChange={this.handleChange} />
                        <TextField type="email" label="Email" name="email" value={this.state.email} onChange={this.handleChange} />
                        <TextField type="text" label="First Name" name="firstName" value={this.state.firstName} onChange={this.handleChange} />
                        <TextField type="text" label="Last Name" name="lastName" value={this.state.lastName} onChange={this.handleChange} />
                        <Select value={this.state.typeOfUser} onChange={this.handleChange} name="typeOfUser">
                            <MenuItem value="Investor">Investor</MenuItem>
                            <MenuItem value="Innovator">Innovator</MenuItem>
                        </Select>
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