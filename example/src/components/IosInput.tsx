import { useMobileKeystrokeIOS } from '@area2-ai/a2-react-keystroke-package';

export const IosInput = () => {

    const {
        handleInputChange,
        textInput,
        handleKeydown,
        handleKeyup,
        handlePaste,
        handleOnBeforeInput,
        getNeuroprofile,
        isTypingSessionActive
    } = useMobileKeystrokeIOS('user-id-here', 'user-token-here');

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
                placeholder="Using ios mobile input"

                onKeyDownCapture={({ key, currentTarget }) => handleKeydown(key, currentTarget)}
                onKeyUpCapture={({ key }) => {
                    handleKeyup(key);

                    //? Handle ENTER key
                    if (key !== 'Enter') { return }
                    if (!isTypingSessionActive) { return }
                    handleSubmit();
                }}

                value={textInput}
                onChange={handleInputChange}
                onPaste={handlePaste}
                onBeforeInput={({ currentTarget }) => { handleOnBeforeInput(currentTarget.value.length) }}
            />
            <button onClick={handleSubmit}>Send</button>
        </div>

    )
}
