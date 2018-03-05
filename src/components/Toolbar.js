import React from 'react'
import {AllSelected,SomeSelected, NoneSelected} from "./ReactInbox";

const Toolbar = ({selectedStyle, unreadMessages, selectionHandler, deleteHandler, markAsReadHandler}) => {
    let disableThem = false
    console.log('Toolbar - selectedStyle: ', selectedStyle, ', unreadMessagse: ', unreadMessages)

    if(selectedStyle===NoneSelected) disableThem = true

    let selectedFormat = 'fa '
    if(selectedStyle === AllSelected){
        selectedFormat += 'fa-check-square-o'
    }else if (selectedStyle === SomeSelected){
        selectedFormat += 'fa-minus-square-o'
    }else if (selectedStyle === NoneSelected){
        selectedFormat += 'fa-square-o'
    }else{
        console.log('!!! Toolbar got a weird value for selectedStyle: ', selectedStyle)
    }
    console.log('Toolbar - selectedFormat: ',selectedFormat)

    var markAsProps = { className: 'btn btn-default' }
    if(disableThem) markAsProps.disabled=true

    var selectProps = {className: 'form-control label-select'}
    if(disableThem) selectProps.disabled=true

    return (

        <div className="row toolbar">
            <div className="col-md-12">
                <p className="pull-right">
                    <span className="badge badge">{unreadMessages}</span>
                    unread message{unreadMessages===1 ? "" : "s"}
                </p>
                <button className="btn btn-default" onClick={selectionHandler}>
                    <i className={selectedFormat}></i>
                </button>

                <button {...markAsProps} onClick={markAsReadHandler}>Mark As Read</button>
                <button {...markAsProps} onClick={(e)=> {console.log(e.target.value)}}>Mark As Unread</button>

                <select {...selectProps} >
                    <option>Apply label</option>
                    <option value="dev">dev</option>
                    <option value="personal">personal</option>
                    <option value="gschool">gschool</option>
                </select>

                <select {...selectProps} >
                    <option>Remove label</option>
                    <option value="dev">dev</option>
                    <option value="personal">personal</option>
                    <option value="gschool">gschool</option>
                </select>

                <button {...markAsProps} onClick={deleteHandler} >
                    <i className="fa fa-trash-o"></i>
                </button>
            </div>
        </div>
    )
}
export default Toolbar
