import { A2TextInput, useKeystroke } from '@area2-ai/a2-react-keystroke-package';

export const DesktopInput = () => {
    const { getNeuroprofile } = useKeystroke('user-id', 'user-token');

    const handleSubmit = async () => {

        const neuroResponse = await getNeuroprofile();

        if (!neuroResponse) return;

        if (neuroResponse.error) {
            console.log(`Error Title: ${neuroResponse.error}`);
            console.log(`Error Message: ${neuroResponse.message}`);
        }

        if (!neuroResponse.data) return;

        console.log(`Neuroprofile: ${JSON.stringify(neuroResponse.data)}`);
    }

    return (
        <div>
            <A2TextInput
                userID='user-id'
                userToken='user-token'
                handleSubmitOnEnter={handleSubmit}
                style={{ width: '300px' }}
            />
            <button onClick={handleSubmit}>Send</button>
        </div>
    );
}
