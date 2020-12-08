import React from "react"
import UserService from '../utils/user';
import SearchBar from "./SearchBar"
import { NavLink } from "react-router-dom"
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import { List, ListItem } from "@material-ui/core";

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
        return (
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', marginTop: 5, width: '100%' }}>
                <SearchBar onFilter={this.handleSearch} />
                <List style={{ display: 'flex', alignItems: 'left', justifyContent: 'left', flexDirection: 'column', width: '100%' }}>
                    {this.state.usersCopy.map((user, index) => {
                        if (user._id !== localStorage.getItem("loggedInUser")) {
                            return (
                                <ListItem key={index} >
                                    <NavLink exact to={`/profile/${user._id}`} style={{ width: '100%', textDecoration: 'none', height: 35 }}>
                                        <Chip avatar={<Avatar style={{ height: 25, width: 25, backgroundColor: '#7ED5EA', fontSize: 17, color: 'white' }}>{user.username.charAt(0)}</Avatar>}
                                            label={user.username}
                                            style={{ width: '100%', display: 'flex', alignItems: 'left', justifyContent: 'left', height: 35 }}  //</NavLink>'#ABE5E8'
                                        ></Chip>
                                    </NavLink>
                                </ListItem>
                            )
                        } else {
                            return null
                        }
                    })}
                </List>
            </div>
        )
    }
}

export default Search
