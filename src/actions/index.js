// Actions needed...
export const MESSAGES_RECEIVED = "MESSAGES_RECEIVED"
export const MESSAGE_ADDED = "MESSAGE_ADDED"
export const TOGGLE_STAR = "TOGGLE_STAR"
export const MESSAGE_READ = "MESSAGE_READ"
export const MESSAGE_UNREAD = "MESSAGE_UNREAD"
export const ADD_LABEL = "ADD_LABEL"
export const REMOVE_LABEL = "REMOVE_LABEL"
export const TOGGLE_COMPOSE = "TOGGLE_COMPOSE"


export function getMessages() {
    console.log("> actions.getMessages()")
    return async (dispatch) => {
        const resp = await fetch('/api/messages')
        const json = await resp.json()
        // This becomes the "action" object in the reducer
        dispatch({
            type: MESSAGES_RECEIVED,
            messages: json._embedded.messages
            }
        )

    }
}

export function toggleStar(messageId){
    console.log(`actions.toggleStar( ${messageId} )`)
    return async (dispatch) => {
        // POST/PATCH here to set starred
        await console.log(`calling fetch(/api/messages/${messageId}`)
        const resp = await fetch(`/api/messages/${messageId}`)
        const json = await resp.json()
        console.dir(json)
        console.log(`got back starred: ${json.starred}`)
        const response = await fetch(`/api/messages`, {
            method: 'PATCH',
            body: JSON.stringify(
                {
                    messageIds: [{messageId}],
                    command: "star",
                    star: !json.starred
                }),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        })
        // const resp2 = await fetch(`/api/messages/${messageId}`)
        // const json2 = await resp2.json()
        // dispatch({
        //     type: TOGGLE_STAR
        // })
    }
}

export function toggleCompose() {
    return async(dispatch) =>{
        dispatch({
            type: TOGGLE_COMPOSE
        })
    }
}
