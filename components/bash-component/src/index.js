import React, { Component } from 'react'
import { AceComponent } from 'uniflow/src/components'
import { uniflow } from '../package'

export default class BashComponent extends Component {
    state = {
      running: false,
      bash: null
    }

    static tags() {
        return uniflow.tags
    }

    static clients() {
        return uniflow.clients
    }

    componentDidMount () {
      const { bus } = this.props

      bus.on('reset', this.deserialise)
    }

    componentWillUnmount () {
      const { bus } = this.props

      bus.off('reset', this.deserialise)
    }

    componentWillReceiveProps (nextProps) {
      const oldProps = this.props

      if (nextProps.bus !== oldProps.bus) {
        oldProps.bus.off('reset', this.deserialise)

        nextProps.bus.on('reset', this.deserialise)
      }
    }

    serialise = () => {
      return this.state.bash
    }

    deserialise = data => {
      this.setState({ bash: data })
    }

    onChangeBash = bash => {
      this.setState({ bash: bash }, this.onUpdate)
    }

    onUpdate = () => {
      this.props.onUpdate(this.serialise())
    }

    onDelete = event => {
      event.preventDefault()

      this.props.onPop()
    }

    render () {
      const { running, bash } = this.state

      return (
        <div className='box box-info'>
          <form className='form-horizontal'>
            <div className='box-header with-border'>
              <h3 className='box-title'><button type='submit' className='btn btn-default'>{running ? <i className='fa fa-refresh fa-spin' /> : <i className='fa fa-refresh fa-cog' />}</button> Bash</h3>
              <div className='box-tools pull-right'>
                <button className='btn btn-box-tool' onClick={this.onDelete}><i className='fa fa-times' /></button>
              </div>
            </div>
            <div className='box-body'>
              <div className='form-group'>
                <label htmlFor='bash{{ _uid }}' className='col-sm-2 control-label'>Bash</label>

                <div className='col-sm-10'>
                  <AceComponent className='form-control' id='bash{{ _uid }}' value={bash} onChange={this.onChangeBash} placeholder='Bash' height='200' mode='batchfile' />
                </div>
              </div>
            </div>
          </form>
        </div>
      )
    }
}