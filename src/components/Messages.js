import React from 'react'
import Message from './Message'

const Messages = ({messages, selectHandler}) => {
    return (
        <div>
            Messages here...
            <div>
                {messages.map(msg=>{ return <Message key={msg.id} message={msg} selectHandler={selectHandler}/>})}
            </div>
        </div>
    )
}

export default Messages