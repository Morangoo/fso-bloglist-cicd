import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App'
import Store from './store'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={Store}>
    <Router>
      <App />
    </Router>
  </Provider>,
)
