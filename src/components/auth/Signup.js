import React, { Component } from 'react';
import AuthService from '../../utils/auth';
import { withRouter } from 'react-router-dom';
import { FormControl, Button, TextField, Select, MenuItem } from '@material-ui/core';
import './signup.css'

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

    handleSubmit = (e) => {
        e.preventDefault();
        const authService = new AuthService();
        authService.signup(this.state)
            .then((response) => {
                this.props.setCurrentUser(response.data);
                //save user id browser local storage
                localStorage.setItem('loggedInUser', response.data._id);
                this.props.handleClose();
                this.props.history.push('/dashboard');
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
            <div className='signup-container'>
                <form onSubmit={this.handleSubmit} className='signup-form'>
                    <FormControl style={{ width: '80%', display: 'flex', justifyContent: 'spaceBetween' }}>
                        <TextField type="text" label="Username" name="username" value={this.state.username} onChange={this.handleChange} />
                        <TextField type="password" label="Password" name="password" value={this.state.password} onChange={this.handleChange} />
                        <TextField type="email" label="Email" name="email" value={this.state.email} onChange={this.handleChange} />
                        <TextField type="text" label="First Name" name="firstName" value={this.state.firstName} onChange={this.handleChange} />
                        <TextField type="text" label="Last Name" name="lastName" value={this.state.lastName} onChange={this.handleChange} />
                        <Select value={this.state.typeOfUser} onChange={this.handleChange} name="typeOfUser" style={{ marginTop: 10 }}>
                            <MenuItem value="Investor">Investor</MenuItem>
                            <MenuItem value="Innovator">Innovator</MenuItem>
                        </Select>
                        <Button style={{ marginTop: '10%', marginBottom: '10%', height: 50, fontSize: 18 }} type="submit" variant='contained' color='primary' >Signup</Button>
                    </FormControl>
                </form>
                {/* <p style={{ fontSize: 20 }}>Already have account?
                    <Link to={"/"} style={{ textDecoration: 'none', color: 'blue' }}> Login</Link>
                </p> */}
            </div>
        )
    }
}

export default withRouter(Signup);