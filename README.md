# VelvetTodo

> "Where intelligence meets aesthetic."

VelvetTodo is a conceptual task management application that blends high-end aesthetic design with the power of Google's Gemini AI. It transforms chaotic, natural language inputs into structured, prioritized actionable items, wrapped in a "sensual" UI that adapts to your focus state.

![Main Interface Placeholder - Insert a screenshot of the main list view here](docs/screenshots/main-view.png)

## ✨ Core Philosophy

VelvetTodo isn't just a checklist; it's an environment.
1.  **Intelligence**: You shouldn't have to fill out forms. Just type "Dinner with Sarah tmrw at 8pm high priority" and let the AI handle the parsing.
2.  **Aesthetics**: The UI uses deep velvet purples, blacks, and subtle animations to create a calming, premium atmosphere.
3.  **Focus**: When the noise gets too loud, **Obsidian Focus** mode strips away the non-essential, leaving only what must be done today.

---

## 🚀 Key Features

### 1. AI-Powered Natural Language Input
Stop fiddling with date pickers. The input area uses **Gemini 1.5 Flash** to parse complex instructions.

*   **Input**: "Finish the quarterly report by next Friday and buy milk later."
*   **Result**: Two distinct tasks created. One High priority with a specific date, one Low priority without a date.

![AI Input Placeholder - Insert a screenshot of the text area and AI processing state](docs/screenshots/ai-input.png)

### 2. Obsidian Focus Mode
Toggle the "Focus" button to enter a distraction-free environment.
*   **Visual Shift**: The theme shifts from Velvet Purple to Ember Orange/Black.
*   **Logic Shift**: Only displays tasks that are **High Priority** or due **Today**.
*   **Zen**: Background animations slow down, and non-essential UI elements fade away.

![Focus Mode Placeholder - Insert a screenshot of the orange/black focus mode interface](docs/screenshots/focus-mode.png)

### 3. Drag-and-Drop Organization
Manage your chaos manually.
*   **List View**: Drag tasks up and down to reorder them based on your personal preference.
*   **Realms View**: Switch to "Realms" to see tasks grouped by priority (The Burning Edge, Balance & Flow, Horizon & Dreams). Drag tasks between columns to instantly change their priority.

![Drag and Drop Placeholder - Insert a GIF or screenshot of dragging a task](docs/screenshots/dnd-demo.gif)

### 4. Google Calendar Integration
With a single click, push your tasks directly to Google Calendar. The app automatically constructs a link with the Task Title, Description, Date, and Time pre-filled.

---

## 🛠 Tech Stack

*   **Framework**: React 19 (via ESM)
*   **Styling**: Tailwind CSS + Custom Animations
*   **AI**: Google GenAI SDK (`@google/genai`)
*   **Icons**: Lucide React
*   **Interactions**: `@hello-pangea/dnd` for accessible drag-and-drop.
*   **Storage**: LocalStorage persistence.

---

## 📦 Setup & Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/velvettodo.git
    ```

2.  **Environment Variables**
    You must provide a Google Gemini API Key.
    Ensure `process.env.API_KEY` is available in your build environment.

3.  **Run the application**
    Open `index.html` via a local server or use your preferred bundler (Vite/Parcel).

---

## 🎨 Design System

**Typography**
*   *Playfair Display*: Used for headers and emotive text.
*   *Inter*: Used for UI elements and readability.

**Color Palette**
*   **Velvet**: `#9d3582` (Primary Brand)
*   **Obsidian**: `#0f050d` (Background)
*   **Ember**: `#f97316` (Focus Mode Accent)

![Design System Placeholder - Insert a screenshot of the color palette or typography](docs/screenshots/design-system.png)

---

## 🔮 Future Roadmap

*   [ ] Voice input via Gemini Live API.
*   [ ] Recurring tasks (e.g., "Every Monday").
*   [ ] Multi-user collaboration "Realms".

---

*The world fades. Only the task remains.*