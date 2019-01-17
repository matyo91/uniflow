import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {pathTo} from '../../../routes'
import {connect} from 'react-redux'
import {getOrderedHistory, createHistory, setCurrentHistory} from '../../../reducers/history/actions'
import {createFolder, pathToSlugs} from '../../../reducers/folder/actions'
import {commitAddLog} from '../../../reducers/logs/actions'

class History extends Component {
  state = {
    search: ''
  }

  onChange = (event) => {
    this.setState({search: event.target.value})
  }

  onCreateFolder = (event) => {
    event.preventDefault()

    this.props
      .dispatch(createFolder({
        'title': this.state.search,
        'path': this.props.history.path
      }, this.props.auth.token))
      .then((item) => {
        return this.props.dispatch(setCurrentHistory({type: item.constructor.name, id: item.id}))
      })
      .catch((log) => {
        return this.props.dispatch(commitAddLog(log.message))
      })
  }

  onSubmit = (event) => {
    event.preventDefault()

    this.props
      .dispatch(createHistory({
        'title': this.state.search,
        'client': 'uniflow',
        'tags': [],
        'description': '',
        'path': this.props.history.path
      }, this.props.auth.token))
      .then((item) => {
        return this.props.dispatch(setCurrentHistory({type: item.constructor.name, id: item.id}))
      })
      .catch((log) => {
        return this.props.dispatch(commitAddLog(log.message))
      })
  }

  render() {
    const isCurrentUser = this.props.history.username === this.props.history.username
    const isActive = (item) => {
      return (this.props.history.current && this.props.history.current.type === item.constructor.name && this.props.history.current.id === item.id) ? 'active' : ''
    }

    const backTo = () => {
      let path = this.props.history.path.slice(0, -1)
      if(path.length === 0) {
        if (isCurrentUser) {
          return pathTo('userDashboard', {username: this.props.history.username})
        }

        return pathTo('dashboard')
      }

      let slugs = pathToSlugs(path)

      if (isCurrentUser) {
        return pathTo('userFlow', Object.assign({username: this.props.history.username}, slugs))
      }

      return pathTo('flow', slugs)
    }

    const itemPathTo = (item) => {
      let path = this.props.history.path.slice()
      path.push(item.slug)
      let slugs = pathToSlugs(path)

      if (item.public || isCurrentUser) {
        return pathTo('userFlow', Object.assign({username: this.props.history.username}, slugs))
      }

      return pathTo('flow', slugs)
    }

    return (
      <div className='box box-danger'>
        <div className='box-header with-border'>
          <h3 className='box-title'>History</h3>
        </div>
        <div className='box-body'>
          <div className='navbar navbar-default navbar-vertical' role='navigation'>
            <div className='navbar-header'>
              <button type='button' className='navbar-toggle' data-toggle='collapse'
                      data-target='.sidebar-navbar-collapse'>
                <span className='sr-only'>Toggle navigation</span>
                <span className='icon-bar'/>
                <span className='icon-bar'/>
                <span className='icon-bar'/>
              </button>
              <span className='visible-xs navbar-brand'>Sidebar menu</span>
            </div>
            <div className='navbar-collapse collapse sidebar-navbar-collapse show'>
              <ul className='nav navbar-nav'>
                <li>
                  <form className='navbar-form' role='search' onSubmit={this.onSubmit}>
                    <div className='input-group' style={{width: '100%'}}>
                      <input type='text' className='form-control' placeholder='Search'
                             value={this.state.search} onChange={this.onChange} />
                      {this.state.search && (
                        <span className="input-group-btn">
                          <button className="btn btn-default" type="button" onClick={this.onCreateFolder}><i
                            className="fa fa-folder" />
                          </button>
                        </span>
                      )}
                    </div>
                  </form>
                </li>
                {this.props.history.path.length > 0 && (
                <li>
                  <Link
                    to={backTo()}><i className="fa fa-arrow-left fa-fw" /> Back</Link>
                </li>
                )}
                {getOrderedHistory(this.props.history, this.state.search).map((item, i) => (
                  <li className={isActive(item)} key={i}>
                    <Link
                      to={itemPathTo(item)}>{item.constructor.name === 'Folder' && (
                      <i className="fa fa-folder fa-fw" />
                    )}{item.title} {item.constructor.name === 'History' && item.tags.map((tag, j) => (
                      <span key={j} className='badge'>{tag}</span>
                    ))}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(state => ({
  auth: state.auth,
  user: state.user,
  history: state.history
}))(History)
