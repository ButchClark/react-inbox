// Actions needed...
export const MESSAGES_RECEIVED = "MESSAGES_RECEIVED"
export const MESSAGE_ADDED = "MESSAGE_ADDED"
export const MESSAGE_STARRED = "MESSAGE_STARRED"
export const MESSAGE_READ = "MESSAGE_READ"
export const MESSAGE_UNREAD = "MESSAGE_UNREAD"
export const ADD_LABEL = "ADD_LABEL"
export const REMOVE_LABEL = "REMOVE_LABEL"


export function getMessages() {
    console.log("> actions.getMessages()")
    return async (dispatch) => {
        const resp = await fetch('/api/messages')
        const json = await resp.json()
        json._embedded.messages.forEach((m) =>{
            console.log(` - msg: ${m.id} - ${m.subject}`)
        })
        dispatch({
            type: MESSAGES_RECEIVED,
            messages: json._embedded.messages
            }
        )

    }

}
