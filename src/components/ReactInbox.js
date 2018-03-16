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
        this.state = {
            messages: [],
            selectedStyle: 0,
            showCompose: false
        }

        this.setLabel = this.setLabel.bind(this)
        this.updateSelectedButtonHandler = this.updateSelectedButtonHandler.bind(this)
    }//end ctor()

    componentDidMount() {
        console.log(`ReactInbox.componentDidMount() - NODE_ENV: ${process.env.NODE_ENV} `)
        this.loadMessages()
        // .then(console.log("messages loaded"))
    }

    setSelected = (msg) => {
        let selected = false
        this.state.messages.forEach(m => {
            if (Number(m.id) === Number(msg.id)) {
                selected = m.selected
            }
        })
        msg.selected = selected
        return msg
    }

    async loadMessages() {
        let msgs = []

        try {
            let msgsURI = process.env.REACT_APP_MESSAGES_URI
            const res = await fetch(msgsURI)
            const json = await res.json()
            msgs = json._embedded.messages
            console.log(`msgs from API server: ${msgs}`)
            let msgsWithSelected = msgs.map(m => {
                return this.setSelected(m)
            })
            console.log(`msgsWithSelected: ${msgsWithSelected}`)
            const style = this.getSummaryInfo(msgsWithSelected)
            this.setState({messages: msgsWithSelected, selectedStyle: style.selectedStyle})
        } catch (err) {
            console.log('ERROR loading messages from API server: ', err)
        }
        return msgs
    }


    async setStarred(msgId) {
        try {
            let msgRes = await fetch(`${process.env.REACT_APP_MESSAGES_URI}/${msgId}`)
            let msgJson = await msgRes.json()
            let starred = !msgJson.starred

            let theBody = {messageIds: [msgId], command: "star", star: starred}
            console.log(`setStarred(${msgId}) - sending payload: ${theBody}`)

            let resp = await fetch(process.env.REACT_APP_MESSAGES_URI,
                {
                    method: 'PATCH',
                    body: JSON.stringify(theBody),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            if (resp.ok) {
                console.log(' PATCH was successful')
            }
            this.loadMessages()
                .then(() => console.log('In starred handler, just called loadMessage()'))
        } catch (err) {
            console.log(`ERROR in setStarred(${msgId}): ${err}`)
        }
    }

    updateStarredHandler = (messageId) => {
        this.setStarred(messageId)
            .then(() => console.log(`ReactInbox.updateStarredHandler() just called setStarred(${messageId})`))
    }


    //----------------------------------
    // Helper methods
    getSummaryInfo(messages) {
        let selectedFormat = 0
        let selectedCount = 0
        let unreadCount = 0
        messages.map(msg => {
            if (msg.selected === true) selectedCount++
            if (msg.read !== true) unreadCount++
            return selectedCount
        })
        if (selectedCount === messages.length) {
            selectedFormat = AllSelected
        } else if (selectedCount > 0) {
            selectedFormat = SomeSelected
        } else {
            selectedFormat = NoneSelected
        }

        return {selectedStyle: selectedFormat, unreadCount: unreadCount}
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
                })
                resolve(true)
            }
        )
    }


    async patchReadMessages(messages, readFlag) {
        let resp
        let respJson
        //let uri = `${process.env.REACT_APP_MESSAGES_SERVER}${process.env.REACT_APP_MESSAGES_URI}`
        let uri = process.env.REACT_APP_MESSAGES_URI
        let theBody = {
            messageIds: messages,
            command: 'read',
            read: readFlag
        }
        let options = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(theBody)
        }

        console.log(`Setting read state to ${readFlag} for messages: ${messages}, to URI: ${uri}`)
        console.log(` -- PATCH Options: ${JSON.stringify(options)}`)
        try {
            console.log("calling fetch()")
            resp = await fetch(uri, options)
            // console.log("calling resp.json()")
            // respJson = await resp.json()
            if (resp.ok) {
                console.log("PATCH request to API Server returned status OK!")
            } else {
                console.log("PATH request to API Server returned error status: ", resp.statusText)
            }
        } catch (err) {
            console.log(`ERROR calling read PATCH: ${err}`)
        }
    }

    //----------------------------------
    // Handler methods
    markAsReadHandler = () => {
        var updateList = []
        this.state.messages.forEach(m => {
            if (m.selected === true) updateList.push(m.id)
        })

        this.patchReadMessages(updateList, true)
            .then(console.log(" returned from Read PATCH call."))

        var newMsgs = this.state.messages.map(msg => {
            if (msg.selected === true) {
                msg.read = true
            }
            return msg
        })
        let summary = this.getSummaryInfo(newMsgs)
        this.setState(
            {
                messages: newMsgs,
                selectedStyle: summary.selectedStyle,
                unreadMessages: summary.unreadCount
            }
        )
    }

    markAsUnreadHandler = () => {
        var updateList = []
        this.state.messages.forEach(m => {
            if (m.selected === true) updateList.push(m.id)
        })

        this.patchReadMessages(updateList, false)
            .then(console.log(" returned from Unread PATCH call."))


        var newMsgs = this.state.messages.map(msg => {
            if (msg.selected === true) {
                msg.read = false
            }
            return msg
        })
        let summary = this.getSummaryInfo(newMsgs)
        this.setState(
            {
                messages: newMsgs,
                selectedStyle: summary.selectedStyle,
                unreadMessages: summary.unreadCount
            }
        )
    }


    selectMessageHandler = ({messageId}) => {
        console.log('> selectMessageHandler - messageId: ', messageId)
        var newMessages = this.state.messages.map(msg => {
                if (Number(msg.id) === Number(messageId)) {
                    console.log(' .. flipping message.selected')
                    msg.selected = msg.selected === true ? false : true
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

    postNewMessage = async (subject, body) => {
        let resp
        let theBody = {"subject": subject, "body": body}
        let options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(theBody)
        }
        try {
            resp = await fetch(process.env.REACT_APP_MESSAGES_URI, options)
            if (resp.ok) {
                console.log("POST request to API Server returned status OK!")
            } else {
                console.log("POST request to API Server returned error status: ", resp.statusText)
            }
        } catch (err) {
            console.log(`ERROR calling new msg POST: ${err}`)
        }
    }
    addMesssage = ({subject, body}) => {
        this.postNewMessage(subject, body)
            .then(() => console.log('just called postNewMessage()'))
        this.loadMessages()
    }

    async patchDeleteMessages(messages) {
        console.log(`> patchDeleteMessages() for message Ids: ${messages}`)
        let resp
        let uri = process.env.REACT_APP_MESSAGES_URI
        let theBody = {
            messageIds: messages,
            command: 'delete'
        }
        let options = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(theBody)
        }

        try {
            console.log("calling fetch()")
            resp = await fetch(uri, options)
            if (resp.ok) {
                console.log("PATCH for Delete Messages request to API Server returned status OK!")
            } else {
                console.log("PATH request for Delete Messages to API Server returned error status: ", resp.statusText)
            }
        } catch (err) {
            console.log(`ERROR calling delete messages PATCH: ${err}`)
        }
    }

    deleteHandler = () => {
        // Delete all checked messages
        let checkedIds = []
        this.state.messages.forEach(m => {
            if (m.selected === true) {
                checkedIds.push(m.id)
            }
        })
        this.patchDeleteMessages(checkedIds)


        var messages = []
        this.loadMessages(false)
            .then((m) => {
                console.log('after loadMessages call')
                messages = m.slice()
            })
        console.log(`messages: ${messages}`)

        // let summary = this.getSummaryInfo(returnedMessages)
        // this.setState({
        //     messages: uncheckedMessages,
        //     selectedStyle: summary.selectedStyle,
        //     unreadMessages: summary.unreadCount,
        //     totalMessageCount: summary.totalMessageCount,
        //     selectedMessageCount: summary.selectedMessageCount
        // })
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

    async setLabel(msgIds, label, addLabel = true) {
        try {
            let cmd = addLabel === true ? "addLabel" : "removeLabel"
            let theBody = {
                "messageIds": msgIds,
                "command": cmd,
                "label": label

            }
            let resp = await fetch(process.env.REACT_APP_MESSAGES_URI,
                {
                    method: 'PATCH',
                    body: JSON.stringify(theBody),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            if (resp.ok) {
                console.log(' PATCH for setLabel was successful')
            }
            this.loadMessages()
                .then(() => console.log('In setLabel(), just called loadMessage()'))
        } catch (err) {
            console.log(`ERROR in setLabel(${msgIds}): ${err}`)
        }
    }

    applyLabelHandler = (label) => {
        if (label === "Apply label") return
        var msgIds = []
        this.state.messages.forEach(msg => {
                if (msg.selected === true) {
                    msgIds.push(msg.id)
                }
            }
        )
        this.setLabel(msgIds, label, true)
            .then(() => console.log('returned from setLabel()'))
    }

    removeLabelHandler = (label) => {
        if (label === "Remove label") return
        var msgIds = []
        this.state.messages.forEach(msg => {
                if (msg.selected === true) {
                    msgIds.push(msg.id)
                }
            }
        )
        this.setLabel(msgIds, label, false)
            .then(() => console.log('returned from setLabel()'))
    }

    showComposeHandler = () =>{
        this.setState({showCompose: !this.state.showCompose})
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
                        showComposeHandler={this.showComposeHandler}
                    />
                </div>
                <div>
                    {this.state.showCompose && <ComposeMessage sendMessage={this.addMesssage}/> }
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
