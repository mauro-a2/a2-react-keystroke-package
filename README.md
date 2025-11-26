# [V3] A2 Cipher - Keystroke Data Capture Package

# a2-react-keystroke-package

This package provides secure and efficient collection of user keystroke data using hooks and components designed for both desktop and mobile platforms. The collected data can then be processed by area2 servers to generate a neuroprofile that reflects key indicators of cognitive, behavioral, and motor performance.

---

## **Key Features**

1. **Cross-Platform Compatibility**: Supports data collection for both desktop and mobile browsers with optimized data structures.
2. **Privacy-Focused**: Data collection emphasizes privacy, focusing on timing information without capturing sensitive content.
3. **A2CapturePayload Generation**: Provides the necessary payload for Area2 APIs through the `A2CapturePayload` interface.

---

## **Installation**

### **Step 1: Install the package**

```bash
npm i @area2-ai/a2-react-keystroke-package
```

or

```bash
yarn add @area2-ai/a2-react-keystroke-package
```

### **Step 2: Wrap your application with `<Area2Provider>`**

Update the root file of your application:

```tsx
import { Area2Provider } from '@area2-ai/a2-react-keystroke-package';

<Area2Provider>
  <App />
</Area2Provider>
```

---

## **Package Overview**

This section explains the available hooks and components for data collection. The package now automatically detects the platform (desktop, Android, or iOS) and applies the appropriate data collection logic. You can also manually specify the platform if needed.

### **Centralized Hook: `useCipherCapture`**

Centralized hook for collecting keystroke data across all platforms (desktop, Android, iOS). It automatically detects the platform and applies the appropriate data collection logic. The hook now provides access to the `handleEndTypingSession` event, which returns a collection of data ready to be used as payload for Area2 APIs.

### **Methods**

| **Method** | **Description** |
| --- | --- |
| `handleEndTypingSession` | Ends the typing session and returns the typing data. |

### One Single Component: `<A2Textbox />`

Component that renders a text input field and generates an A2CapturePayload data. Its state can be managed as other common inputs in React.

### Props

| **Name** | **Type** | **Description** | **Required** |
| --- | --- | --- | --- |
| `target` | TargetPlatform | Optional target platform ('iOS', 'android', 'desktop'). If not provided, it will be auto-detected. | No |
| `handleEndSessionOnEnter` | Function | Optional function to handle ending the session on Enter key press **(only for desktop)**. | No |

**Example Usage**

```tsx
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
```

---

## **Data Collection Structures**

### **A2CapturePayload Interface**

The `A2CapturePayload` interface is the unified structure returned by `handleEndTypingSession()`. It extends the base keystroke collection and includes both desktop and mobile-specific fields as optional properties, making it compatible with all platforms.

This interface combines all possible fields from desktop and mobile data collection, where mobile-specific fields (like `emojis`, `predictionLengths`, etc.) are optional and only present when collected on mobile platforms.

### **Desktop Data**

Data is collected using the `useCipherCapture` hook for desktop browsers:

```tsx
interface IKeystrokeCollection {
    appContext: string;                     // Application context identifier
    keyAreas: number[];                     // Keyboard area identifiers for each keystroke
    keyTypes: string[];                     // Types of keys pressed
    length: number;                         // Total number of keystrokes captured
    pressTimes: number[];                   // Key press timestamps (in microseconds)
    releaseTimes: number[];                 // Key release timestamps (in microseconds)
    season: 'Winter' | 'Spring' | 'Summer' | 'Fall';  // Season of the year
    sessionID: string;                      // Unique identifier for the session
    startUnixTime: number | null;           // Start time in UNIX format (timestamp in seconds)
    time: 'Morning' | 'Afternoon' | 'Evening' | 'Night';  // Time of day
    timeZone: number;                       // User timezone offset
    weekday: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';  // Day of the week
}
```

### **Mobile Data**

Mobile browsers capture additional context, including text predictions and device information:

```tsx
interface IMobileKeystrokeCollection extends IKeystrokeCollection {
    emojis: string[];                       // Emojis used during the session
    keyboardArea?: KeyboardArea;            // Optional keyboard dimensions and position
    language: string;                       // Keyboard language setting
    layout: string;                         // Keyboard layout type
    pasteLengths: number[];                 // Lengths of pasted text segments
    pasteTimes: number[];                   // Timestamps when paste operations occurred (in microseconds)
    performance: number[];                  // Performance metrics (in microseconds)
    predictionLengths: number[];            // Lengths of text from predictions
    predictionTimes: number[];              // Timestamps when predictions were used (in microseconds)
    screenSizeMm: ScreenSize;               // Screen dimensions in millimeters
    screenSizePx: ScreenSize;               // Screen dimensions in pixels
    textField: TextFieldTypes;              // Type of text field being used
}

interface ScreenSize {
    width: number;
    height: number;
}

interface KeyboardArea extends ScreenSize {
    x: number;                              // Horizontal position
    y: number;                              // Vertical position
}

type TextFieldTypes = 'Text' | 'Url' | 'Email' | 'Numbers' | 'Twitter' | 'Websearch' | 'Text_ACOFF' | 'Twitter_ACOFF';
```

---

## **Error Handling**

### **Common Errors in Hooks**

| **Error Scenario** | **Cause** | **Solution** |
| --- | --- | --- |
| `Empty neuroprofile` | No data collected during the session. | Ensure `handleEndTypingSession` event is triggered.
Also be sure to handle the text value state properly. |

---

## Run example

---

Open a terminal and execute the following:

```
cd .\example\

yarn

yarn dev
```

## Run Project Locally

1. Install dev dependencies run: `yarn`
2. Run in dev mode `yarn start`

**To test the package locally in the example directory**

1. Open a terminal in the project root and register the package locally running `yarn link`.
2. Open another terminal in the `example` folder and link the local package running `yarn link @area2-ai/a2-react-keystroke-package`

Now, when you launch the sample app, it will use the local version of the package.