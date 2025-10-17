import { Area2State } from '.';

type Area2ActionType =
    | { type: '[A2 Desktop] - Update text', payload: { newValue: string } } //! Not used

export const area2Reducer = (state: Area2State, action: Area2ActionType): Area2State => {
    switch (action.type) {
        case '[A2 Desktop] - Update text':
            return {
                ...state,
                desktopTextValue: action.payload.newValue
            }
        default:
            return state;
    }
}