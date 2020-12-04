import React, { Component } from "react";
import UserService from "../utils/user";
import ConnectionsService from "../utils/connections";

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
    console.log("before promise");
    Promise.all([userPromise, connectionPromise]).then((values) => {
      console.log(values);
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
          return { user: connection.to, id: connection._id };
        } else {
          return { user: connection.from, id: connection._id };
        }
      });
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
  }

  async getUserPending(id){
    let userPending = await this.userService.getUser(id)
    console.log(userPending)
    return userPending.data
  }

  handleGetPendingUsers = () => {};

   render() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <h2>{this.state.username}</h2>
        <p>{this.state.firstName}</p>
        <p>{this.state.lastName}</p>
        <p>{this.state.email}</p>
        <p>{this.state.typeOfUser}</p>
        <p>{this.state.bio}</p>
        <button onClick={this.handleGetPendingUsers}>Pending</button>
        <h4>Pending:</h4>
        {this.state.pendingConnections.map((connection) => {
          let newUser = this.getUserPending(connection.user).resolve()
          console.log(newUser)
            return (
              <div>
{/*                 <p>User: {newUser.data.username}</p>
                <p>Connection ID: {connection.id}</p> */}
              </div>
            );  
        })}
      </div>
    );
  }
}

export default Profile;
