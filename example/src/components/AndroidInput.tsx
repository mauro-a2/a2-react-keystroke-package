import { useMobileKeystrokeAndroid } from '@area2-ai/a2-react-keystroke-package';

export const AndroidInput = () => {

    const {
        handleInputChange,
        textInput,
        handleKeydown,
        handleKeyup,
        handlePaste,
        getNeuroprofile,
        handleKeyInput,
        handleBeforeInput
    } = useMobileKeystrokeAndroid('user-id-here', 'user-token-here');

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
                placeholder="Using android mobile input"
                autoCapitalize="sentences"

                onKeyDown={({ currentTarget }) => handleKeydown(currentTarget)}
                onKeyUp={handleKeyup}

                value={textInput}
                onChange={handleInputChange}

                onPaste={handlePaste}
                onInput={({ currentTarget }) => { handleKeyInput(currentTarget.value) }}
                onBeforeInput={({ currentTarget }) => handleBeforeInput(currentTarget.value)}
            />
            <button onClick={handleSubmit}>Send</button>
        </div>
    )
}
