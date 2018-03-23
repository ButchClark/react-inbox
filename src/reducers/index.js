import {combineReducers} from 'redux'
import {
    MESSAGES_RECEIVED,
    MESSAGE_ADDED,
    MESSAGE_STARRED,
    MESSAGE_READ,
    MESSAGE_UNREAD,
    ADD_LABEL,
    REMOVE_LABEL,
    TOGGLE_COMPOSE
} from '../actions'

const initialState = {
    messages: []
}

function messages(state = initialState, action) {

    switch (action.type) {
        case MESSAGES_RECEIVED:
            console.log("> reducers.MESSAGES_RECEIVED")
            return {
                ...state,
                messages: action.messages
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

        case TOGGLE_COMPOSE:
            console.log("> reducers.TOGGLE_COMPOSE")
            let show = false
            console.dir(state)
            if(typeof state.messages === "undefined") {
                console.log("state.messages == undefined")
                show = true
            }else if (typeof state.showCompose === "undefined"){
                console.log("state.showCompose == undefined")
                show = true
            }else if (state.showCompose === false){
                console.log("state.messages.showCompose == false")
                show = true
            }else{
                console.log(`else... ${state.showCompose}`)
                show = false
            }

            return {
                ...state,
                showCompose: show
            }

        default:
            console.log(`> reducers.default (action.type: ${action.type})`)
            return {...state}
    }
}

export default combineReducers({
    messages
})