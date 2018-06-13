import React, { Component } from 'react'
import { Select2 } from '../../components/index'
import { Bus } from '../../models/index'
import io from 'socket.io-client';

/*import { Browser } from 'remote-browser';

const browser = new Browser();
browser.launch()
    .then(() =>  {
        console.log('toto')
    })*/

type Props = {
    bus: Bus
}

export default class ComponentBrowser extends Component<Props> {
    state = {
        variable: null,
        host: null,
        ioPort: null,
        proxyPort: null,
        mode: null
    }

    static tags() {
        return ['core']
    }

    componentDidMount() {
        const { bus } = this.props

        bus.on('reset', this.deserialise);
        bus.on('compile', this.onCompile);
        bus.on('execute', this.onExecute);
    }

    componentWillUnmount() {
        const { bus } = this.props

        bus.off('reset', this.deserialise);
        bus.off('compile', this.onCompile);
        bus.off('execute', this.onExecute);
    }

    componentWillReceiveProps(nextProps) {
        const oldProps = this.props;

        if(nextProps.bus !== oldProps.bus) {
            oldProps.bus.off('reset', this.deserialise);
            oldProps.bus.off('compile', this.onCompile);
            oldProps.bus.off('execute', this.onExecute);

            nextProps.bus.on('reset', this.deserialise);
            nextProps.bus.on('compile', this.onCompile);
            nextProps.bus.on('execute', this.onExecute);
        }
    }

    serialise = () => {
        return [this.state.variable, this.state.host, this.state.ioPort, this.state.proxyPort, this.state.mode]
    }

    deserialise = (data) => {
        let [variable, host, ioPort, proxyPort, mode] = data ? data : [null, null, null, null, null];
        
        this.setState({variable: variable, host: host, ioPort: ioPort, proxyPort: proxyPort, mode: mode})
    }

    onChangeVariable = (event) => {
        this.setState({variable: event.target.value}, this.onUpdate)
    }

    onChangeHost = (event) => {
        this.setState({host: event.target.value}, this.onUpdate)
    }

    onChangeIOPort = (event) => {
        this.setState({ioPort: event.target.value}, this.onUpdate)
    }

    onChangeProxyPort = (event) => {
        this.setState({proxyPort: event.target.value}, this.onUpdate)
    }

    onChangeMode = (mode) => {
        this.setState({mode: mode}, this.onUpdate)
    }

    onUpdate = () => {
        this.props.onUpdate(this.serialise())
    }

    onDelete = (event) => {
        event.preventDefault()

        this.props.onPop()
    }

    onCompile = (interpreter, scope, asyncWrapper) => {
        let obj = {};

        let constructorWrapper  = function (url) {
            let newBrowser  = interpreter.createObjectProto(obj.BROWSER_PROTO),
                socket = io(url),
                wrapper;

            wrapper = function (eventName) {
                let args     = Array.prototype.slice.call(arguments, 0, arguments.length - 1);
                let callback = arguments[arguments.length - 1];

                return new Promise((resolve) => {
                    args.push(function (data) {
                        callback(interpreter.nativeToPseudo(data));
                        resolve();
                    });
                    socket.emit.apply(socket, args);
                })
            };
            interpreter.setProperty(newBrowser, 'connect', interpreter.createAsyncFunction(asyncWrapper(wrapper), false));

            return newBrowser;
        };
        obj.Browser       = interpreter.createNativeFunction(constructorWrapper, true);
        obj.BROWSER_PROTO = interpreter.getProperty(obj.Browser, 'prototype');
        interpreter.setProperty(scope, 'Browser', obj.Browser);
    }

    onExecute = (runner) => {
        return runner.eval('var ' + this.state.variable + ' = new Browser(\'https://' + this.state.host + ':' + this.state.port + '\')')
    }

    render() {
        const { variable, host, ioPort, proxyPort, mode } = this.state

        return (
            <div className="box box-info">
                <form className="form-horizontal">
                    <div className="box-header with-border">
                        <h3 className="box-title">Browser</h3>
                        <div className="box-tools pull-right">
                            <a className="btn btn-box-tool" onClick={this.onDelete}><i className="fa fa-times" /></a>
                        </div>
                    </div>
                    <div className="box-body">
                        <div className="form-group">
                            <label htmlFor="variable{{ _uid }}" className="col-sm-2 control-label">Variable</label>

                            <div className="col-sm-10">
                                <input id="variable{{ _uid }}" type="text" value={variable || ''} onChange={this.onChangeVariable} className="form-control"/>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="host{{ _uid }}" className="col-sm-2 control-label">Host</label>

                            <div className="col-sm-10">
                                <input id="host{{ _uid }}" type="text" value={host || ''} onChange={this.onChangeHost} className="form-control"/>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="ioPort{{ _uid }}" className="col-sm-2 control-label">IO Port</label>

                            <div className="col-sm-10">
                                <input id="ioPort{{ _uid }}" type="text" value={ioPort || ''} onChange={this.onChangeIOPort} className="form-control"/>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="proxyPort{{ _uid }}" className="col-sm-2 control-label">Proxy Port</label>

                            <div className="col-sm-10">
                                <input id="proxyPort{{ _uid }}" type="text" value={proxyPort || ''} onChange={this.onChangeProxyPort} className="form-control"/>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="mode{{ _uid }}" className="col-sm-2 control-label">Mode</label>

                            <div className="col-sm-10">
                                <Select2 value={mode || ''} onChange={this.onChangeMode} className="form-control" id="mode{{ _uid }}" style={{width: '100%'}}>
                                    <option value="" />
                                    <option value="manual">Manual</option>
                                    <option value="background">Background</option>
                                </Select2>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}
