# A2 Keystroke Data Collection Package for React

This package enables secure and efficient collection of user keystroke data through hooks, designed for both desktop and mobile platforms. The collected data is processed by **area2** servers to generate a neuroprofile, which reflects key cognitive, behavioral, and motor performance indicators. The package includes built-in validation and privacy controls for API keys to ensure secure access.

---

## **Key Features**

1. **Cross-Platform Compatibility**: Supports data collection for both desktop and mobile browsers with optimized data structures.
2. **Secure API Validation**: The `a2-developer-validation` service ensures API key authentication, status validation, and origin-based restrictions.
3. **Privacy-Focused**: Data collection emphasizes privacy, focusing on timing information without capturing sensitive content.
4. **Real-Time Neuroprofile Generation**: Provides insights into user performance based on collected keystroke data.

---

## **Installation**

Before integrating this package, ensure you have a valid API key from the A2 Developer Dashboard.

### **Step 1: Install the package**

```bash
npm i @area2-ai/a2-react-keystroke-package
```

or

```bash
yarn add @area2-ai/a2-react-keystroke-package
```

### **Step 2: Configure the API key**

Create a configuration file (`area2-config.ts`) to securely store your API key:

```tsx
import type { ICredentialsConfig } from "@area2-ai/a2-react-keystroke-package";

export const config: ICredentialsConfig = {
    apiKey: 'your-api-key-here'
};
```

### **Step 3: Wrap your application with `<Area2Provider>`**

Update the root file of your application:

```tsx
import { Area2Provider } from '@area2-ai/a2-react-keystroke-package';
import { config } from './area2-config';

<Area2Provider config={config}>
  <App />
</Area2Provider>
```

---

## **API Key Validation**

The `a2-developer-validation` service secures access to the Area2 ecosystem by validating API keys through the `web_dev_v0` Firestore collection. This service includes:

1. **Status Validation**: Ensures keys are active before granting access.
2. **Origin Restrictions**: Verifies request origins based on `allowedOrigins` configurations.
3. **Error Handling**: Includes detailed responses for unauthorized or invalid requests.
4. **CORS Support**: Facilitates secure cross-origin communication.

### **Base URL**

```
https://developer.demo.area2-ai.com
```

### **Endpoint: `GET /check-client-access-key`**

### **Headers**

| **Name** | **Type** | **Description** | **Required** |
| --- | --- | --- | --- |
| `Authorization` | String | Bearer token containing the API key. | Yes |
| `Origin` | String | Request origin (must match one of the `allowedOrigins`). | Yes |

### **Request Example**

```bash
curl -H "Authorization: Bearer your-client-key" -H "Origin: https://example.com" https://developer.demo.area2-ai.com/check-client-access-key
```

### **Success Response**

```json
{ "success": true }
```

### **Error Responses**

| **HTTP Status** | **Error Description** | **Example Response** |
| --- | --- | --- |
| `401` | Invalid Authorization Token | `{ "success": false, "error": "Invalid authorization token" }` |
| `404` | User Not Found | `{ "success": false, "error": "User not found" }` |
| `401` | Inactive API Key | `{ "success": false, "error": "Inactive API key" }` |
| `403` | Origin Not Allowed | `{ "success": false, "error": "Origin not allowed" }` |

---

## **Package Overview**

This section explains the available hooks and components for data collection and their usage. Hooks and components differ depending on the platform: desktop, Android, or iOS.

### **Desktop Hook: `useKeystroke`**

Designed for collecting keystroke data on desktop browsers.

### **Methods and properties**

| **Method** | **Description** |
| --- | --- |
| `handleInputChange` | Tracks input field changes. |
| `handleKeydown` | Captures keypress events. |
| `handleKeyup` | Captures key release events. |
| `getNeuroprofile` | Sends collected data to generate a neuroprofile. |
| `getIsTypingSessionActive` | Boolean indicating whether typing is active. |
| **Property** |  |
| `value` | Text input value. |

### Get Neuroprofile params

| **Name** | **Type** | **Description** | **Required** |
| --- | --- | --- | --- |
| `userUID` | String | Unique identifier for the user. | Yes |
| `userToken` | String | Authorization token. | Yes |
| `action` | ”default” \ ”chatbot” \ ”extension” | Optional action that determines the type of response to be received from the server. | No. Default value: “default” |

**Example Usage**

```tsx
const {
  handleInputChange,
  handleKeydown,
  handleKeyup,
  getNeuroprofile,
  value,
  getIsTypingSessionActive,
} = useKeystroke();

<input
  type="text"
  placeholder="Start typing"
  onKeyDownCapture={({ key }) => handleKeydown(key)}
  onKeyUpCapture={({ key }) => handleKeyup(key)}

  value={value}
  onChange={handleInputChange}
/>;

const handleSubmit = async () => {
  const response = await getNeuroprofile("user-id", "user-token");
  console.log(response.data);
};
```

### Desktop Component: `<A2TextInput />`

Component that renders an input field with keystroke tracking and optional submit on Enter key functionality.

### Props

| **Name** | **Type** | **Description** | **Required** |
| --- | --- | --- | --- |
| `handleSubmitOnEnter` | Function | Optional function to handle submit on Enter key press. | No |

**Example Usage**

```tsx
import {
  A2TextInput,
  useKeystroke,
} from "@area2-ai/a2-react-keystroke-package";

const { getNeuroprofile } = useKeystroke();

const handleSubmit = async () => {
  const neuroResponse = await getNeuroprofile("user-id", "user-token");
};

<div>
  <A2TextInput handleSubmitOnEnter={handleSubmit} />
  <button onClick={handleSubmit}>Send</button>
</div>
```

---

### **Mobile Hook: `useMobileKeystrokeAndroid`**

Designed for collecting keystroke data on Android devices.

### **Methods and properties**

| **Method** | **Description** |
| --- | --- |
| `handleInputChange` | Tracks input field changes. |
| `handleKeydown` | Captures keypress events. |
| `handleKeyup` | Captures key release events. |
| `handlePaste` | Captures pasted text. |
| `handleKeyInput` | Handles the key input event. |
| `handleOnBeforeInput` | Handles the before input event. |
| `getNeuroprofile` | Sends collected data to generate a neuroprofile. |
| **Property** |  |
| `value` | Text input value. |

**Example Usage**

```tsx
const {
  handleInputChange,
  handleKeydown,
  handleKeyup,
  handlePaste,
  handleKeyInput,
  handleOnBeforeInput,
  value,
} = useMobileKeystrokeAndroid();

<input
  type="text"
  placeholder="Type on Android"
  autoCapitalize="sentences"

  onKeyDown={({ currentTarget }) => handleKeydown(currentTarget)}
  onKeyUp={handleKeyup}

  value={value}
  onChange={handleInputChange}

  onPaste={handlePaste}
  onInput={({ currentTarget }) => {
    handleKeyInput(currentTarget.value);
  }}
  onBeforeInput={({ currentTarget }) => handleOnBeforeInput(currentTarget.value)}
/>
```

### Mobile Component: `<A2AndroidTextInput />`

Component that renders an input field for Android mobile devices with keystroke tracking.

**Example Usage**

```tsx
import { A2AndroidTextInput } from "@area2-ai/a2-react-keystroke-package";

<div>
  <A2AndroidTextInput />
  <button onClick={handleSubmit}>Send</button>
</div>
```

---

### **Mobile Hook: `useMobileKeystrokeIOS`**

Designed for collecting keystroke data on iOS devices.

### Methods and properties

| **Method** | **Description** |
| --- | --- |
| `handleInputChange` | Tracks input field changes. |
| `handleKeydown` | Captures keypress events. |
| `handleKeyup` | Captures key release events. |
| `handlePaste` | Captures pasted text. |
| `handleOnBeforeInput` | Handles the before input event. |
| `getNeuroprofile` | Sends collected data to generate a neuroprofile. |
| **Property** |  |
| `value` | Text input value. |

**Example Usage**

```tsx
const {
  handleInputChange,
  value,
  handleKeydown,
  handleKeyup,
  handlePaste,
  handleOnBeforeInput,
} = useMobileKeystrokeIOS();

<input
  type="text"
  placeholder="Type on iOS"

  onKeyDownCapture={({ key, currentTarget }) =>
    handleKeydown(key, currentTarget)
  }

  onKeyUpCapture={({ key }) => handleKeyup(key)}

  value={value}
  onChange={handleInputChange}
  onPaste={handlePaste}

  onBeforeInput={({ currentTarget }) => {
    handleOnBeforeInput(currentTarget.value.length);
  }}
/>
```

### Mobile Component: `<A2IosTextInput />`

Component that renders an input field for iOS mobile devices with keystroke tracking

**Example Usage**

```tsx
import { A2IosTextInput } from "@area2-ai/a2-react-keystroke-package";

<div>
  <A2IosTextInput />
  <button onClick={handleSubmit}>Send</button>
</div>
```

---

## **Data Collection Structures**

### **Desktop Data**

Data is collected using the `useKeystroke` hook for desktop browsers:

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
| `Authorization error` | Invalid or missing API key. | Verify that the API key is correct and active. |
| `Empty neuroprofile` | No data collected during the session. | Ensure `handleKeydown` and `handleKeyup` events are triggered. |

---

## **Generating Neuroprofiles**

Use the `getNeuroprofile` function to send collected data and retrieve a neuroprofile.

To generate a neuroprofile, it is necessary to send an **area2 action**, e.g. `‘chatbot’`.

### Available actions

| **Action type** `code` | **Purpose** | **Functionality** | **Neuroprofile Usage** | **Returned Output** |
| --- | --- | --- | --- | --- |
| default `default` | Captures session data, generates a neuroprofile, and stores it in the database. | Generates a **neuroprofile** from user interactions. **Stores the neuroprofile in the database (not exposed).** | **Stores neuroprofile for internal use**. Does not expose it in API responses. | `{ "timestamp": "...", "user_id": "...", "client_id": "..." }` *(Session metadata only)* |
| chatbot `(a2_chatbot)` | Processes neuroprofile data to personalize chatbot responses. | **Post-processes neuroprofile** for AI chatbot adaptation. Tracks **cognitive, motor, stress, and fatigue levels** in real time. Analyzes **daily and weekly trends** to detect performance patterns. | **Personalizes AI chatbot responses** based on cognitive and behavioral trends. | `{ "current_state": { "cognitive": ..., "motor": ..., "stress_level": ... }, "recommended_interaction_time": "Afternoon" }` |
| extension `(a2_extension)` | Summarizes key user metrics and generates a preamble for user-aware AI interactions. | Extracts **key neuroprofile metrics** relevant to AI interactions. **Generates a preamble** to adjust response complexity and tone. Tracks **self-comparison scores** for contextual adaptation. Identifies **peak hours** for user engagement. | **Creates a summary of neuroprofile metrics** for real-time AI interaction adjustments. | `{ "ai_preamble": "...", "overall_state": 0.59, "peak_day_hours": [10, 14] }` |

### **Example Usage**

```tsx
const {
  handleInputChange,
  handleKeydown,
  handleKeyup,
  getNeuroprofile,
} = useKeystroke();

const handleSubmit = async () => {
  const response = await getNeuroprofile('user-id', 'user-token', 'chatbot');
  if (response?.data) console.log('Neuroprofile:', response.data);
};
```

### Sample Response

```json
{"current_state": {"behavioral": 0.40,"cognitive": 0.60,"fatigue_level": 0.69,"motor": 0.64,"stress_level": 0.37},"daily_trends": {"Morning": { "cognitive": 0.59, "emotional": 0.38, "motor": 0.63, "n_sessions": 125 },...},"weekly_trends": {"Monday": { "cognitive": 0.59, "emotional": 0.38, "motor": 0.63, "n_sessions": 123 },...},"recommended_interaction_time": "Morning","timestamp": "2025-01-02 10:07"}
```

---

## **CORS and Preflight Requests**

The `a2-developer-validation` service supports CORS to enable secure communication between domains. Preflight requests (`OPTIONS`) are automatically handled.

### **Preflight Response**

- **Status**: `204 No Content`
- **Headers**:
    - `Access-Control-Allow-Origin`: Reflects request origin.
    - `Access-Control-Allow-Methods`: `GET`, `POST`, `OPTIONS`.
    - `Access-Control-Allow-Headers`: `Authorization`, `Content-Type`.

---

## **Testing your A2 Developer Key**

### **Valid Key**

```bash
curl -H "Authorization: Bearer your-client-key" -H "Origin: https://example.com" https://developer.demo.area2-ai.com/check-client-access-key
```

**Response:**

```json
{ "success": true }
```

### **Invalid Key**

```bash
curl -H "Authorization: Bearer invalid-key" -H "Origin: https://example.com" https://developer.demo.area2-ai.com/check-client-access-key
```

**Response:**

```json
{ "success": false, "error": "User not found" }
```

---

## **Best Practices**

- **Environment Variables**: Store API keys in environment files and access them securely in your app.
- **Error Handling**: Always implement error-handling mechanisms for API failures.
- **Access Restrictions**: Use `allowedOrigins` to control API usage by domain.

---

## Run example

Open a terminal and execute the following:

```
cd .\example\

yarn

yarn add @area2-ai/a2-react-keystroke-package

yarn dev
```

## Run Project Locally (For Devs)

1. Rename file `.env.template` to `.env`
2. Provide dev keys specified in file
3. Run in dev mode