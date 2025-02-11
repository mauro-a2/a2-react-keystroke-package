import { useMobileKeystrokeAndroid, A2AndroidTextInput, type IA2CompareResults } from '@area2-ai/a2-react-keystroke-package';

export const AndroidInput = () => {

    const { getNeuroprofile } = useMobileKeystrokeAndroid();

    const handleSubmit = async () => {

        const neuroResponse = await getNeuroprofile('user-id', 'user-token', 'compare');

        if (!neuroResponse) return;

        if (neuroResponse.error) {
            console.log(`Error Title: ${neuroResponse.error}`);
            console.log(`Error Message: ${neuroResponse.message}`);
        }

        if (!neuroResponse.data) return;

        const { self_compare_scores } = neuroResponse.data as IA2CompareResults;

        alert(`Neuroprofile: ${self_compare_scores}`);
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
