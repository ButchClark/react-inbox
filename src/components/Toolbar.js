import React from 'react'
import {Button, Input, Row} from 'react-materialize'

const Toolbar = ({numUnread}) => {
    return (

        <div className="row toolbar">
            <div className="col-md-12">
                <p className="pull-right">
                    <span className="badge badge">{numUnread}</span>
                    unread messages
                </p>
                <button className="btn btn-default">
                    <i className="fa-minus-square-o"></i>
                </button>

                <button className="btn btn-default">Mark As Read</button>

                <select className="form-control label-select">
                    <option>Apply label</option>
                    <option value="dev">dev</option>
                    <option value="personal">personal</option>
                    <option value="gschool">gschool</option>
                </select>

                <select className="form-control label-select">
                    <option>Remove label</option>
                    <option value="dev">dev</option>
                    <option value="personal">personal</option>
                    <option value="gschool">gschool</option>
                </select>

                <button className="btn btn-default">
                    <i className="fa fa-trash-o"></i>
                </button>
            </div>
        </div>
    )
}
export default Toolbar
            {/*<div>*/}
            {/*<Row>*/}
            {/*<Button name='selectAll'>Select All</Button>*/}
            {/*<Button name='markRead'>Mark Read</Button>*/}
            {/*<Button name='markUnread'>Mark Unread</Button>*/}
            {/*<Input type='select' name='applyLabel'/>*/}
            {/*<Input type='select' name='removeLabel'/>*/}
            {/*<Button name='deleteMessage'>Delete Message</Button>*/}
            {/*{numUnread} unread messages*/}
            {/*</Row>*/}
            {/*</div>*/}
