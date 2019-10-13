import React, {Component} from 'react'
import {onCompile, onExecute} from '../clients/uniflow'

export default class CheckBoxesComponent extends Component {
  state = {
    running: false,
    variable: null,
    width: null,
    height: null
  }

  static tags() {
    return ['ui']
  }

  static clients() {
    return ['uniflow']
  }

  componentDidMount() {
    const {bus} = this.props
    bus.on('reset', this.deserialise)
    bus.on('code', onCode.bind(this))
    bus.on('execute', onExecute.bind(this))
  }

  componentWillUnmount() {
    const {bus} = this.props
    bus.off('reset', this.deserialise)
    bus.off('code', onCode.bind(this))
    bus.off('execute', onExecute.bind(this))
  }

  componentDidUpdate(prevProps) {
    if (this.props.bus !== prevProps.bus) {
      prevProps.bus.off('reset', this.deserialise)
      prevProps.bus.off('code', onCode.bind(this))
      prevProps.bus.off('execute', onExecute.bind(this))

      this.props.bus.on('reset', this.deserialise)
      this.props.bus.on('code', onCode.bind(this))
      this.props.bus.on('execute', onExecute.bind(this))
    }
  }

  serialise = () => {
    return [this.state.variable, this.state.width, this.state.height]
  }

  deserialise = data => {
    let [variable, width, height] = data || [null, null, null]

    this.setState({variable: variable, width: width, height: height})
  }

  onChangeVariable = event => {
    this.setState({variable: event.target.value}, this.onUpdate)
  }

  onChangeWidth = event => {
    this.setState({width: event.target.value}, this.onUpdate)
  }

  onChangeHeight = event => {
    this.setState({height: event.target.value}, this.onUpdate)
  }

  onUpdate = () => {
    this.props.onUpdate(this.serialise())
  }

  onDelete = event => {
    event.preventDefault()

    this.props.onPop()
  }

  render() {
    const {running, variable, width, height} = this.state

    return (
      <div className='box box-info'>
        <form className='form-horizontal'>
          <div className='box-header with-border'>
            <h3 className='box-title'>
              <button type='submit' className='btn btn-default'>{running ? <i className='fa fa-refresh fa-spin'/> :
                <i className='fa fa-refresh fa-cog'/>}</button>
              Canvas
            </h3>
            <div className='box-tools pull-right'>
              <button className='btn btn-box-tool' onClick={this.onDelete}><i className='fa fa-times'/></button>
            </div>
          </div>
          <div className='box-body'>
            <div className='form-group'>
              <label htmlFor='variable{{ _uid }}' className='col-sm-2 control-label'>Variable</label>

              <div className='col-sm-10'>
                <input id='variable{{ _uid }}' type='text' value={variable || ''} onChange={this.onChangeVariable}
                       className='form-control'/>
              </div>
            </div>

            <div className='form-group'>
              <label htmlFor='width{{ _uid }}' className='col-sm-2 control-label'>Width</label>

              <div className='col-sm-10'>
                <input id='width{{ _uid }}' type='text' value={width || ''} onChange={this.onChangeWidth}
                       className='form-control'/>
              </div>
            </div>

            <div className='form-group'>
              <label htmlFor='height{{ _uid }}' className='col-sm-2 control-label'>Height</label>

              <div className='col-sm-10'>
                <input id='height{{ _uid }}' type='text' value={height || ''} onChange={this.onChangeHeight}
                       className='form-control'/>
              </div>
            </div>

            <div className='form-group'>
              <label htmlFor='canvas{{ _uid }}' className='col-sm-2 control-label'>Canvas</label>

              <div className='col-sm-10'>
                <canvas ref={(canvas) => this.canvas = canvas} id="canvas{{ _uid }}" width={width} height={height}/>
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  }
}
