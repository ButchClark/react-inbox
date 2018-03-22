import {combineReducers} from 'redux'
import {
    MESSAGES_RECEIVED,
    MESSAGE_ADDED,
    MESSAGE_STARRED,
    MESSAGE_READ,
    MESSAGE_UNREAD,
    ADD_LABEL,
    REMOVE_LABEL
} from '../actions'

function messages(state = {messages: []}, action){

    switch(action.type){
        case MESSAGES_RECEIVED:
            console.log("> reducers.MESSAGES_RECEIVED")
            return {
                ...state
            }

        case MESSAGE_ADDED:
            console.log("> reducers.MESSAGE_ADDED")
            return state

        case MESSAGE_STARRED:
            console.log("> reducers.MESSAGE_STARRED")
            return state

        case MESSAGE_READ:
            console.log("> reducers.MESSAGE_READ")
            return state

        case MESSAGE_UNREAD:
            console.log("> reducers.MESSAGE_UNREAD")
            return state

        case ADD_LABEL:
            console.log("> reducers.ADD_LABEL")
            return state

        case REMOVE_LABEL:
            console.log("> reducers.REMOVE_LABEL")
            return state

        default:
            console.log(`> reducers.default (action.type: ${action.type})`)
            return {...state}
    }
}

export default combineReducers({
    messages
})