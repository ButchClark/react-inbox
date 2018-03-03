import React from 'react'

const Message = ({message}) => {
    console.log("Message: ", message)
    return (
        <div>
            <p> id: {message.id} </p>
            <p> read: {message.read.toString()}</p>
            <p> starred: {message.starred.toString()}</p>
            <p> tags: {message.lagels}</p>
            <p> subject: {message.subject}</p>
        </div>
    )
}

export default Message