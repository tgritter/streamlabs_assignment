import React from 'react'

import '../../assets/stylesheets/pages.scss'

class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            streamer_name: ''
        }
    }

    render () {
        return (
            <div className="navbar_container">
                {this.props.type === 'streamer_page' ? <div className="navbar_name">{`Welcome, ${this.props.current_user_name}`}</div> : null}
                <div className="navbar_title">Watch your favourite Streamers here</div>
                {this.props.type === 'streamer_page' ? <a className="navbar_logout" href={"/home"}></a> : null}
            </div>
        )
    }
}

export default Navbar