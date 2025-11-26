import { useState } from 'react';
import {
  A2CapturePayload,
  A2Textbox,
  useCipherCapture
} from '@area2-ai/a2-react-keystroke-package';

export const App = () => {
  const [inputValue, setInputValue] = useState('');
  const [capturePayload, setCapturePayload] = useState<A2CapturePayload>();

  const { handleEndTypingSession } = useCipherCapture();

  const handleData = () => {
    const payload = handleEndTypingSession();
    if (!payload) { alert('Typing data is empty'); }
    setCapturePayload(payload);
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
      <pre>{JSON.stringify(capturePayload, null, 2)}</pre>
    </div>
  )
}

