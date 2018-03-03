import React from 'react'
import Messages from './Messages'
import Toolbar from './Toolbar'
import ComposeMessage from './ComposeMessage'

class ReactInbox extends React.Component {
    constructor(props) {
        var json = require('../seeds.json');
        super(props)
        this.state = {
            messages: json,
            numUnread: 2
        }
        this.addItem = this.addItem.bind(this)
        this.getNextMessageId = this.getNextMessageId.bind(this)
        this.updateState = this.updateState.bind(this)
    }

    getNextMessageId() {
        let highest = 0
        this.state.messages.map(m => {
            if (Number(m.id) > highest) {
                highest = Number(m.id)
            }
            return highest
        })
        return highest + 1
    }

    updateState = (msg) => {
        return new Promise(
            (resolve, reject) => {
                // add new message to state
                let messages = this.state.messages
                messages.push(msg)
                this.setState({messages: messages})
                console.log("after setState(): ",this.state.messages)
                resolve(true)
            }
        )
    }

    async addNewItem({subject, body}) {
        console.log("> in async addNewItem(ie, to state)")
        console.log('  .. subject: ', subject)
        console.log('  .. body   : ', body)
        try {
            let resp
            let msg = {
                id: this.getNextMessageId(),
                subject: subject,
                body: body,
                starred: false,
                read: false,
                labels: []
            }
            console.log('new message: ', msg)
            resp = await this.updateState(msg)
            console.log("response from updateState: ",resp)
        } catch (err) {
            console.log("ERROR calling updateState: ", err)
        }
        return "message added"
    }

    addItem = (e) => {
        e.preventDefault()
        console.log("> in addItem - e.target: ", e.target)
        let subj = e.target.subject.value
        let bod = e.target.body.value
        this.addNewItem({subject: subj, body: bod})
    }


    render() {
        return (
            <div>
                <div>
                    <Toolbar numUnread={this.state.numUnread}/>
                </div>
                <div>
                    <ComposeMessage sendMessage={this.addItem}/>
                </div>
                <div>
                    <Messages messages={this.state.messages}/>
                </div>
            </div>
        )
    }
}

export default ReactInbox