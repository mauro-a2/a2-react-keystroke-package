import { Area2State } from '.';

type Area2ActionType =
    | { type: '[A2 Auth] - Deny Access' }
    | { type: '[A2 Auth] - Allow Access' }

export const area2Reducer = (state: Area2State, action: Area2ActionType): Area2State => {
    switch (action.type) {
        case '[A2 Auth] - Deny Access':
            return {
                ...state,
                canAccess: false,
            }
        case '[A2 Auth] - Allow Access':
            return {
                ...state,
                canAccess: true,
            }
        default:
            return state;
    }
}