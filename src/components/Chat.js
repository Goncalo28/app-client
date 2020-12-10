import React from 'react'
import io from 'socket.io-client'
import TextField from '@material-ui/core/TextField'
import { Button, Card } from '@material-ui/core'

const socket = io.connect(process.env.REACT_APP_SERVER_API, {
    withCredentials: true,
})

class Chat extends React.Component {
    state = {
        message: '',
        name: '',
        chat: []
    }

    componentDidMount() {
        socket.on('message', ({ name, message }) => {
            this.setState({
                chat: [...this.state.chat, { name, message }]
            })
        })
    }

    onTextChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }


    onMessageSubmit = e => {
        e.preventDefault();
        const { name, message } = this.state
        socket.emit('message', { name, message })
        this.setState({
            message: '',
            name
        })
    }

    render() {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <form onSubmit={this.onMessageSubmit}>
                    <div>
                        <TextField
                            name="name"
                            onChange={e => this.onTextChange(e)}
                            value={this.state.name}
                            label="Name"
                        />
                    </div>
                    <div>
                        <TextField
                            name="message"
                            onChange={e => this.onTextChange(e)}
                            value={this.state.message}
                            id="outlined-multiline-static"
                            variant="standard"
                            label="Message"
                        />
                    </div>
                    <Button variant='outlined' color='primary' type='submit'>Send</Button>
                </form>
                <div style={{ display: 'flex', alignItems: 'left', justifyContent: 'left', flexDirection: 'column' }}>
                    <h1>Chat</h1>
                    {this.state.chat.map(({ name, message }, index) => (
                        (<Card key={index} style={{ backgroundColor: 'rgba(9, 161, 245)', color: 'white', marginTop: 10 }}>
                            <h3 style={{ padding: 10 }}>
                                {name}: <span>{message}</span>
                            </h3>
                        </Card>
                        )
                    ))}
                </div>
            </div>
        )
    }
}

export default Chat;
