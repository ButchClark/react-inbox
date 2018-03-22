import React from 'react'
import Messages from './Messages'
import Toolbar from './Toolbar'
import ComposeMessage from './ComposeMessage'
import {connect} from 'react-redux'

export const AllSelected = 1
export const SomeSelected = 2
export const NoneSelected = 3

const ReactInbox = ({messages, showCompose}) => {
    console.log("----- ReactInbox - messages -----")
    console.dir(messages)

    return (
        <div>
            <div>
                {/*<Toolbar*/}
                    {/*selectedStyle={this.state.selectedStyle}*/}
                    {/*unreadMessages={this.state.unreadMessages}*/}
                    {/*deleteHandler={this.deleteHandler}*/}
                    {/*markAsReadHandler={this.markAsReadHandler}*/}
                    {/*markAsUnreadHandler={this.markAsUnreadHandler}*/}
                    {/*addLabelHandler={this.applyLabelHandler}*/}
                    {/*removeLabelHandler={this.removeLabelHandler}*/}
                    {/*selectionHandler={this.updateSelectedButtonHandler}*/}
                    {/*showComposeHandler={this.showComposeHandler}*/}
                {/*/>*/}
            </div>
            <div>
                {showCompose && <ComposeMessage sendMessage={this.addMesssage}/>}
            </div>
            <div>
                {console.log(`Inbox - sending messages: ${messages.messages}`)}
                <Messages
                    name="messages"
                    messages={messages}
                    selectHandler={()=>{alert("selected")}}
                    starHandler={()=>{alert("starred")}}
                />
            </div>
            <div>
                <p>We have this many messages: {(messages.messages)? messages.messages.length : "undefined"}</p>
            </div>
        </div>
    )
}

const mapStateToProps = state =>({
    messages: state.messages,
    showComponse: state.showComponse
})

const mapDispatchToProps = () => ({})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ReactInbox)

