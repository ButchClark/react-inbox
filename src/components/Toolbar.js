import React from 'react'
import {AllSelected, NoneSelected, SomeSelected} from "./ReactInbox";
import {toggleCompose, deleteMessages} from "../actions";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

const addLabelEventHandler = (e, addLabel) =>{
    e.preventDefault()
    addLabel( e.currentTarget.value )
}

const removeLabelEventHandler = (e, removeLabel) => {
    e.preventDefault()
    removeLabel(e.currentTarget.value)
}
const getSelectedMessageIds = (msgs) =>{
    const selectedMsgIds = []
    msgs.forEach((m)=>{
        if(m.selected && m.selected === true){
            selectedMsgIds.push(m.id)
        }
    })
    return selectedMsgIds
}

const Toolbar = ({  messages,
                     toggleCompose,
                     selectedStyle,
                     unreadMessages,
                     selectionHandler,
                     markAsReadHandler,
                     markAsUnreadHandler,
                     addLabelHandler,
                     removeLabelHandler
                 }) => {
    let disableThem = false

    if (selectedStyle === NoneSelected) disableThem = true

    let selectedFormat = 'fa '
    if (selectedStyle === AllSelected) {
        selectedFormat += 'fa-check-square-o'
    } else if (selectedStyle === SomeSelected) {
        selectedFormat += 'fa-minus-square-o'
    } else if (selectedStyle === NoneSelected) {
        selectedFormat += 'fa-square-o'
    } else {
        console.log('!!! Toolbar got a weird value for selectedStyle: ', selectedStyle)
    }

    var markAsProps = {className: 'btn btn-default'}
    if (disableThem) markAsProps.disabled = true

    var selectProps = {className: 'form-control label-select'}
    if (disableThem) selectProps.disabled = true

    return (

        <div className="row toolbar">
            <div className="col-md-12">
                <p className="pull-right">
                    <span className="badge badge">{unreadMessages}</span>
                    unread message{unreadMessages === 1 ? "" : "s"}
                </p>
                <a className="btn btn-danger" onClick={toggleCompose}>
                    <i className="fa fa-plus"></i>
                </a>
                <button className="btn btn-default" onClick={selectionHandler}>
                    <i className={selectedFormat}></i>
                </button>

                <button {...markAsProps} onClick={markAsReadHandler}>Mark As Read</button>
                <button {...markAsProps} onClick={markAsUnreadHandler}>Mark As Unread</button>

                <select {...selectProps} onChange={(e) => {addLabelEventHandler(e,addLabelHandler)}} >
                    <option>Apply label</option>
                    <option value="dev">dev</option>
                    <option value="personal">personal</option>
                    <option value="gschool">gschool</option>
                </select>

                <select {...selectProps} onChange={(e)=>{removeLabelEventHandler(e,removeLabelHandler)}}>
                    <option>Remove label</option>
                    <option value="dev">dev</option>
                    <option value="personal">personal</option>
                    <option value="gschool">gschool</option>
                </select>

                <button {...markAsProps} onClick={(e) => {deleteMessages(getSelectedMessageIds(messages))}}>
                    <i className="fa fa-trash-o"></i>
                </button>
            </div>
        </div>
    )
}

const mapStateToProps =(state) =>({
    messages: state.messages
})

const mapDispatchToProps = dispatch => bindActionCreators({
    toggleCompose: toggleCompose
}, dispatch)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Toolbar)
