import React from 'react'
import Navbar from './Navbar'
import { connect } from "react-redux"
import {updateStreamerName} from '../redux/action'
import '../../assets/stylesheets/pages.scss'

const tmi = require('tmi.js');
const ws = new WebSocket('wss://pubsub-edge.twitch.tv');

// https://id.twitch.tv/oauth2/authorize?client_id=1ho0ha9t865reolwzi124jq2xkckhg&redirect_uri=http://localhost:3000/users/auth/twitch/callback&response_type=token&scope=whispers:read


class Streamer extends React.Component {
    constructor(props) {
        super(props);
      
        this.state = {
            client_id: '1ho0ha9t865reolwzi124jq2xkckhg',
            streamer_name: this.props.streamer_name,
            channel_id: '',
            access_token: '',
            hasAuth: null,
            events: []

        };
      }

    async componentDidMount(){
        this.connectToWebSocket()
        console.log('CurrentUser: ', this.props.current_user)
        //this.getChannelId()
    }

    connectToWebSocket = () => {
        var heartbeatInterval = 1000 * 60; //ms between PING's
        var reconnectInterval = 1000 * 3; //ms to wait before reconnect

        function heartbeat() {
            const message = {
                type: 'PING'
            }
    
            ws.send(JSON.stringify(message))
        }

        ws.onopen = (event) => {
            heartbeat()
            setInterval(heartbeat, heartbeatInterval)
        }

        ws.onmessage = (response) => {
            this.parseResponseType(JSON.parse(response.data))
        }

    }

    async getChannelId(){
        const {client_id, streamer_name} = this.state;
        const {current_user} = this.props;
        let response = await fetch(`https://api.twitch.tv/kraken/users?login=${streamer_name}&api_version=5&client_id=1ho0ha9t865reolwzi124jq2xkckhg`)
        .then(response => response.json())
        .then(data => {
            console.log('Data: ', data)
            return data
        })
        .catch(error => console.error(error))
        
        let user_name = response.users.length ? response.users[0].name : null

        if(user_name === streamer_name){
            this.setState({
                channel_id: response.users[0]._id
            })
        }
        else {
            alert('There is no Streamer with that name')
        }

        this.connectToWebSocket()
    }

    parseResponseType = (response) => {
        switch(response.type) {
            case 'PONG':
                this.listen()
                break;
        
            case 'RESPONSE':
                this.setState({hasAuth: response.error === ""})
                break;

            case 'MESSAGE':
                this.parseMessage(response.data)
                break; 

            default:
                console.log("Invalid Type")
        }
    }

    nonce = (length) => {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    listen = () => {
        const {current_user, users} = this.props;
        var message = {
            type: 'LISTEN',
            nonce: this.nonce(15),
            data: {
                topics: ['whispers.459497785'],
                auth_token: 'efealvkremejsczntlnuxay9wio95m'
            }
        };
        ws.send(JSON.stringify(message));
    }

    chatBot = () => {
        const opts = {
            options: {
                debug: true
            },
            connection: {
                cluster: "aws",
                reconnect: true
            },
            identity: {
              username: 'Travesty',
              password: 'oauth:awisj4m97gz5zfw0imvauhk9ou1h2z'
            },
            channels: [
              'vasi6822'
            ]
          };

        const client = new tmi.client(opts);

        client.connect();

        client.on('connected', (address, port) => {
            client.action("vasi6822", "Hello!")
        })
    }

    parseMessage = (response) => {
        console.log("ParseMessageTest: ", response);
        let {events} = this.state
        let topic = response.topic.split(".")[0]
        console.log('Topic: ', topic)
        let message = JSON.parse(response.message)
        let data = JSON.parse(message.data)
        let object = {};
        console.log('Message: ', message)

        switch(topic) {
            case "channel-bits-events-v1":
                object = {
                    id: data.message_id,
                    type: "Cheer from",
                    user_name: data.user_name,
                    body: data.chat_message
                }
                break;
            
            case "channel-bits-badge-unlocks":
                object = {
                    id: message.time,
                    type: "Bits badge earned by",
                    user_name: message.user_name,
                    body: message.badge_tier
                }
                break;
            
            case "channel-subscribe-events-v1":
                object = {
                    id: message.time,
                    type: "Subscription from",
                    user_name: message.user_name,
                    body: message.months + " months"
                }
                break;
            
            case "channel-commerce-events-v1":
                object = {
                    id: message.time,
                    type: "Commerce purchase from",
                    user_name: message.user_name,
                    body: message.item_description
                }
                break;

            case 'whispers':
                object = {
                    id: data.message_id,
                    type: "Whisper from",
                    user_name: data.tags.display_name,
                    body: data.body
                }
                break;
        }
        if(topic === 'whispers'){
            if(message.type !== 'thread'){
                events.push(object);
                this.setState({events: events})
            }
        }
        else {
            events.push(object);
            this.setState({events: events})
        }
    }

    events = () => {
        const {hasAuth, streamer_name, events} = this.state;

        if(hasAuth === null){
            return (
                <div className="events_box_center">
                    <div>{`Click to listen to ${streamer_name}'s events`}</div>
                    <button type="button" onClick={() => this.listen()}>Listen</button>
                </div>
            )
        }
        else if(!hasAuth) {
            return (
                <div className="events_box_center">
                    <div>{`You do not have permission to listen this streamer's events. Click to send ${streamer_name} a message requesting access.`}</div>
                    <button type="button" onClick={() => this.chatBot()}>Request Access</button>
                </div>
            )
        }
        else {
            var recentEvents = events.slice(0, 9);
            console.log('recentEvents: ', recentEvents)
            const listEvents = events.map((m) => 
                <div key={m.id} className="message">
                    <div className="message_type">{`${m.type} ${m.user_name}:`}</div>
                    <div className="message_body">{m.body}</div>
                </div>
            )

            return (
                <div className="events_box">
                    <div>{`Listening to ${streamer_name}'s events.`}</div>
                    {listEvents}
                </div>
            )
        }
    }


    render () {
        const {streamer_name} = this.props;
        return (
            <div className="container">
                <Navbar/>
                <div className="iframe_container">
                    <iframe
                        className="iframe"
                        src="https://player.twitch.tv/?channel=shroud"
                        height="500"
                        width="700"
                        frameBorder="0"
                        scrolling="no"
                        allowFullScreen={true}>
                    </iframe>
                    <iframe 
                        className="iframe"
                        scrolling="yes"
                        id="shroud"
                        src="https://www.twitch.tv/embed/shroud/chat"
                        height="500"
                        width="350">
                    </iframe>
                </div>

                <div className="events_text_container">
                    <div className="events_text">{`${streamer_name}'s Events`}</div>
                </div>

                <div className="container_events_box">
                    {this.events()}
                </div>

            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    streamer_name: state.streamer_name,
});

const mapDispatchToProps = dispatch => ({
    update_streamer_name: (payload) => dispatch(updateStreamerName(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(Streamer);