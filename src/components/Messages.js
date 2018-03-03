import React from 'react'
import Message from './Message'

const Messages = ({messages}) => {
    return (
        <div>
            Messages here...
            <div>
                {messages.map(msg=>{ return <Message key={msg.id} message={msg} />})}
            </div>
        </div>
    )
}

export default Messages