import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from './Home'
import Streamer from './Streamer'

class App extends React.Component {

    render () {
        const {current_user, users, client_id} = this.props;

        return (
            <div>
                <Switch>
                    <Route exact path="/" 
                        render={(props) => <Home {...props} /> }
                    />
                    <Route exact path="/streamer" 
                        render={(props) => <Streamer {...props} current_user={current_user} users={users} client_id={client_id}/> }
                    />
                </Switch>
            </div>
        )
    }
}

export default App