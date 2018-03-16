import React from 'react'
import Message from './Message'

const Messages = ({messages, selectHandler, starHandler}) => {
    return (
        <div>
            <div name='messages'>
                {messages.map(msg=>{
                    return <Message
                        key={msg.id}
                        message={msg}
                        selectHandler={selectHandler}
                        starHandler={starHandler}
                    />})}
            </div>
        </div>
    )
}

export default Messages