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
                <div type="navbar_title">Watch your favourite Streamer</div>
            </div>
        )
    }
}

export default Navbar