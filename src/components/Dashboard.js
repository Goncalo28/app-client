import React from 'react';
import PostsService from '../utils/posts'
import { toast } from 'react-toastify';
import UserService from '../utils/user';
import { TextField, Typography, Fab, Avatar } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import AddIcon from '@material-ui/icons/Add';
import './post.css';


class Dashboard extends React.Component {
    state = {
        content: "",
        posts: [],
        username: "",
        connections: []
    }


    getAllPosts = () => {
        const loggedInUserId = this.props.loggedInUser
        const postsService = new PostsService();
        const postsPromise = postsService.getAllPosts();

        const userService = new UserService()
        let userPromise = userService.getUser(loggedInUserId);

        Promise.all([userPromise, postsPromise]).then((values) => {
            let {
                username,
                connections,
            } = values[0].data;
            let allPosts = values[1].data;

            const promisesUserPosts = [];
            allPosts.forEach((post) => {
                promisesUserPosts.push(userService.getUser(post.user))
            });

            Promise.all(promisesUserPosts).then((response) => {
                response.forEach((user, index) => {
                    allPosts[index].username = user.data.username;
                });

                this.setState({
                    username: username,
                    connections: connections,
                    posts: allPosts,
                });

            })
        })
    }

    componentDidMount = () => {
        this.getAllPosts()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.content === this.state.content) {
            return;
        } else {
            this.getAllPosts();
        }
    }

    handleChange = (e) => {
        let { name, value } = e.target;
        this.setState({
            [name]: value
        })
    }

    handleFormSubmit = (e) => {
        e.preventDefault();
        let postService = new PostsService();
        postService.createPost(this.state).then(() => {
            this.setState({
                content: ''
            })
            toast.success('Post created!')
        });
    }

    render() {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <Card style={{ width: '40%', marginBottom: 40 }}>
                    <CardContent >
                        <form style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
                            <TextField label="Post" multiline rows={2} variant='outlined' type="text" name="content" style={{ width: '70%' }}
                                value={this.state.content}
                                onChange={this.handleChange}
                                required
                            />
                            <Fab onClick={this.handleFormSubmit} style={{ backgroundColor: '#4B9FE1' }} aria-label="add">
                                <AddIcon style={{ color: 'white' }} />
                            </Fab>

                        </form>
                    </CardContent>
                </Card>
                <hr />
                <div style={{ width: '40%', marginBottom: 40 }}>
                    {this.state.posts.map((post, index) => {
                        if (this.state.connections.includes(post.user) || post.user === localStorage.getItem("loggedInUser") || !this.state.connections.length) {
                            return (
                                <Card style={{ marginBottom: 30 }} key={index}>
                                    <CardContent className='post-section'>
                                        <div className='post-avatar-section'>
                                            <Avatar style={{ backgroundColor: '#63BCE5', height: 70, width: 70, fontSize: 55 }}>{post.username.charAt(0)}</Avatar>
                                            <Typography variant='h5' style={{ marginTop: '10%' }}>{post.username}</Typography>
                                        </div>
                                        <hr style={{ width: 1, height: '100%', backgroundColor: 'lightgrey', border: 'none', marginRight: 15, marginLeft: -25 }} />
                                        <div className='content-section'>
                                            <Typography style={{ height: 20, margin: 0, padding: 0 }}>{post.content}</Typography>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        } else {
                            return null;
                        }
                    })
                    }
                </div>
            </div>
        )
    }
}

export default Dashboard;
