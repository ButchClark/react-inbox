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
        this.state ={
            messages: [],
            selectedStyle: 0,
            unreadMessages: 0,
            totalMessageCount: 0,
            selectedMessageCount: 0
        }

        this.updateSelectedButtonHandler = this.updateSelectedButtonHandler.bind(this)
    }//end ctor()

    async componentDidMount (){
        console.log(`ReactInbox.componentDidMount() - NODE_ENV: ${process.env.NODE_ENV} `)
        let msgsServer = process.env.REACT_APP_MESSAGES_SERVER
        let msgsURI = process.env.REACT_APP_MESSAGES_URI
        console.log(`ReactInbox.componentDidMount - getting msgs from: ${msgsServer}${msgsURI}`)
        const res = await fetch(`${msgsServer}${msgsURI}`)
        const json = await res.json()
        const msgs = json._embedded.messages
        this.setState({messages: msgs})
    }
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

    updateStarredHandler = (messageId) => {
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
                    msg.selected = msg.selected===true ? false : true
                    // msg.selected = !msg.selected
                }
                return msg
            }
        )
        let summary = this.getSummaryInfo(newMessages)
        console.log(' .. updated msgs: ', newMessages)
        this.setState({
            messages: newMessages,
            selectedStyle: summary.selectedStyle,
            unreadMessages: summary.unreadCount,
            totalMessageCount: summary.totalMessageCount,
            selectedMessageCount: summary.selectedMessageCount
        })
    }

    addMesssage = ({subject, body}) => {
        this.addNewItem({subject: subject, body: body})
    }

    deleteHandler = () => {
        let uncheckedMessages = this.state.messages
            .filter(m => !m.selected)
        let summary = this.getSummaryInfo(uncheckedMessages)
        this.setState({
            messages: uncheckedMessages,
            selectedStyle: summary.selectedStyle,
            unreadMessages: summary.unreadCount,
            totalMessageCount: summary.totalMessageCount,
            selectedMessageCount: summary.selectedMessageCount
        })
        //this.setState({messages: uncheckedMessages, selectedStyle: NoneSelected})
    }

    updateSelectedButtonHandler() {
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

    applyLabelHandler = (label) => {
        if(label === "Apply label") return

        var newMsgs = this.state.messages.map(msg => {
            if(msg.selected === true){
                if( !msg.labels.includes(label)){
                    msg.labels.push(label)
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

    removeLabelHandler = (label) => {
        if(label === "Remove label") return

        var newMsgs = this.state.messages.map(msg => {
            if(msg.selected === true){
                if( msg.labels.includes(label)){
                    let index = msg.labels.indexOf(label)
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
