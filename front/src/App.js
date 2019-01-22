import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom'
import { combineReducers } from 'redux'
import { Provider, connect } from 'react-redux'
import routes, { pathTo } from './routes'
import { auth, env, feed, logs, user, versions } from './reducers'
import { flow } from 'uniflow/src/reducers'
import { UserManagerComponent } from './components'
import { createStore } from 'uniflow/src/utils'
import { getNewLogs, commitReadLog } from './reducers/logs/actions'
import { commitLoginUserSuccess, commitLogoutUser } from './reducers/auth/actions'
import { isGranted } from './reducers/user/actions'
import { commitSetEnv } from './reducers/env/actions'
import { getLastVersion } from './reducers/versions/actions'
import { withRouter, matchPath } from 'react-router'
// import createBrowserHistory from 'history/createBrowserProgram'

// const history = createBrowserHistory()
let store = createStore(combineReducers({
  auth,
  env,
  flow,
  feed,
  logs,
  user,
  versions
}))
let token = localStorage.getItem('token')
if (token !== null) {
  store.dispatch(commitLoginUserSuccess(token))
}

class Alert extends Component {
  componentDidMount () {
    const { alert, logs } = this.props

    setTimeout(() => {
      this.props.dispatch(commitReadLog(logs[alert].id))
    }, 5000)
  }

  onClose = (event, id) => {
    event.preventDefault()

    this.props.dispatch(commitReadLog(id))
  }

  render () {
    const { alert, logs } = this.props

    return (
      <div className='alert alert-danger' style={{ marginBottom: '0px' }}>
        <button type='button' className='close' aria-hidden='true'
          onClick={(event) => this.onClose(event, logs[alert].id)}>×
        </button>
        <h4><i className='icon fa fa-ban' /> {logs[alert].message}</h4>
      </div>
    )
  }
}

Alert = connect(state => ({
  logs: getNewLogs(state.logs)
}))(Alert)

class Alerts extends Component {
  render () {
    const { logs } = this.props

    return (
      <div>
        {Object.keys(logs).map((key, index) => (
          <Alert key={key} alert={key} />
        ))}
      </div>
    )
  }
}

Alerts = connect(state => ({
  logs: getNewLogs(state.logs)
}))(Alerts)

class Header extends Component {
  state = {
    active: null
  }

  componentDidMount () {
    const { location, history } = this.props
    this.onLocationChange(location)

    this.historyUnlisten = history.listen(this.onLocationChange)
  }

  componentWillUnmount () {
    this.historyUnlisten()
  }

  onLocationChange = (location) => {
    let active = null

    if (matchPath(location.pathname, {
      path: routes.home.path,
      exact: true
    })) {
      active = 'home'
    } else if (matchPath(location.pathname, {
      path: routes.faq.path,
      exact: true
    })) {
      active = 'faq'
    } else if (matchPath(location.pathname, {
      path: routes.settings.path,
      exact: true
    })) {
      active = 'settings'
    } else if (matchPath(location.pathname, {
      path: routes.admin.path,
      exact: true
    })) {
      active = 'admin'
    } else if (matchPath(location.pathname, {
      path: routes.blog.path,
      exact: true
    })) {
      active = 'blog'
    } else if (matchPath(location.pathname, {
      path: routes.login.path,
      exact: true
    })) {
      active = 'login'
    } else if (matchPath(location.pathname, {
      path: routes.register.path,
      exact: true
    })) {
      active = 'login'
    } else if (matchPath(location.pathname, {
      path: routes.feed.path
    }) || matchPath(location.pathname, {
      path: routes.userFeed.path
    })) {
      active = 'dashboard'
    }

    this.setState({ active: active })
  }

  onLogout = (e) => {
    e.preventDefault()

    this.props.dispatch(commitLogoutUser())
  }

  render () {
    const { auth, user } = this.props
    const { active } = this.state

    return (
      <header className='main-header'>
        <nav className='navbar navbar-static-top'>
          <div className='navbar-custom-menu'>
            <ul className='nav navbar-nav'>
              <li className={active === 'home' ? 'active' : ''}>
                <Link to={pathTo('home')}>Home</Link>
              </li>
              {auth.isAuthenticated && isGranted(user, 'ROLE_USER') && user.username === null && (
                <li className={active === 'dashboard' ? 'active' : ''}>
                  <Link to={pathTo('feed')}>Dashboard</Link>
                </li>
              )}
              {auth.isAuthenticated && isGranted(user, 'ROLE_USER') && user.username !== null && (
                <li className={active === 'dashboard' ? 'active' : ''}>
                  <Link to={pathTo('userFeed', { username: user.username })}>Dashboard</Link>
                </li>
              )}
              <li className={active === 'faq' ? 'active' : ''}>
                <Link to={pathTo('faq')}>FAQ</Link>
              </li>
              {auth.isAuthenticated && isGranted(user, 'ROLE_USER') && (
                <li className={active === 'settings' ? 'active' : ''}>
                  <Link to={pathTo('settings')}>Settings</Link>
                </li>
              )}
              {auth.isAuthenticated && isGranted(user, 'ROLE_SUPER_ADMIN') && (
                <li className={active === 'admin' ? 'active' : ''}>
                  <Link to={pathTo('admin')}>Admin</Link>
                </li>
              )}
              <li className={active === 'blog' ? 'active' : ''}>
                <Link to={pathTo('blog')}>Blog</Link>
              </li>
              {!auth.isAuthenticated && (
                <li className={active === 'login' ? 'active' : ''}>
                  <Link to={pathTo('login')}>Login</Link>
                </li>
              )}
              {auth.isAuthenticated && isGranted(user, 'ROLE_USER') && (
                <li className={active === 'logout' ? 'active' : ''}>
                  <a onClick={this.onLogout}><span className='glyphicon glyphicon-off logout' aria-hidden='true' /></a>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </header>
    )
  }
}

Header = connect(state => ({
  auth: state.auth,
  user: state.user
}))(withRouter(Header))

class Footer extends Component {
  render (): React.ReactNode {
    const { version } = this.props

    return (
      <footer className='main-footer'>
        <div className='pull-right hidden-xs'>
          <a href={pathTo('versions')}><b>Version</b> {version}</a>
        </div>
        <a className='btn' href='https://github.com/uniflow-io/uniflow' target='_blank'><i
          className='fa fa-github' /></a>
        <a className='btn' href='https://www.facebook.com/uniflow.io' target='_blank'><i
          className='fa fa-facebook' /></a>
        <a className='btn' href='https://twitter.com/uniflow_io' target='_blank'><i className='fa fa-twitter' /></a>
        <a className='btn' href='https://medium.com/@uniflow.io' target='_blank'><i className='fa fa-medium' /></a>
      </footer>
    )
  }
}

Footer = connect(state => ({
  version: getLastVersion(state.versions)
}))(Footer)

export default class App extends Component {
  constructor (props) {
    super(props)

    store.dispatch(commitSetEnv(props.env))
  }

  render () {
    const auth = store.getState().auth

    return (
      // <React.StrictMode>
      <Provider store={store}>
        <Router>
          <div>
            <UserManagerComponent />

            <div className='wrapper'>

              <Alerts />
              <Header />

              <Switch>
                {Object.values(routes).map(route => (
                  <Route key={route.path} {...route} />
                ))}
              </Switch>

              <Footer />
            </div>
          </div>
        </Router>
      </Provider>
      // </React.StrictMode>
    )
  }
}