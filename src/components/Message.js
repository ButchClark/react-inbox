import React from 'react'
import {toggleStar, shit} from "../actions";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

const starClickHandler = (e, upstreamHandler) => {
    e.preventDefault()
    if(!upstreamHandler){
        console.log("Message.starClickHandler: upstreamHandler is NULL/empty")
    }


    // ------------------------------------------
    // sending data on the event object.
    // Accessed as:  e.target.dataset.myvarname
    // Set like this on a component:
    //   <Thing data-myvarname="XYZ" ...
    // ------------------------------------------
    console.log(`Message.starClickHandler for msg: ${e.target.dataset.messagenum}`)
    console.log('Calling upstreamHandler()')
    // upstreamHandler(e.target.dataset.messagenum)
    console.log(`After calling upstreamHandler`)
    shit(1)

}

const selectMessageHandler = (e, selectHandler) => {
    // The following preventDefault() was breaking the normal
    //  checkbox event handling.
    // e.preventDefault()
    console.log(`Message.selectMessageHandler - calling selectHandler( ${e.currentTarget.value} )`)
    console.log(' .. selectHandler is...')
    console.dir(selectHandler)
    selectHandler({messageId: e.currentTarget.value})
}

const Message = ({message, selectHandler}) => {

    console.log(`Message: - message: ${message}`)
    console.log(`Message: - selectHandler: ${selectHandler}`)

    var checkboxOptions = {
        name: "selectCheckbox",
        value: message.id,
        type: "checkbox",
        onChange: (e) => {
            selectMessageHandler(e, selectHandler)
        }
    }
    // console.dir(message)

    if (message.selected) {
        checkboxOptions.checked = true
        console.log(" .. We are setting Checked: ", checkboxOptions)
    }

    // console.log("checkbox options: ", checkboxOptions)

    let rowFormat = "row message "
    rowFormat += message.read ? "read " : "unread "
    rowFormat += message.selected ? "selected " : ""
    let checkedStatus = message.selected === true ? "checked" : ""

    // console.log("MessageId: ", message.id, ', selected: ',message.selected,', checkedStatus: ',checkedStatus, ', starred: ',message.starred)

    let msgstarred = message.starred ? "star fa fa-star" : "star fa fa-star-o"

    return (
        <div className={rowFormat}>
            <div className="col-xs-1">
                <div className="row">
                    <div className="col-xs-2">
                        <input
                            name="selectCheckbox"
                            value={message.id}
                            type="checkbox"
                            onChange={(e) => selectMessageHandler(e, selectHandler)}
                            checked={checkedStatus}/>
                    </div>
                    <div className="col-xs-2">
                        <i name="star"
                           data-messagenum={message.id}
                           data-msg="MyMsg"
                           value={message.id}
                           onClick={(e) => {
                               starClickHandler(e, toggleStar)
                           }}
                           className={msgstarred}/>
                    </div>
                </div>
            </div>

            <div>
                <div className="col-xs-11">
                    {message.labels.map((lbl, id) => {
                        return <span key={id} className="label label-warning">{lbl}</span>
                    })}
                    {message.subject}
                </div>
            </div>
        </div>
    )
}

const mapStateToProps =(state) =>({
    selectHandler: state.selectHandler
})

const mapDispatchToProps = dispatch => bindActionCreators({
    toggleStar: toggleStar
}, dispatch)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Message)
