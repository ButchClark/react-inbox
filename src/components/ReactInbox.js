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

        // this.updateState = this.updateState.bind(this)
        // this.updateSelectedButtonHandler = this.updateSelectedButtonHandler.bind(this)
        // this.updateStarredHandler = this.updateStarredHandler.bind(this)
    }//end ctor()

    //----------------------------------
    // Helper methods
    getSummaryInfo(messages) {
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

    getNextMessageId(messages) {
        let highest = 0
        messages.map(m => {
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
                let summary = this.getSummaryInfo(this.state.messages)
                this.setState({
                    messages: messages,
                    selectedStyle: summary.selectedStyle,
                    unreadMessages: summary.unreadCount,
                    totalMessageCount: summary.totalMessageCount,
                    selectedMessageCount: summary.selectedMessageCount
                })
                resolve(true)
            }
        )
    }

    //----------------------------------
    // Handler methods
    markAsReadHandler = () =>{
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

    markAsUnreadHandler = () => {
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

    updateStarredHandler = ({messageId}) => {
        var newMessages = this.state.messages.map( msg => {
            if(Number(msg.id) === Number(messageId)){
                if(msg.starred === true){
                    msg.starred = false
                }else{
                    msg.starred = true
                }
            }
            return msg
        })
        this.setState({messages: newMessages})
    }

    selectMessageHandler = ({messageId}) => {
        console.log('> selectMessageHandler - messageId: ',messageId)
        var newMessages = this.state.messages.map(msg => {
                if (Number(msg.id) === Number(messageId)) {
                    console.log(' .. flipping message.selected')
                    // msg.selected = msg.selected===true ? false : true
                    msg.selected = !msg.selected
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
        this.setState({
            messages: newMessages,
            selectedStyle: ret.selectedStyle,
            unreadMessages: ret.unreadCount})
    }

    addMesssage = ({subject, body}) => {
        this.addNewItem({subject: subject, body: body})
    }

    deleteHandler = () => {
        let uncheckedMessages = this.state.messages
            .filter(m => !m.selected)
        this.setState({messages: uncheckedMessages, selectedStyle: NoneSelected})
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
        this.setState({messages: newMsgs, selectedStyle: newState})
    }
    async addNewItem({subject, body}) {
        try {
            let resp
            let msg = {
                id: this.getNextMessageId(this.state.messages),
                subject: subject,
                body: body,
                starred: false,
                read: false,
                labels: []
            }
            resp = await this.updateState(msg)
        } catch (err) {
            console.log("ERROR calling updateState: ", err)
        }
        return "message added"
    }
    applyLabelHandler = (e) => {
        if(e.currentTarget.value.toString() === "Apply label") return

        var newMsgs = this.state.messages.map(msg => {
            if(msg.selected === true){
                if( !msg.labels.includes(e.currentTarget.value.toString())){
                    msg.labels.push(e.currentTarget.value.toString())
                }
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
    removeLabelHandler = (e) => {
        if(e.currentTarget.value.toString() === "Remove label") return

        var newMsgs = this.state.messages.map(msg => {
            if(msg.selected === true){
                if( msg.labels.includes(e.currentTarget.value.toString())){
                    let index = msg.labels.indexOf(e.currentTarget.value.toString())
                    msg.labels.splice(index,1)
                }
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
                        addLabelHandler={this.applyLabelHandler}
                        removeLabelHandler={this.removeLabelHandler}
                        selectionHandler={this.updateSelectedButtonHandler}
                    />
                </div>
                <div>
                    <ComposeMessage sendMessage={this.addMesssage}/>
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
