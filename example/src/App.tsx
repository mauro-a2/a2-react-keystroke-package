import { useState } from 'react';
import { A2Textbox, useCipherCapture, } from '@area2-ai/a2-react-keystroke-package';

export const App = () => {
  const [inputValue, setInputValue] = useState('');

  const { handleEndTypingSession, A2CapturePayload } = useCipherCapture();

  const handleData = () => {
    const payload = handleEndTypingSession(); //* Also can get typing data from the function.
    console.log(payload);
    setInputValue(''); //* Clear input field after sending data (important - avoid inconsistencies)
  }

  //!Nota: Recordar que al establecer el target en el hook, también se debe establecer en el componente

  return (
    <div>
      <A2Textbox
        style={{ width: '300px' }}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        handleEndSessionOnEnter={handleData}
      />
      <button onClick={handleData}>Send</button>
      <pre>{JSON.stringify(A2CapturePayload, null, 2)}</pre>
    </div>
  )
}

