import React, { Component } from 'react'
import { FormControl, Button, TextField } from '@material-ui/core';

class EditProfile extends Component {
    state = {
        username: "",
        email: "",
        firstName: "",
        lastName: "",
        bio: "",
        typeOfUser: "",
    }

    componentDidMount = () => {
        this.setState({
            username: this.props.loggedInUser.username,
            email: this.props.loggedInUser.email,
            firstName: this.props.loggedInUser.firstName,
            lastName: this.props.loggedInUser.lastName,
            bio: this.props.loggedInUser.bio,
            typeOfUser: this.props.loggedInUser.typeOfUser
        })
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleFormSubmit = (e) => {
        e.preventDefault();
        this.props.updateUser(this.state)
        this.props.handleClose();
    }

    render() {
        return (
            <form onSubmit={this.handleFormSubmit} className='signup-form'>
                <FormControl style={{ width: '80%', display: 'flex', justifyContent: 'spaceBetween' }}>
                    <TextField type="text" label="Username" name="username" value={this.state.username} disabled />
                    <TextField type="email" label="Email" name="email" value={this.state.email} onChange={this.handleChange} />
                    <TextField type="text" label="First Name" name="firstName" value={this.state.firstName} onChange={this.handleChange} />
                    <TextField type="text" label="Last Name" name="lastName" value={this.state.lastName} onChange={this.handleChange} />
                    <TextField type="textarea" label="Bio" name="bio" value={this.state.bio} onChange={this.handleChange}
                        multiline
                        rows={2}
                        rowsMax={4} />
                    <TextField placeholder={this.state.typeOfUser} name="typeOfUser" style={{ marginTop: 10 }} disabled />
                    <Button style={{ marginTop: '10%', marginBottom: '10%', height: 50, fontSize: 18 }} type="submit" variant='contained' color='primary'>Save</Button>
                </FormControl>
            </form>
        );
    }
}

export default EditProfile;
