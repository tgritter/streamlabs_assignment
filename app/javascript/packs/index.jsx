import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import App from '../components/App'
import store from "../redux/store";

document.addEventListener('DOMContentLoaded', () => {
  const user_node = document.getElementById('current_user')
  const current_user = JSON.parse(user_node.getAttribute('data'))
  
  const users_node = document.getElementById('user_data')
  const users = JSON.parse(users_node.getAttribute('data'))

  const client_id_node = document.getElementById('client_id')
  const client_id = JSON.parse(client_id_node.getAttribute('data'))

  ReactDOM.render(
    <Provider store={store}>
      <Router>
        <Route path="/" 
          render={(props) => <App {...props} current_user={current_user} users={users} client_id={client_id} /> } 
        /> 
      </Router>
    </Provider>,
    document.body.appendChild(document.createElement('div')),
  )
})

