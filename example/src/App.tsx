import { useState } from 'react';
import { A2Textbox, useCipherCapture, } from '@area2-ai/a2-react-keystroke-package';

export const App = () => {
  const [inputValue, setInputValue] = useState('');

  const { handleEndTypingSession } = useCipherCapture();

  //!Nota: Recordar que al establecer el target en el hook, también se debe establecer en el componente

  // TODO iOS: Necesario para detectar cambios de auto-corrección
  // useEffect(() => {
  //   processAutoCorrection(inputValue);
  // }, [inputValue]);

  return (
    <div>
      <A2Textbox
        style={{ width: '300px' }}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={handleEndTypingSession}>Send</button>
    </div>
  )
}

