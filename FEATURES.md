# AI Code Agent - Enhanced Features

## Overview
The AI Code Agent is an intelligent coding assistant that allows users to generate, edit, and preview web applications in real-time. This enhanced version includes several new features that improve the user experience and functionality.

## New Features

### 1. File Tree Navigation
- Enhanced file explorer with folder support
- Collapsible tree structure for better organization
- Visual indicators for files and folders
- Expand/collapse all folders functionality

### 2. File Search
- Search bar in the file explorer
- Real-time filtering of files by name
- Helpful for projects with many files

### 3. Project Export/Import
- Export entire project as JSON file
- Import projects from JSON files
- Persists file structure and active file state

### 4. Settings Panel
- Toggle for auto-preview functionality
- Visual switch controls
- Clean organization of settings

### 5. Copy to Clipboard
- Copy agent log output to clipboard
- Copy file content to clipboard
- Visual feedback when copy is successful

### 6. Improved Mobile Experience
- Four-panel mobile navigation (Files, Agent, Editor, Preview)
- Better organized mobile UI
- Persistent mobile view states

### 7. Dark/Light Mode Toggle
- Theme switcher in mobile view
- Consistent styling across both themes

### 8. Enhanced Preview Functionality
- Refresh button for preview panel
- Auto-preview option in settings
- Better error handling

## Technical Implementation

### Project Structure
```
├── index.html          # Main HTML entry point
├── vite.config.js      # Vite configuration
├── package.json        # Project dependencies
├── src/
│   ├── App.jsx         # Main React component
│   └── main.jsx        # React entry point
├── README.md           # Project documentation
└── FEATURES.md         # This file
```

### Dependencies
- React 18
- Vite
- Lucide React Icons
- Tailwind CSS (CDN)

### Development Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## How to Use

1. Describe your web application needs in the AI Agent panel
2. Click "Run" to generate the initial code structure
3. Navigate through files using the file explorer
4. Edit files in the code editor
5. Preview your changes in real-time
6. Export your project when finished

## API Integration
The AI agent connects to the Gemini API (using the generative lace endpoint) to process user requests and generate code. The system prompt has been enhanced with additional rules for better code organization and responsiveness.

## UI/UX Improvements
- Better visual hierarchy with consistent spacing
- Improved iconography with Lucide React
- Responsive layout for all screen sizes
- Clear visual feedback for user actions
- Intuitive mobile navigation
