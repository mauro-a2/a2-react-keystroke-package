import { useKeystroke } from '@area2-ai/a2-react-keystroke-package';

export const DesktopInput = () => {
    const {
        handleInputChange,
        handleKeydown,
        handleKeyup,
        textInput,
        getNeuroprofile,
        isTypingSessionActive
    } = useKeystroke('user-id-here', 'user-token-here');

    const handleSubmit = async () => {

        const neuroResponse = await getNeuroprofile();

        if (!neuroResponse) return;

        if (neuroResponse.error) {
            console.log(`Error Title: ${neuroResponse.error}`);
            console.log(`Error Message: ${neuroResponse.message}`);
        }

        if (!neuroResponse.data) return;

        console.log(`Neuroprofile: ${neuroResponse.data}`);
    }

    return (
        <div>
            <input
                type="text"
                placeholder="Using desktop collection"

                onKeyDownCapture={({ key }) => handleKeydown(key)}
                onKeyUpCapture={({ key }) => {
                    handleKeyup(key);

                    //? Handle ENTER key
                    if (key !== 'Enter') { return }
                    if (!isTypingSessionActive) { return }
                    handleSubmit();
                }}

                value={textInput}
                onChange={handleInputChange}
            />
            <button onClick={handleSubmit}>Send</button>
        </div>
    );
}
