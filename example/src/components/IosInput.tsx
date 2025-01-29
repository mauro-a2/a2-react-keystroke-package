import { useMobileKeystrokeIOS, A2IosTextInput } from '@area2-ai/a2-react-keystroke-package';

export const IosInput = () => {

    const { getNeuroprofile } = useMobileKeystrokeIOS('user-id', 'user-token');

    const handleSubmit = async () => {

        const neuroResponse = await getNeuroprofile();

        if (!neuroResponse) return;

        if (neuroResponse.error) {
            console.log(`Error Title: ${neuroResponse.error}`);
            console.log(`Error Message: ${neuroResponse.message}`);
        }

        if (!neuroResponse.data) return;

        alert(`Neuroprofile: ${neuroResponse.data.current_state.fatigue_level}`);
    }

    return (
        <div>
            <A2IosTextInput
                userID='user-id'
                userToken='user-token'
                style={{ width: '300px' }}
            />
            <button onClick={handleSubmit}>Send</button>
        </div>

    )
}
