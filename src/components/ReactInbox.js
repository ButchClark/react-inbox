import React from 'react'
import Messages from './Messages'
import Toolbar from './Toolbar'
import ComposeMessage from './ComposeMessage'

const AllSelected = 1
const SomeSelected = 2
const NoneSelected = 3


class ReactInbox extends React.Component {
    constructor(props) {
        super(props)

        let json = require('../seeds.json')
        let messageCount = json.length
        let unread = 0;
        json.map(msg => {
            if (msg.read === true) {
                unread++
            }
            return unread
        })

        let selectedFormat = 0
        let selectedCount = 0
        json.map(msg => {
            if (msg.selected === true) selectedCount++
            return selectedCount
        })
        if (selectedCount === json.length) {
            selectedFormat = AllSelected
        } else if (selectedCount > 0) {
            selectedFormat = SomeSelected
        } else {
            selectedFormat = NoneSelected
        }

        console.log('Total Msgs: ', messageCount, ', Unread Msgs: ', unread, ', Selected Msgs: ', selectedCount);

        this.state = {
            messages: json,
            unreadMessages: unread,
            selectedStyle: selectedFormat
        }
        this.addItem = this.addItem.bind(this)
        this.getNextMessageId = this.getNextMessageId.bind(this)
        this.updateState = this.updateState.bind(this)
        this.updateUnreadCount = this.updateUnreadCount.bind(this)
        this.markAsReadHandler = this.markAsReadHandler.bind(this)
        this.updateSelectedButtonHandler = this.updateSelectedButtonHandler.bind(this)
    }//end ctor()

    getSelectedFormat() {
        let selectedFormat = 0
        let selectedCount = 0
        this.state.messages.map(msg => {
            if (msg.selected === true) selectedCount++
            return selectedCount
        })
        if (selectedCount === this.state.messages.length) {
            selectedFormat = AllSelected
        } else if (selectedCount > 0) {
            selectedFormat = SomeSelected
        } else {
            selectedFormat = NoneSelected
        }
        return selectedFormat
    }

    markAsReadHandler(e) {
        console.log('MarkAsRead:...')
        console.log('e.target.messages: ', e.target.messages)
    }

    updateSelectedButtonHandler(e) {
        let clearAll
        let newState
        if (this.state.selectedStyle === AllSelected) {
            clearAll = false
            newState = NoneSelected
        } else {
            clearAll = true
            newState = AllSelected
        }
        let newMsgs = this.state.messages
        newMsgs.forEach(function (msg) {
            msg.selected = clearAll
        })
        console.log('setState for messages: ', newMsgs)
        this.setState({messages: newMsgs, selectedStyle: newState})
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

    updateUnreadCount = () => {
        let count = 0;
        this.state.messages.map(msg => {
            if (msg.read === true) count++
            return count
        })
        console.log(' we now have ', count, ' unread messages')
        this.setState({unreadMessages: count})
    }

    updateState = (msg) => {
        return new Promise(
            (resolve, reject) => {
                // add new message to state
                let messages = this.state.messages
                messages.push(msg)
                let selectFmt = this.getSelectedFormat()
                this.setState({messages: messages, selectedStyle: selectFmt})
                console.log("after setState(): ", this.state.messages)
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
            console.log("response from updateState: ", resp)
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

    selectMessageHandler = (e) => {
        console.log('> selectMessage handler: e.currentTarget ', e.currentTarget)
        console.log('  .. Updating selection box for message: ', e.currentTarget.value)
        var newMessages = this.state.messages.map(msg => {

                if (Number(msg.id) === Number(e.currentTarget.value)) {
                    if (!msg.selected) {
                        msg.selected = true
                    }
                    else {
                        msg.selected = false
                    }
                }
                return msg
            }
        )
        console
            .log(
                ' .. updated msgs: '
                ,
                newMessages
            )
        this
            .setState({messages: newMessages})
    }

    deleteHandler = (e) => {
        console.log('> deleteHandler')
        let uncheckedMessages = this.state.messages
            .filter(m => !m.selected)
        this.setState({messages: uncheckedMessages, selectedStyle: NoneSelected})
    }

    render() {
        return (
            <div>
                <div>
                    <Toolbar
                        selectedStyle={this.state.selectedStyle}
                        unreadMessages={this.state.unreadMessages}
                        deleteHandler={this.deleteHandler}
                        markAsReadHandler={this.markAsReadHandler}
                        selectionHandler={this.updateSelectedButtonHandler}
                    />
                </div>
                <div>
                    <ComposeMessage sendMessage={this.addItem}/>
                </div>
                <div>
                    <Messages name="messages" messages={this.state.messages} selectHandler={this.selectMessageHandler}/>
                </div>
            </div>
        )
    }
}

export {AllSelected, SomeSelected, NoneSelected}
export default ReactInbox
