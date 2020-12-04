import React from 'react'
import Login from './auth/Login'
import "../index.css"
// import Signup from './auth/Signup'
import { Grid, Paper, makeStyles } from '@material-ui/core';
import './home.css'
const Home = (props) => {

    const useStyles = makeStyles((theme) => ({
        root: {
            flexGrow: 1,
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            background: "lightBlue",
            width: theme.spacing(100),
            height: theme.spacing(100),
            marginTop: theme.spacing(0.5)
        },
    }));
    const classes = useStyles();
    return (
        <div style={{ backgroundImage: "url('../images/home-background.jpg')", backgroundSize: "cover", backgroundRepeat: "no-repeat" }} className='home-container'>
            <Grid container spacing={0}
                direction="row"
                justify="center"
                alignItems="center"
            >
                <Grid item xs={6}>
                    <div className="wrapper">
                        <div className="one">
                            <h1>Investor</h1>
                            <p>As an investor, find projects and people you are willing to take a chance on!</p>
                        </div>
                        <div className="two">
                            <h1>Creator</h1>
                            <p>As a creator, put your idea out there so that your dream can come through with the help of investors!</p>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <Paper className={classes.paper}>
                        <Login loggedInUser={props.loggedInUser} setCurrentUser={props.setCurrentUser} />
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}

export default Home
