import React from 'react'
import Messages from './Messages'
import Toolbar from './Toolbar'

class ReactInbox extends React.Component {
    constructor(props) {
        var json = require('../seeds.json');
        super(props)
        this.state = {
            messages: json,
            numUnread: 2
        }
    }

    render() {
        return (
            <div>
                <div>
                    <Toolbar numUnread={this.state.numUnread}/>
                </div>
                <div>
                    <Messages messages={this.state.messages}/>
                </div>
            </div>
        )
    }
}

export default ReactInbox