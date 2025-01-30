import { useMobileKeystrokeAndroid, A2AndroidTextInput } from '@area2-ai/a2-react-keystroke-package';

export const AndroidInput = () => {

    const { getNeuroprofile } = useMobileKeystrokeAndroid('user-id', 'user-token');

    const handleSubmit = async () => {

        const neuroResponse = await getNeuroprofile();

        if (!neuroResponse) return;

        if (neuroResponse.error) {
            console.log(`Error Title: ${neuroResponse.error}`);
            console.log(`Error Message: ${neuroResponse.message}`);
        }

        if (!neuroResponse.data) return;

        alert(`Neuroprofile: ${neuroResponse.data.current_state.behavioral}`);
    }

    return (
        <div>
            <A2AndroidTextInput
                userUID='user-id'
                userToken='user-token'
                style={{ width: '300px' }}
            />
            <button onClick={handleSubmit}>Send</button>
        </div>
    )
}
