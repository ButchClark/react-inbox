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
        let summary = this.getSummaryInfo(json)
        this.state ={
            messages: json,
            selectedStyle: summary.selectedStyle,
            unreadMessages: summary.unreadCount,
            totalMessageCount: summary.totalMessageCount,
            selectedMessageCount: summary.selectedMessageCount
        }

        this.addItem = this.addItem.bind(this)
        this.getNextMessageId = this.getNextMessageId.bind(this)
        this.updateState = this.updateState.bind(this)
        this.updateUnreadCount = this.updateUnreadCount.bind(this)
        this.markAsReadHandler = this.markAsReadHandler.bind(this)
        this.markAsUnreadHandler = this.markAsUnreadHandler.bind(this)
        this.updateSelectedButtonHandler = this.updateSelectedButtonHandler.bind(this)
        this.updateStarredHandler = this.updateStarredHandler.bind(this)
    }//end ctor()

    getSummaryInfo(messages) {
        console.log('> getSummaryInfo()')
        let selectedFormat = 0
        let selectedCount = 0
        let unreadCount = 0
        let totalMessages = 0
        messages.map(msg => {
            totalMessages++
            if(msg.read !== true) unreadCount++
            if (msg.selected === true) selectedCount++
            return selectedCount
        })
        if (selectedCount === messages.length) {
            selectedFormat = AllSelected
        } else if (selectedCount > 0) {
            selectedFormat = SomeSelected
        } else {
            selectedFormat = NoneSelected
        }

        console.log('.. calculated selectedMessageCount: ',selectedCount,', selectedStyle: ',selectedFormat, ', unreadCount: ', unreadCount, ', totalMsgs: ',totalMessages)
        return {
            selectedStyle: selectedFormat,
            unreadCount: unreadCount,
            selectedMessageCount: selectedCount,
            totalMessageCount: totalMessages}
    }

    markAsReadHandler(e) {
        console.log('MarkAsRead:...')
        var newMsgs = this.state.messages.map(msg => {
            if(msg.selected === true){
                msg.read = true
            }
            return msg
        })
        let summary = this.getSummaryInfo(newMsgs)
        this.setState(
            {
                messages: newMsgs,
                selectedStyle: summary.selectedStyle,
                unreadMessages: summary.unreadCount,
                totalMessageCount: summary.totalMessageCount,
                selectedMessageCount: summary.selectedMessageCount
            }
        )
    }

    markAsUnreadHandler(e) {
        console.log('MarkAsUnread:...')
        var newMsgs = this.state.messages.map(msg => {
            if(msg.selected === true){
                msg.read = false
            }
            return msg
        })
        let summary = this.getSummaryInfo(newMsgs)
        this.setState(
            {
                messages: newMsgs,
                selectedStyle: summary.selectedStyle,
                unreadMessages: summary.unreadCount,
                totalMessageCount: summary.totalMessageCount,
                selectedMessageCount: summary.selectedMessageCount
            }
        )
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
                let summary = this.getSummaryInfo(this.state.messages)
                console.log(' updateState() - getSummaryInfo returned: ', summary)
                this.setState({
                    messages: messages,
                    selectedStyle: summary.selectedStyle,
                    unreadMessages: summary.unreadCount,
                    totalMessageCount: summary.totalMessageCount,
                    selectedMessageCount: summary.selectedMessageCount
                })
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

    updateStarredHandler = (e) => {
        var newMessages = this.state.messages.map( msg => {
            if(Number(msg.id) === Number(e.currentTarget.dataset.messagenum)){
                console.log(' -- starred: ', msg.starred)
                if(msg.starred === true){
                    msg.starred = false
                }else{
                    msg.starred = true
                }
            }
            return msg
        })
        console.log('updateStarredHandler - msgs: ',newMessages)
        this.setState({messages: newMessages})
    }

    selectMessageHandler = (e) => {
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
        let ret = this.getSummaryInfo(this.state.messages)
        console.log('getSummaryInfo returned: ', ret.selectedStyle, ', and count: ',ret.unreadCount)
        this.setState({
            messages: newMessages,
            selectedStyle: ret.selectedStyle,
            unreadMessages: ret.unreadCount})
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
                        markAsUnreadHandler={this.markAsUnreadHandler}
                        selectionHandler={this.updateSelectedButtonHandler}
                    />
                </div>
                <div>
                    <ComposeMessage sendMessage={this.addItem}/>
                </div>
                <div>
                    <Messages
                        name="messages"
                        messages={this.state.messages}
                        selectHandler={this.selectMessageHandler}
                        starHandler={this.updateStarredHandler}
                    />
                </div>
            </div>
        )
    }
}

export {AllSelected, SomeSelected, NoneSelected}
export default ReactInbox
