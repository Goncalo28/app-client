import React from 'react';
import { NavLink, Switch, Route } from 'react-router-dom';
import NavDrawer from './NavDrawer';
import Profile from "./Profile"
import PostsService from '../utils/posts'
import { toast } from 'react-toastify';
import UserService from '../utils/user';

class Dashboard extends React.Component {
    state = {
        content: "",
        posts: [],
        username: "",
        connections: []
    }

    getAllPosts = () => {
        const loggedInUserId = localStorage.getItem("loggedInUser")
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
        if (prevState === this.state) {
            return;
        }
        this.getAllPosts()
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
            toast.success('Post created!!')
        });
    }

    render() {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <form onSubmit={this.handleFormSubmit}>
                    <label>Content of Post</label>
                    <input type="text" name="content" value={this.state.content} onChange={this.handleChange} />
                    <button type='submit'>Add post</button>
                </form>
                <hr />
                <div>
                    {this.state.posts.map(post => {
                        if (this.state.connections.includes(post.user) || post.user === localStorage.getItem("loggedInUser") || !this.state.connections.lenght) {
                            return (
                                <div>
                                    <p>{post.content}</p>
                                    <p>{post.username}</p>
                                </div>
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
