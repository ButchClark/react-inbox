import React from 'react'

const Message = ({message}) => {
    // console.log("Message: ", message)
    let rowFormat = "row message "
    rowFormat += message.read ? "read " : "unread "
    rowFormat += message.selected ? "selected " : ""

    let msgstarred = message.starred ? "star fa fa-star" : "star fa fa-star-o"

    function checkedIt(e) {
        e.preventDefault()
        console.log("we checked the checkbox: ", e.target.selectCheckbox)
    }
    return (
        <div className={rowFormat}>
            <div className="col-xs-1">
                <div className="row">
                    <div className="col-xs-2">
                        <input name="selectCheckbox" type="checkbox" onChange={checkedIt} checked={message.selected?"checked":""}/>
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