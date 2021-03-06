import React from "react"
import { Redirect, Route, Switch } from "react-router-dom";
import AuthService from "./utils/auth";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Home from './components/Home';
import NavDrawer from './components/NavDrawer';
import Profile from './components/Profile'
import UsersProfile from './components/UsersProfile'
import Dashboard from "./components/Dashboard";
import Chat from "./components/Chat";

import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

class App extends React.Component {
  state = {
    loggedInUser: null,
  };

  // theme = createMuiTheme({
  //   palette: {
  //     type: 'light',
  //   }
  // })

  setCurrentUser = (user) => {
    this.setState({
      loggedInUser: user,
    });
  };

  componentDidMount() {
    if (this.state.loggedInUser === null) {
      const authService = new AuthService();
      authService.loggedin().then((response) => {
        if (response.data._id) {
          this.setCurrentUser(response.data);
        } else {
          localStorage.removeItem("loggedInUser");
        }
      });
    }
  }

  render() {
    return (
      <div className="App">
        {/* <ThemeProvider theme={this.theme}> */}
        <ToastContainer />
        <NavDrawer loggedInUser={this.state.loggedInUser} setCurrentUser={this.setCurrentUser} />
        <Switch>
          <Route exact path="/dashboard" render={
            () => {
              if (localStorage.getItem('loggedInUser')) {
                return <Dashboard loggedInUser={localStorage.getItem('loggedInUser')} setCurrentUser={this.setCurrentUser} />
              } else {
                return <Redirect to='/' />
              }
            }
          }
          />
          <Route path='/chat' render={
            () => {
              if (localStorage.getItem('loggedInUser')) {
                return <Chat />
              } else {
                return <Redirect to='/' />
              }
            }
          } />
          <Route exact path="/profile" render={
            () => {
              if (localStorage.getItem('loggedInUser')) {
                return <Profile />
              } else {
                return <Redirect to='/' />
              }
            }
          } />

          <Route exact path="/profile/:id" render={
            () => {
              if (localStorage.getItem('loggedInUser')) {
                return <UsersProfile />
              } else {
                return <Redirect to='/' />
              }
            }
          } />
          <Route exact path="/" render={
            () => {
              if (!localStorage.getItem('loggedInUser')) {
                return <Home loggedInUser={localStorage.getItem('loggedInUser')} setCurrentUser={this.setCurrentUser} />
              } else {
                return <Redirect to="/dashboard" />
              }
            }}
          />
        </Switch>
        {/* </ThemeProvider> */}
      </div>
    );
  }
}

export default App;

