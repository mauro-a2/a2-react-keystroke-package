# [V3] A2 Cipher - Keystroke Data Capture Package

# a2-react-keystroke-package

This package provides secure and efficient collection of user keystroke data using hooks and components designed for both desktop and mobile platforms. The collected data can then be processed by area2 servers to generate a neuroprofile that reflects key indicators of cognitive, behavioral, and motor performance.

---

## **Key Features**

1. **Cross-Platform Compatibility**: Supports data collection for both desktop and mobile browsers with optimized data structures.
2. **Privacy-Focused**: Data collection emphasizes privacy, focusing on timing information without capturing sensitive content.
3. **A2CapturePayload Generation**: Provides the necessary payload for Area2 APIs.

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

Centralized hook for collecting keystroke data across all platforms (desktop, Android, iOS). It automatically detects the platform and applies the appropriate data collection logic. The hook now provides access to the `handleEndTypingSession` event, which returns a collection of data ready to be used as payload for Area2 APIs. You can also extract the resulting collection directly from the hook.

### **Methods and properties**

| **Method** | **Description** |
| --- | --- |
| `handleEndTypingSession` | Ends the typing session and generates/returns the typing data. |
| **Property** |  |
| `A2CapturePayload` | The typing data. |

### One Single Component: `<A2Textbox />`

Component that renders a text input field and generates an A2CapturePayload data. Its state can be managed as other common inputs in React.

### Props

| **Name** | **Type** | **Description** | **Required** |
| --- | --- | --- | --- |
| `target` | TargetPlatform | Optional target platform ('iOS', 'android', 'desktop'). If not provided, it will be auto-detected. | No |
| `handleEndSessionOnEnter` | Function | Optional function to handle ending the session on Enter key press **(only for desktop)**. | No |

**Example Usage**

```tsx
import { useState } from "react";
import {
  A2Textbox,
  useCipherCapture,
} from "@area2-ai/a2-react-keystroke-package";

export const App = () => {
  const [inputValue, setInputValue] = useState("");

  const { handleEndTypingSession, A2CapturePayload } = useCipherCapture();

  const handleData = () => {
    const payload = handleEndTypingSession();
    console.log(payload);
    setInputValue(""); //* Clear input field after sending data (important to avoid inconsistencies)
  };

  return (
    <div>
      <A2Textbox
        style={{ width: "300px" }}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        handleEndSessionOnEnter={handleData}
      />
      <button onClick={handleData}>Send</button>
      <pre>{JSON.stringify(A2CapturePayload, null, 2)}</pre>
    </div>
  );
};
```

---

## **Data Collection Structures**

### **Desktop Data**

Data is collected using the `useCipherCapture` hook for desktop browsers:

```tsx
interface IKeystrokeCollection {
    sessionID: string;                      // Unique identifier for the session
    pressTimes: number[];                   // Key press timestamps
    releaseTimes: number[];                 // Key release timestamps
    keyTypes: string[];                     // Types of keys pressed
    startUnixTime: number;                  // Start time in UNIX format
    timeZone: number;                       // User timezone
    weekday: 'Monday' | 'Tuesday' | ...;    // Day of the week
    qualityCheck: string[];                 // Data validation flags
}
```

### **Mobile Data**

Mobile browsers capture additional context, including autocorrect usage and text predictions:

```tsx
interface IMobileKeystrokeCollection extends IKeystrokeCollection {
    autocorrectLengths: number[];
    autocorrectTimes: number[];
    keyboardArea: { width: number; height: number; x: number; y: number; };
    language: string;
    screenSizePx: { width: number; height: number; };
}
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