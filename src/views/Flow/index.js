import React, { Component } from 'react'
import Program from './Program'
import Show from './Show'
import FolderShow from './FolderShow'
import { getCurrentProgram } from '../../reducers/feed/actions'
import { connect } from 'react-redux'
import { pathTo } from '../../routes'
import { Link } from 'react-router-dom'

class Flow extends Component<Props> {
  render () {
    const { feed } = this.props
    const currentProgram = getCurrentProgram(feed)

    return (
      <div id='flow' className='content-wrapper'>
        <section className='content-header'>
          <h1>
                        Dashboard
            <small>Control panel</small>
          </h1>
          <ol className='breadcrumb'>
            <li><Link to={pathTo('home')}><i className='fa fa-dashboard' /> Home</Link></li>
            <li className='active'>Flow</li>
          </ol>
        </section>

        <section className='content'>
          <div className='row'>
            <div className='col-sm-2'>
              <Program />
            </div>
            <div className='col-sm-10'>
              {feed.username && currentProgram && currentProgram.constructor.name === 'Program' && (
                <Show />
              )}
              {feed.username && currentProgram === null && feed.folder && (
                <FolderShow />
              )}
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default connect(state => {
  return {
    feed: state.feed
  }
})(Flow)
