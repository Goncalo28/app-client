import React from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import AuthService from '../utils/auth';

const drawerWidth = 180;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerContainer: {
        overflow: 'auto',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));

const NavDrawer = props => {


    const logoutUser = () => {
        const authService = new AuthService();
        authService.logout()
            .then(() => {
                props.setCurrentUser(null);
                localStorage.removeItem('loggedInUser');
            })
    }

    let classes = useStyles();
    if (props.loggedInUser) {
        return (
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position="fixed" className={classes.appBar} style={{ backgroundColor: 'red' }}>
                    <Toolbar>
                        <Typography variant="h6" noWrap>
                            Dope
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer
                    className={classes.drawer}
                    variant="permanent"
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <Toolbar />
                    <div className={classes.drawerContainer}>
                        <List>
                            <ListItem button>
                                <NavLink activeStyle={{ color: "red" }}
                                    style={{ height: '100%', width: '100%', textDecoration: 'none', color: 'black', fontSize: 18 }}
                                    exact to="/dashboard">Home</NavLink>
                            </ListItem>
                            <Divider />
                            <ListItem button>
                                <NavLink activeStyle={{ color: "red" }}
                                    style={{ width: '100%', textDecoration: 'none', color: 'black', fontSize: 18 }}
                                    exact to="/profile">Profile</NavLink>
                            </ListItem>
                            <Divider />
                            <ListItem button>
                                <NavLink activeStyle={{ color: "red" }}
                                    style={{ width: '100%', textDecoration: 'none', color: 'black', fontSize: 18 }}
                                    exact to="#">Messages</NavLink>
                            </ListItem>
                            <Divider />
                            {/* <ListItem button>
                                <NavLink activeStyle={{ color: "red" }}
                                    style={{ width: '100%', textDecoration: 'none', color: 'black', fontSize: 18 }}
                                    exact to="#">something here</NavLink>
                            </ListItem>
                            <Divider /> */}
                            <ListItem button onClick={logoutUser}>
                                <NavLink activeStyle={{ color: "red" }}
                                    style={{ width: '100%', textDecoration: 'none', color: 'black', fontSize: 18 }}
                                    to="/">Logout</NavLink>
                            </ListItem>
                            <Divider />
                        </List>
                    </div>
                </Drawer>
                <main className={classes.content}>
                    <Toolbar />
                </main>
            </div>
        );
    } else {
        return (
            <div></div>
            // <Redirect exact to='/' />
        )
    }
}

export default NavDrawer;
