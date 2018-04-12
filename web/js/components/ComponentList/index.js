import React, {Component} from 'react'
import {ComponentSearch} from 'uniflow/components/index'
import components from 'uniflow/uniflow/components';

class UiComponent extends Component {
    components = Object.assign({}, components, {
        'search': ComponentSearch
    })

    render() {
        const {tag, bus, onPush, onPop, onUpdate} = this.props
        const TagName                             = this.components[tag];

        return <TagName bus={bus}
                        onPush={onPush}
                        onPop={onPop}
                        onUpdate={onUpdate}/>
    }
}

export default class ComponentList extends Component {
    render() {
        const {stack, runIndex, onPush, onPop, onUpdate} = this.props
        const uiStack                   = (() => {
            let uiStack = [{
                component: 'search',
                index: 0
            }];

            for (let i = 0; i < stack.length; i++) {
                let item = stack[i];

                uiStack.push({
                    component: item.component,
                    bus: item.bus,
                    active: runIndex === i,
                    index: i
                });

                uiStack.push({
                    component: 'search',
                    index: i + 1
                });
            }

            return uiStack;
        })()

        return (
            <ul className="timeline">
                {uiStack.map((item, i) => (
                    <li key={i}>
                        {item.component !== 'search' && (
                            <i className={"fa fa-play" + (item.active ? ' bg-green' : ' bg-blue')} onClick={(event) => {
                                this.run(event, item.index)
                            }}/>
                        )}

                        <div
                            className={"timeline-item" + (item.component !== 'search' ? ' component' : '')}>
                            <div className="timeline-body">
                                <UiComponent tag={item.component} bus={item.bus}
                                             onPush={(component) => {
                                                 onPush(item.index, component)
                                             }}
                                             onPop={() => {
                                                 onPop(item.index)
                                             }}
                                             onUpdate={(data) => {
                                                 onUpdate(item.index, data)
                                             }}/>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        )
    }
}