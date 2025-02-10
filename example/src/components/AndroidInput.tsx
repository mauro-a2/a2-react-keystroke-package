import { useMobileKeystrokeAndroid, A2AndroidTextInput } from '@area2-ai/a2-react-keystroke-package';

export const AndroidInput = () => {

    const { getNeuroprofile } = useMobileKeystrokeAndroid();

    const handleSubmit = async () => {

        const neuroResponse = await getNeuroprofile('user-id', 'user-token');

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
                style={{ width: '300px' }}
            />
            <button onClick={handleSubmit}>Send</button>
        </div>
    )
}
