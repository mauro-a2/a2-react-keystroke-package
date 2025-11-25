import { useState } from 'react';
import { A2Textbox, useCipherCapture, } from '@area2-ai/a2-react-keystroke-package';

export const App = () => {
  const [inputValue, setInputValue] = useState('');
  const [capturePayload, setCapturePayload] = useState('');

  const { handleEndTypingSession } = useCipherCapture();

  const handleData = () => {
    const payload = handleEndTypingSession();
    setCapturePayload(JSON.stringify(payload, null, 2));
    setInputValue(''); //* Clear input field after sending data (important to avoid inconsistencies)
  }

  return (
    <div>
      <A2Textbox
        style={{ width: '300px' }}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        handleEndSessionOnEnter={handleData}
      />
      <button onClick={handleData}>Send</button>
      <pre>{capturePayload}</pre>
    </div>
  )
}

