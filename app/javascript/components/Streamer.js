import React from 'react'
import Navbar from './Navbar'
import { connect } from "react-redux"
import {updateStreamerName} from '../redux/action'
import '../../assets/stylesheets/pages.scss'

const tmi = require('tmi.js');
const ws = new WebSocket('wss://pubsub-edge.twitch.tv');

class Streamer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            client_id: this.props.client_id,
            streamer_exists: true,
            streamer_name: this.props.streamer_name,
            current_user_name: '',
            channel_id: '',
            access_token: '',
            hasAuth: null,
            events: []
        };
      }

    async componentDidMount(){
        this.connectToWebSocket()
        await this.getCurrentUserName()
        await this.getChannelId()
    }

    async getCurrentUserName() {
        const {current_user} = this.props;
        const {client_id} = this.state;
        await fetch(`https://api.twitch.tv/kraken/channels/${current_user.uid}?api_version=5&client_id=${client_id}`)
        .then(response => response.json())
        .then(data => {
            this.setState({
                current_user_name: data.name
            })
        })
        .catch(error => console.error(error))
    }

    async getChannelId() {
        const {streamer_name, client_id} = this.state;
        await fetch(`https://api.twitch.tv/kraken/users?login=${streamer_name}&api_version=5&client_id=${client_id}`)
        .then(response => response.json())
        .then(data => {
            let user_name = data.users.length ? data.users[0].name : null
            if(user_name === streamer_name){
                this.setState({
                    streamer_exists: true,
                    channel_id: data.users[0]._id
                })
            }
            else {
                this.setState({
                    streamer_exists: false
                })
            }
        })
        .catch(error => console.error(error))
        this.listenToEvents()
    }

    connectToWebSocket = () => {
        var heartbeatInterval = 1000 * 60; //ms between PING's

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

    parseResponseType = (response) => {
        console.log(response)
        switch(response.type) {
            case 'PONG':
                console.log('Heartbeat')
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

    parseMessage = (response) => {
        let {events} = this.state
        let topic = response.topic.split(".")[0]
        let message = JSON.parse(response.message)
        let data = JSON.parse(message.data)
        let object = {};

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

    getTokenOfCurrentChannel = () => {
        const {channel_id} = this.state;
        const {users} = this.props;
        var result = users.find(obj => {
            return obj.uid === channel_id
        })
        if (typeof result !== 'undefined'){
            return result.token
        }
        else {
            return 'none'
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

    listenToEvents = () => {
        const {channel_id} = this.state; 
        const topics = [
            `channel-bits-events-v1.${channel_id}`, 
            `channel-bits-badge-unlocks.${channel_id}`,
            `channel-commerce-events-v1.${channel_id}`
        ]
        const auth_token = this.getTokenOfCurrentChannel()

        var message = {
            type: 'LISTEN',
            nonce: this.nonce(15),
            data: {
                topics: topics,
                auth_token: auth_token
            }
        };
        ws.send(JSON.stringify(message));
    }

    async updateStreamer() {
        this.props.update_streamer_name(this.state.streamer_name)
        await this.getChannelId()
        if(this.state.streamer_exists){
            window.location.reload()
        }
    }

    handleChange = (event) => {
        this.setState({
            streamer_name: event.target.value
        })
    }

    events = () => {
        const {hasAuth, streamer_name, events} = this.state;

        if(hasAuth === null){
            return (
                <div className="events_box_center">
                    <div className="events_listen_text">{`Click to listen to ${streamer_name}'s events`}</div>
                    <button type="button" onClick={() => this.listenToEvents()}>Listen</button>
                </div>
            )
        }
        else if(!hasAuth) {
            return (
                <div className="events_box_center">
                    <div className="events_listen_text">{`You do not have permission to listen this streamer's events. Click to send ${streamer_name} a message requesting access.`}</div>
                    <button type="button" onClick={() => this.chatBot()}>Request Access</button>
                </div>
            )
        }
        else {
            var recentEvents = events.slice(0, 9);
            const listEvents = recentEvents.map((m) => 
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

    chatBot = () => {
        const {streamer_name, current_user_name} = this.props;
        const opts = {
            options: {
                debug: true
            },
            connection: {
                cluster: "aws",
                reconnect: true
            },
            identity: {
              username: 'EventsBotTG',
              password: 'oauth:0kuu30evmq6eczrqi39omggxy5p04x'
            },
            channels: [
              streamer_name
            ]
          };

        const client = new tmi.client(opts);

        client.connect();

        client.on('connected', (address, port) => {
            client.action(streamer_name, `${current_user_name} would like access to your events. Please login to https://streamlabsprojectravis.herokuapp.com/ to authorize.`)
        })
    }


    render () {
        const {streamer_name} = this.props;
        const {streamer_exists} = this.state;
        return (
            <div className="container">
                <Navbar type={"streamer_page"} current_user_name={this.state.current_user_name}/>

                <div className="input_container">
                    <div className="streamer_text">Choose New Streamer</div>
                    <div>
                        <input 
                            className="input_box" 
                            type="text" value={this.state.streamer_name} 
                            onChange={this.handleChange} 
                            placeholder="Streamer Name"
                        />
                        <input
                            type="button"
                            value="Update"
                            onClick={() => this.updateStreamer()}
                        />
                    </div>
                </div>

                {!streamer_exists ? 
                    <div className="events_text_container">
                        <div className="events_text">{`There is no streamer with the name ${streamer_name}, please choose a valid streamer`}</div>
                    </div> :
                    <div>
                        <div className="iframe_container">
                            <iframe
                                className="iframe"
                                src={`https://player.twitch.tv/?channel=${streamer_name}`}
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
                                src={`https://www.twitch.tv/embed/${streamer_name}/chat`}
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
                }

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