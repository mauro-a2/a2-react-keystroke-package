import { Area2State } from '.';

type Area2ActionType =
    | { type: '[A2 Auth] - Deny Access' }
    | { type: '[A2 Auth] - Allow Access' }
    | { type: '[A2 Desktop] - Update text', payload: { newValue: string } }
    | { type: '[A2 iOS] - Update text', payload: { newValue: string } }
    | { type: '[A2 Android] - Update text', payload: { newValue: string } }

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
        case '[A2 Desktop] - Update text':
            return {
                ...state,
                desktopTextValue: action.payload.newValue
            }
        case '[A2 iOS] - Update text':
            return {
                ...state,
                iOSTextValue: action.payload.newValue
            }
        case '[A2 Android] - Update text':
            return {
                ...state,
                androidTextValue: action.payload.newValue
            }
        default:
            return state;
    }
}