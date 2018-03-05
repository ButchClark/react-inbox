import React from 'react'

const Message = ({message, selectHandler}) => {
    // console.log("Message: ", message)
    let rowFormat = "row message "
    rowFormat += message.read ? "read " : "unread "
    rowFormat += message.selected ? "selected " : ""

    let msgstarred = message.starred ? "star fa fa-star" : "star fa fa-star-o"

    return (
        <div className={rowFormat}>
            <div className="col-xs-1">
                <div className="row">
                    <div className="col-xs-2">
                        <input name="selectCheckbox" value={message.id} type="checkbox" onChange={selectHandler} checked={message.selected?"checked":""}/>
                    </div>
                    <div className="col-xs-2">
                        <i className={msgstarred}/>
                    </div>
                </div>
            </div>

            <div>
                <div className="col-xs-11">
                    {message.labels.map((lbl,id) =>{
                        return<span key={id} className="label label-warning">{lbl}</span>
                    })}
                    {message.subject}
                </div>
            </div>
        </div>
    )
}

export default Message