import React from 'react'
import Messages from './Messages'
import Toolbar from './Toolbar'
import ComposeMessage from './ComposeMessage'
import {connect} from 'react-redux'
import {toggleStar} from "../actions";
import {bindActionCreators} from "redux"

export const AllSelected = 1
export const SomeSelected = 2
export const NoneSelected = 3

class ReactInbox extends React.Component {

    constructor(props) {
        super(props)
        console.log(`ReactInbox.ctor() - props: ${props}`)
        this.state = {messages: props.messages, showCompose: props.showCompose}

    }

    deleteHandler = () =>{
        console.log(`ReactInbox.deleteHandler() `)
        let selectedMessageIds = []
        this.state.messages.forEach(m=> {
            if(m.selected && m.selected==true){
                selectedMessageIds.push(m.id)
            }
        })
        console.log(` .. num of selectedMessageIds: ${selectedMessageIds.length}`)

    }

    toggleSelectedMessage = (messageId) => {
        console.log(`ReactInbox.toggleSelectedMessage( ${messageId} )`)
    }


    render() {
        return (
            <div>
                <div>
                    <Toolbar
                        // selectedStyle={this.state.selectedStyle}
                        // unreadMessages={this.state.unreadMessages}
                        deleteHandler={this.deleteHandler}
                        // markAsReadHandler={this.markAsReadHandler}
                        // markAsUnreadHandler={this.markAsUnreadHandler}
                        // addLabelHandler={this.applyLabelHandler}
                        // removeLabelHandler={this.removeLabelHandler}
                        // selectionHandler={this.updateSelectedButtonHandler}
                        // showComposeHandler={this.showComposeHandler}
                    />
                </div>
                <div>
                    {this.state.showCompose && <ComposeMessage sendMessage={this.addMesssage}/>}
                </div>
                <div>
                    {console.log(`Inbox - sending messages: ${JSON.stringify(this.state.messages)}`)}
                    <Messages
                        name="messages"
                        messages={this.state.messages}
                        selectHandler={this.toggleSelectedMessage}
                        starHandler={toggleStar}
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    messages: state.messages.messages,
    showCompose: state.messages.showCompose
})

const mapDispatchToProps = (dispatch) => bindActionCreators(
    {
        toggleStar: toggleStar,

    }, dispatch)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ReactInbox)

