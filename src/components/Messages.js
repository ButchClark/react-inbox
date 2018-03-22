import React from 'react'
import Message from './Message'
import {connect} from 'react-redux'

const Messages = ({messages, selectHandler, starHandler}) => {
    console.log(`> Messages - messages:`)
    console.dir(messages)
    return (
        <div>
            <div name='messages'>
                {
                    messages.messages.map(msg=>{
                    return <Message
                        key={msg.id}
                        message={msg}
                        selectHandler={selectHandler}
                        starHandler={starHandler}
                    />})
                }
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    messages: state.messages
})
const mapDispatchToProps = () => ({})
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Messages)