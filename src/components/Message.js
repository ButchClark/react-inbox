import React from 'react'

const Message = ({message}) => {
    console.log("Message: ", message)
    let msgread = message.read ? "row message read" : "row message unread"
    let msgstarred = message.starred ? "star fa fa-star" : "star fa fa-star-o"

    return (
        <div className={msgread}>
            <div className="col-xs-1">
                <div className="row">
                    <div className="col-xs-2">
                        <input type="checkbox"/>
                    </div>
                    <div className="col-xs-2">
                        <i className={msgstarred}/>
                    </div>
                </div>
            </div>

            <div>
                <div className="col-xs-11">
                    {message.labels.map(lbl =>{
                        return<span className="label label-warning">{lbl}</span>
                    })}
                    {message.subject}
                </div>
            </div>
        </div>
    )
}

export default Message