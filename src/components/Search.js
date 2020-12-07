import React from "react"
import UserService from '../utils/user';
import SearchBar from "./SearchBar"
import { NavLink } from "react-router-dom"


class Search extends React.Component {

    state = {
        users: [],
        usersCopy: [],
    }


    componentDidMount = () => {
        const userService = new UserService()
        userService.getAllUsers()
            .then((users) => {
                this.setState({
                    users: users.data,
                    usersCopy: users.data

                })
            })
    }

    handleSearch = (searchName) => {
        let newUsers = this.state.users.filter(user => {
            return user.username.includes(searchName)
        })
        this.setState({
            usersCopy: newUsers
        })
    }

    render() {
        // if (this.props.loggedInUser !== null) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <SearchBar onFilter={this.handleSearch} />
                <ul>
                    {this.state.usersCopy.map(user => {
                        if (user._id !== localStorage.getItem("loggedInUser")) {
                            return <li><NavLink exact to={`/profile/${user._id}`}>
                                {user.username}
                            </NavLink>
                            </li>
                        } else {
                            return null
                        }
                    })}
                </ul>
            </div>
        )
        // } else {
        // }
    }
}


export default Search