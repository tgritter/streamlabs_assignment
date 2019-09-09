import React from 'react'
import Navbar from './Navbar'
import { connect } from "react-redux"
import {updateStreamerName} from '../redux/action'
import '../../assets/stylesheets/pages.scss'

class Home extends React.Component {

    handleChange = (event) => {
        this.props.update_streamer_name(event.target.value)
    }
    
    render () {
        const {streamer_name } = this.props;

        return (
            <div className="container">
                <Navbar />
                <div className="input_container">
                    <div className="streamer_text">Enter the name of your favourite streamer</div>
                    <input className="input_box" type="text" value={streamer_name} onChange={this.handleChange} />
                    <a className="login_text" href={"/users/auth/twitch"}>Login with Twitch</a>
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);