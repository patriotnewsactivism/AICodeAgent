<content>import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  FileCode, Play, Sparkles, Loader2, TriangleAlert, Bot, User, CornerDownLeft, 
  Terminal, Github, FilePlus, Trash2, FolderGit2, UploadCloud, DownloadCloud,
  ChevronDown, ChevronRight, Menu, X, LayoutPanelLeft, BrainCircuit, Code, MonitorPlay,
  Search, Save, FileUp, FileDown, FolderPlus, RefreshCw, Settings, Moon, Sun,
  Zap, Eye, EyeOff, Copy, Check, Folder, File, History, Share2, ExternalLink
} from 'lucide-react';

// --- Default File Structure ---
const defaultFiles = [
  {
    path: 'index.html',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="style.css">
  <title>AI Agent Project</title>
</head>
<body class="bg-gray-100 font-sans">
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold text-gray-800">Hello, World!</h1>
    <p class="text-gray-600 mt-2">
      This is your project. Ask the AI agent to build something!
    </p>
    <button id="myButton" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
      Click Me
    </button>
  </div>
  <script src="script.js"></script>
</body>
</html>`
  },
  {
    path: 'script.js',
    content: `document.getElementById('myButton').addEventListener('click', () => {
  alert('Hello from script.js!');
});`
  },
  {
    path: 'style.css',
    content: `/* You can add custom CSS here */
h1 {
  color: #2c5282; /* A darker blue */
}`
  }
];

// --- Mock Repo for GitHub Import ---
const mockRepo = [
  { path: 'README.md', content: '# My Imported Repo\n\nThis is a mock repo imported from GitHub.' },
  { 
    path: 'index.html', 
    content: `<!DOCTYPE html>
<html>
<head><title>Imported</title><script src="https://cdn.tailwindcss.com"></script></head>
<body class="bg-green-100 flex items-center justify-center h-screen">
  <h1 class="text-4xl text-green-800 font-bold">Repo Imported Successfully!</h1>
</body>
</html>` 
  },
  { path: 'src/utils.js', content: '// Utility functions\nfunction helper() {\n  console.log("Helper function");\n}' },
  { path: 'src/components/Button.js', content: '// Button component\nfunction Button({ text, onClick }) {\n  return <button onClick={onClick}>{text}</button>;\n}' }
];


// --- Helper: Exponential Backoff Fetch ---
async function fetchWithBackoff(url, options, retries = 3, delay = 1000) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      if (response.status === 429 && retries > 0) {
        await new Promise(res => setTimeout(res, delay));
        return fetchWithBackoff(url, options, retries - 1, delay * 2);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Fetch error:", error.message);
    throw error;
  }
}

// --- Helper: File Tree Structure ---
const buildFileTree = (files) => {
  const root = { name: 'root', type: 'folder', children: {} };
  
  files.forEach(file => {
    const pathParts = file.path.split('/');
    let current = root.children;
    
    pathParts.forEach((part, index) => {
      if (index === pathParts.length - 1) {
        // This is a file
        current[part] = { name: part, type: 'file', path: file.path };
      } else {
        // This is a folder
        if (!current[part]) {
          current[part] = { name: part, type: 'folder', children: {} };
        }
        current = current[part].children;
      }
    });
  });
  
  return root.children;
};

// --- Helper: Flatten File Tree ---
const flattenFileTree = (tree, prefix = '') => {
  let files = [];
  
  Object.values(tree).forEach(node => {
    if (node.type === 'file') {
      files.push(node.path);
    } else if (node.type === 'folder') {
      files = files.concat(flattenFileTree(node.children, prefix + node.name + '/'));
    }
  });
  
  return files;
};

// --- Main App Component ---
export default function App() {
  const [files, setFiles] = useState(defaultFiles);
  const [activeFilePath, setActiveFilePath] = useState('index.html');
  const [prompt, setPrompt] = useState("");
  const [previewContent, setPreviewContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [agentLog, setAgentLog] = useState("Agent standing by...");
  
  // GitHub Sim State
  const [isGithubAuthed, setIsGithubAuthed] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showPushModal, setShowPushModal] = useState(false);

  // UI State
  const [mobileView, setMobileView] = useState('editor'); // 'files', 'agent', 'editor', 'preview'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // For file/github toggle
  const [expandedFolders, setExpandedFolders] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [autoPreview, setAutoPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fileTree, setFileTree] = useState({});

  // Build file tree when files change
  useEffect(() => {
    setFileTree(buildFileTree(files));
  }, [files]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e) => {
      // Ctrl/Cmd + S: Save (trigger preview refresh)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleRefreshPreview();
      }
      // Ctrl/Cmd + /: Toggle AI agent panel (mobile)
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setMobileView('agent');
      }
      // F5: Refresh preview
      if (e.key === 'F5') {
        e.preventDefault();
        handleRefreshPreview();
      }
      // Ctrl/Cmd + P: Quick file search (focus search)
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        document.querySelector('input[placeholder*="Search"]')?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, []);

  const activeFile = useMemo(() =>
    files.find(f => f.path === activeFilePath),
    [files, activeFilePath]
  );

  // --- System Prompt for the AI Agent (now smarter) ---
  const systemPrompt = `
    You are an expert AI coding agent. Your goal is to modify a project's file system based on the user's prompt.

    RULES:
    1.  **JSON OUTPUT:** You MUST respond with a single JSON object. Do not include markdown or any text outside the JSON.
    2.  **JSON Schema:** The JSON object must have two keys:
        * \`thought\`: (string) A brief explanation of your plan.
        * \`operations\`: (array) An array of file operations.
    3.  **OPERATIONS:** Each operation in the \`operations\` array must be an object with:
        * \`action\`: (string) One of "create_file", "update_file", or "delete_file".
        * \`path\`: (string) The full path of the file (e.g., "index.html", "src/main.js").
        * \`content\`: (string) The *full* new content for "create_file" and "update_file". (Not required for "delete_file").
    4.  **CONTEXT:** I will provide you with the current file list and the content of the currently active file.
    5.  **SINGLE HTML:** If you create a web page, all CSS (Tailwind) and JS should be in a single HTML file unless the user *specifically* asks for separate .js or .css files.
    6.  **TAILWIND:** Always include \`<script src="https://cdn.tailwindcss.com"></script>\` in the <head> of any new HTML file.
    7.  **ORGANIZATION:** When creating multiple files, organize them in appropriate folders (e.g., src/components, src/utils, etc.)
    8.  **RESPONSIVENESS:** Ensure all web pages are responsive using Tailwind's responsive utilities.
    9.  **ACCESSIBILITY:** Follow basic accessibility guidelines (proper contrast, semantic HTML, etc.)
  `;

  // --- Function to build the preview HTML ---
  const buildPreviewHtml = () => {
    const mainHtmlFile = files.find(f => f.path === 'index.html');
    if (!mainHtmlFile) {
      setError("No index.html file found to preview.");
      return "";
    }

    let htmlContent = mainHtmlFile.content;

    // Inline <script src="...">
    htmlContent = htmlContent.replace(/<script\s+src="([^"]+)"\s*><\/script>/g, (match, src) => {
      if (src.startsWith('http') || src.startsWith('//')) return match; // Keep external scripts
      const scriptFile = files.find(f => f.path === src);
      if (scriptFile) {
        return `<script>${scriptFile.content}<\/script>`;
      }
      console.warn(`Could not find local script: ${src}`);
      return ''; // Remove if not found
    });

    // Inline <link rel="stylesheet" href="...">
    htmlContent = htmlContent.replace(/<link\s+rel="stylesheet"\s+href="([^"]+)">/g, (match, href) => {
      if (href.startsWith('http') || href.startsWith('//')) return match; // Keep external links
      const cssFile = files.find(f => f.path === href);
      if (cssFile) {
        return `<style>${cssFile.content}</style>`;
      }
      console.warn(`Could not find local stylesheet: ${href}`);
      return ''; // Remove if not found
    });

    return htmlContent;
  };

  // --- Function to call Gemini API ---
  const handleGenerateCode = useCallback(async () => {
    if (!prompt) {
      setError("Please enter a prompt for the AI agent.");
      return;
    }

    // Check for API key
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
    if (!apiKey) {
      setError("⚠️ Gemini API key not found. Please add VITE_GEMINI_API_KEY to your .env file. Get your key at https://ai.google.dev");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAgentLog("Contacting AI agent...");

    const modelName = import.meta.env.VITE_MODEL_NAME || "gemini-2.0-flash-exp";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
    
    // Provide context to the AI
    const fileList = files.map(f => f.path);
    const contextPrompt = `
      User Prompt: "${prompt}"

      Current File List:
      ${JSON.stringify(fileList)}

      Currently Active File ("${activeFile?.path}"):
      ---
      ${activeFile?.content || 'No file is active.'}
      ---
    `;

    const payload = {
      contents: [{ parts: [{ text: contextPrompt }] }],
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      generationConfig: {
        responseMimeType: "application/json",
      }
    };

    try {
      const result = await fetchWithBackoff(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const candidate = result.candidates?.[0];
      if (!candidate || !candidate.content?.parts?.[0]?.text) {
        throw new Error("Invalid response structure from API.");
      }

      const jsonResponse = JSON.parse(candidate.content.parts[0].text);
      setAgentLog(jsonResponse.thought || "Agent executed plan.");

      // Apply file operations
      setFiles(currentFiles => {
        let newFiles = [...currentFiles];
        for (const op of jsonResponse.operations) {
          switch (op.action) {
            case 'create_file':
              if (newFiles.find(f => f.path === op.path)) {
                setAgentLog(prev => prev + `\n- WARN: File ${op.path} already exists. Updating it.`);
                newFiles = newFiles.map(f => f.path === op.path ? { ...f, content: op.content } : f);
              } else {
                newFiles.push({ path: op.path, content: op.content });
                setAgentLog(prev => prev + `\n- Created: ${op.path}`);
              }
              // Set new file as active
              setActiveFilePath(op.path); 
              break;
            case 'update_file':
              if (!newFiles.find(f => f.path === op.path)) {
                setAgentLog(prev => prev + `\n- WARN: File ${op.path} not found. Creating it.`);
                newFiles.push({ path: op.path, content: op.content });
              } else {
                newFiles = newFiles.map(f => f.path === op.path ? { ...f, content: op.content } : f);
                setAgentLog(prev => prev + `\n- Updated: ${op.path}`);
              }
              // Ensure updated file is active
              setActiveFilePath(op.path);
              break;
            case 'delete_file':
              newFiles = newFiles.filter(f => f.path !== op.path);
              setAgentLog(prev => prev + `\n- Deleted: ${op.path}`);
              if (activeFilePath === op.path) {
                setActiveFilePath(newFiles.length > 0 ? newFiles[0].path : null);
              }
              break;
            default:
              console.warn(`Unknown operation: ${op.action}`);
          }
        }
        return newFiles;
      });

      // Auto-run preview if enabled
      if (autoPreview) {
        setTimeout(() => {
          handleRunCode();
        }, 1000);
      }

    } catch (err) {
      console.error(err);
      let errorMsg = `Failed to get valid AI response. ${err.message}`;
      if (err instanceof SyntaxError) {
        errorMsg = "AI returned invalid JSON. Check console for details.";
      }
      setError(errorMsg);
      setAgentLog(`Error: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, systemPrompt, files, activeFile, autoPreview]);

  // --- Function to run the code in the editor ---
  const handleRunCode = () => {
    setError(null);
    setAgentLog("Building preview...");
    try {
      const html = buildPreviewHtml();
      setPreviewContent(html);
      setAgentLog("Preview updated.");
      setMobileView('preview'); // Switch to preview on mobile
    } catch (err) {
      console.error(err);
      setError(`Failed to build preview: ${err.message}`);
      setAgentLog(`Error: ${err.message}`);
    }
  };

  // --- File Management Handlers ---
  const handleFileChange = (newContent) => {
    setFiles(files.map(f => 
      f.path === activeFilePath ? { ...f, content: newContent } : f
    ));
  };

  const handleSelectFile = (path) => {
    setActiveFilePath(path);
    setMobileView('editor'); // Switch to editor on mobile
    setIsMobileMenuOpen(false);
  };

  const handleCreateFile = () => {
    const newFileName = prompt("Enter new file name (e.g., app.js):");
    if (newFileName && !files.find(f => f.path === newFileName)) {
      setFiles([...files, { path: newFileName, content: `// ${newFileName}` }]);
      setActiveFilePath(newFileName);
      setMobileView('editor');
      setIsMobileMenuOpen(false);
    } else if (newFileName) {
      alert("A file with that name already exists.");
    }
  };

  const handleDeleteFile = (path) => {
    if (confirm(`Are you sure you want to delete ${path}?`)) {
      setFiles(files.filter(f => f.path !== path));
      if (activeFilePath === path) {
        setActiveFilePath(files.length > 1 ? files[0].path : null);
      }
    }
  };

  // --- GitHub Sim Handlers ---
  const handleGithubAuth = () => {
    setIsGithubAuthed(!isGithubAuthed);
  };

  const handleImportRepo = () => {
    setFiles(mockRepo);
    setActiveFilePath(mockRepo[0].path);
    setAgentLog("Mock repo imported successfully.");
    setShowImportModal(false);
    setIsMobileMenuOpen(false);
    setMobileView('editor');
  };

  const handlePushRepo = () => {
    setAgentLog("Simulating push to GitHub...");
    setTimeout(() => {
      setAgentLog("Changes pushed to mock repo successfully!");
      setShowPushModal(false);
      setIsMobileMenuOpen(false);
    }, 1500);
  };

  // --- File Tree Handlers ---
  const toggleFolder = (folderPath) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderPath]: !prev[folderPath]
    }));
  };

  // --- Export/Import Handlers ---
  const handleExport = () => {
    const project = {
      files: files,
      activeFilePath: activeFilePath
    };
    const dataStr = JSON.stringify(project, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'project.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const project = JSON.parse(event.target.result);
        if (project.files) {
          setFiles(project.files);
          if (project.activeFilePath) {
            setActiveFilePath(project.activeFilePath);
          }
          setAgentLog("Project imported successfully.");
        } else {
          throw new Error("Invalid project file structure.");
        }
      } catch (err) {
        setError("Failed to import project: " + err.message);
        setAgentLog("Error: Failed to import project.");
      }
    };
    reader.readAsText(file);
  };

  // --- Copy to Clipboard ---
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // --- File Tree Component ---
  const FileTree = ({ tree, path = "" }) => {
    return (
      <div className="space-y-1">
        {Object.entries(tree).map(([name, node]) => {
          const fullPath = path ? `${path}/${name}` : name;
          
          if (node.type === 'folder') {
            const isExpanded = expandedFolders[fullPath];
            return (
              <div key={fullPath}>
                <div
                  onClick={() => toggleFolder(fullPath)}
                  className="flex items-center p-2 rounded-md cursor-pointer text-gray-300 hover:bg-gray-800"
                >
                  {isExpanded ? 
                    <ChevronDown className="w-4 h-4 mr-1 flex-shrink-0" /> : 
                    <ChevronRight className="w-4 h-4 mr-1 flex-shrink-0" />
                  }
                  <Folder className="w-4 h-4 mr-2 flex-shrink-0 text-blue-400" />
                  <span className="text-sm truncate">{name}</span>
                </div>
                {isExpanded && node.children && (
                  <div className="ml-4 border-l border-gray-700 pl-2">
                    <FileTree tree={node.children} path={fullPath} />
                  </div>
                )}
              </div>
            );
          } else {
            return (
              <div
                key={fullPath}
                onClick={() => handleSelectFile(node.path)}
                className={`flex items-center p-2 rounded-md cursor-pointer ${
                  activeFilePath === node.path ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <File className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="text-sm truncate">{name}</span>
              </div>
            );
          }
        })}
      </div>
    );
  };

  // --- Search Filter ---
  const filteredFiles = useMemo(() => {
    if (!searchQuery) return files;
    return files.filter(file => 
      file.path.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [files, searchQuery]);

  // --- Panels ---
  
  const FileExplorerPanel = ({ className = "" }) => (
    <div className={`flex flex-col bg-gray-950 border-r border-gray-700 ${className}`}>
      {/* File List */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase">Files</h2>
          <div className="flex space-x-1">
            <button onClick={handleCreateFile} className="text-gray-400 hover:text-white" title="New File">
              <FilePlus className="w-4 h-4" />
            </button>
            <button onClick={() => setExpandedFolders({})} className="text-gray-400 hover:text-white" title="Collapse All">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded bg-gray-800 border border-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        <div className="space-y-1">
          {searchQuery ? (
            filteredFiles.map(file => (
              <div
                key={file.path}
                onClick={() => handleSelectFile(file.path)}
                className={`flex justify-between items-center p-2 rounded-md cursor-pointer ${
                  activeFilePath === file.path ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center truncate">
                  <FileCode className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-sm truncate">{file.path}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFile(file.path);
                  }}
                  className="ml-2 text-gray-500 hover:text-red-400 opacity-50 hover:opacity-100"
                  title="Delete File"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))
          ) : (
            <FileTree tree={fileTree} />
          )}
        </div>
      </div>
      
      {/* GitHub Panel */}
      <div className="p-4 flex-1 flex flex-col">
        <h2 className="text-sm font-semibold text-gray-400 uppercase mb-4">GitHub</h2>
        {isGithubAuthed ? (
          <div className="space-y-2 flex-1">
            <div className="flex items-center text-green-400">
              <Github className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Logged In</span>
            </div>
            <button 
              onClick={() => setShowImportModal(true)}
              className="w-full flex items-center justify-center p-2 rounded-md text-sm bg-gray-700 hover:bg-gray-600">
              <DownloadCloud className="w-4 h-4 mr-2" />
              Import Repo
            </button>
            <button 
              onClick={() => setShowPushModal(true)}
              className="w-full flex items-center justify-center p-2 rounded-md text-sm bg-gray-700 hover:bg-gray-600">
              <UploadCloud className="w-4 h-4 mr-2" />
              Push Changes
            </button>
            <button onClick={handleGithubAuth} className="w-full text-left text-xs text-gray-500 hover:text-red-400 mt-2">
              Sign Out
            </button>
          </div>
        ) : (
          <button 
            onClick={handleGithubAuth}
            className="w-full flex items-center justify-center p-2 rounded-md text-sm bg-blue-600 hover:bg-blue-700">
            <Github className="w-4 h-4 mr-2" />
            Sign in with GitHub
          </button>
        )}
        
        {/* Export/Import */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">Project</h3>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={handleExport}
              className="flex items-center justify-center p-2 rounded-md text-xs bg-gray-700 hover:bg-gray-600"
              title="Export Project"
            >
              <FileUp className="w-4 h-4 mr-1" />
              Export
            </button>
            <label className="flex items-center justify-center p-2 rounded-md text-xs bg-gray-700 hover:bg-gray-600 cursor-pointer">
              <FileDown className="w-4 h-4 mr-1" />
              Import
              <input 
                type="file" 
                accept=".json" 
                onChange={handleImport} 
                className="hidden" 
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const AgentPanel = ({ className = "" }) => (
    <div className={`flex flex-col ${className}`}>
      <div className="flex-shrink-0 p-4 border-b border-gray-700">
        <div className="flex items-center mb-2">
          <BrainCircuit className="w-5 h-5 mr-2 text-blue-400" />
          <h2 className="text-lg font-semibold">AI Agent</h2>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="ml-auto text-gray-400 hover:text-white"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
        
        {/* Settings Panel */}
        {showSettings && (
          <div className="mb-3 p-3 bg-gray-800 rounded-md">
            <div className="flex items-center justify-between">
              <label className="text-sm flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                Auto Preview
              </label>
              <div 
                onClick={() => setAutoPreview(!autoPreview)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full cursor-pointer ${
                  autoPreview ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span 
                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition ${
                    autoPreview ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </div>
            </div>
          </div>
        )}
        
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Add a new 'About' page and link to it from index.html"
            className="w-full p-3 pr-28 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows="3"
            disabled={isLoading}
          />
          <button
            onClick={handleGenerateCode}
            disabled={isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center px-4 py-2 bg-blue-600 rounded-md text-white font-semibold hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5 mr-2" />
            )}
            Run
          </button>
        </div>
        {error && (
          <div className="mt-2 flex items-center text-red-400">
            <TriangleAlert className="w-4 h-4 mr-2" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>
      {/* Agent Log */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-shrink-0 flex justify-between items-center p-2 bg-gray-950 border-b border-gray-700">
          <div className="flex items-center">
            <Terminal className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-sm text-gray-300">Agent Log</span>
          </div>
          <button 
            onClick={() => copyToClipboard(agentLog)}
            className="text-gray-400 hover:text-white"
            title="Copy to Clipboard"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <pre className="flex-1 w-full h-full p-4 bg-gray-800 text-gray-200 font-mono text-xs resize-none focus:outline-none overflow-y-auto whitespace-pre-wrap">
          {agentLog}
        </pre>
      </div>
    </div>
  );

  const EditorPanel = ({ className = "" }) => (
    <div className={`flex flex-col min-h-0 ${className}`}>
      <div className="flex-shrink-0 flex justify-between items-center p-2 bg-gray-950 border-b border-gray-700">
        <div className="flex items-center">
          <FileCode className="w-4 h-4 mr-2 text-gray-400" />
          <span className="text-sm text-gray-300">{activeFile?.path || "No file selected"}</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => copyToClipboard(activeFile?.content || "")}
            className="p-1.5 text-gray-400 hover:text-white"
            title="Copy Content"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={handleRunCode}
            disabled={isLoading}
            className="flex items-center px-3 py-1.5 bg-green-600 rounded-md text-white text-sm font-medium hover:bg-green-700 disabled:bg-gray-600 transition-colors"
          >
            <Play className="w-4 h-4 mr-1.5" />
            Run
          </button>
        </div>
      </div>
      <textarea
        value={activeFile?.content || ""}
        onChange={(e) => handleFileChange(e.target.value)}
        className="flex-1 w-full h-full p-4 bg-gray-800 text-gray-200 font-mono text-sm resize-none focus:outline-none"
        spellCheck="false"
        disabled={!activeFile}
      />
    </div>
  );

  const PreviewPanel = ({ className = "" }) => (
    <div className={`flex flex-col border-l border-gray-700 ${className}`}>
      <div className="flex-shrink-0 p-3 bg-gray-950 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-sm font-semibold text-gray-300">Live Preview</h2>
        <button
          onClick={handleRunCode}
          disabled={isLoading}
          className="flex items-center px-3 py-1.5 bg-green-600 rounded-md text-white text-sm font-medium hover:bg-green-700 disabled:bg-gray-600 transition-colors"
          title="Refresh Preview"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      <div className="flex-1 bg-white min-h-0">
        <iframe
          srcDoc={previewContent}
          title="Preview"
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-modals allow-forms"
        />
      </div>
    </div>
  );

  const GitHubModal = ({ title, children, onCancel, onConfirm, confirmText }) => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="p-4">
          {children}
        </div>
        <div className="p-4 bg-gray-900 rounded-b-lg flex justify-end space-x-2">
          <button onClick={onCancel} className="px-4 py-2 rounded-md text-sm bg-gray-600 hover:bg-gray-500">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-md text-sm bg-blue-600 hover:bg-blue-700">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} font-sans overflow-hidden`}>
      {/* --- Desktop Layout --- */}
      <div className="hidden sm:flex h-full w-full">
        {/* --- 1. File Explorer --- */}
        <FileExplorerPanel className="w-64 flex-shrink-0" />

        {/* --- 2. Main Panel (Agent + Editor) --- */}
        <div className="flex-1 flex flex-col h-full">
          <AgentPanel className="h-1/2" />
          <EditorPanel className="h-1/2" />
        </div>

        {/* --- 3. Preview Panel --- */}
        <PreviewPanel className="flex-1" />
      </div>

      {/* --- Mobile Layout --- */}
      <div className="sm:hidden flex flex-col h-full w-full">
        {/* --- Mobile Header --- */}
        <div className="flex-shrink-0 flex justify-between items-center p-3 bg-gray-950 border-b border-gray-700">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-300">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <span className="text-lg font-semibold capitalize">{mobileView}</span>
          <div className="flex space-x-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-gray-300"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={handleRunCode}
              disabled={isLoading}
              className="flex items-center px-3 py-1.5 bg-green-600 rounded-md text-white text-sm font-medium hover:bg-green-700"
            >
              <Play className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* --- Mobile Sidebar (File/GitHub) --- */}
        <div className={`absolute top-16 left-0 h-[calc(100%-4rem)] w-64 bg-gray-950 z-40 transition-transform ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } overflow-y-auto border-r border-gray-700`}
        >
           <FileExplorerPanel />
        </div>
        {isMobileMenuOpen && <div className="absolute inset-0 bg-black/50 z-30" onClick={() => setIsMobileMenuOpen(false)}></div>}

        {/* --- Mobile Main Content --- */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className={mobileView === 'agent' ? 'block h-full' : 'hidden'}><AgentPanel className="h-full" /></div>
          <div className={mobileView === 'editor' ? 'block h-full' : 'hidden'}><EditorPanel className="h-full" /></div>
          <div className={mobileView === 'preview' ? 'block h-full' : 'hidden'}><PreviewPanel className="h-full" /></div>
        </div>

        {/* --- Mobile Bottom Nav --- */}
        <div className="flex-shrink-0 grid grid-cols-4 bg-gray-950 border-t border-gray-700">
          <button onClick={() => setMobileView('files')} className={`flex flex-col items-center p-3 ${mobileView === 'files' ? 'text-blue-400' : 'text-gray-400'}`}>
            <FolderGit2 className="w-5 h-5 mb-1" />
            <span className="text-xs">Files</span>
          </button>
          <button onClick={() => setMobileView('agent')} className={`flex flex-col items-center p-3 ${mobileView === 'agent' ? 'text-blue-400' : 'text-gray-400'}`}>
            <BrainCircuit className="w-5 h-5 mb-1" />
            <span className="text-xs">Agent</span>
          </button>
          <button onClick={() => setMobileView('editor')} className={`flex flex-col items-center p-3 ${mobileView === 'editor' ? 'text-blue-400' : 'text-gray-400'}`}>
            <Code className="w-5 h-5 mb-1" />
            <span className="text-xs">Editor</span>
          </button>
          <button onClick={() => setMobileView('preview')} className={`flex flex-col items-center p-3 ${mobileView === 'preview' ? 'text-blue-400' : 'text-gray-400'}`}>
            <MonitorPlay className="w-5 h-5 mb-1" />
            <span className="text-xs">Preview</span>
          </button>
        </div>
      </div>
      
      {/* --- Modals --- */}
      {showImportModal && (
        <GitHubModal
          title="Import Mock Repository"
          confirmText="Import"
          onCancel={() => setShowImportModal(false)}
          onConfirm={handleImportRepo}
        >
          <p className="text-sm text-gray-300">
            This will replace your current files with the mock 'Imported Repo' project. Are you sure?
          </p>
        </GitHubModal>
      )}
      {showPushModal && (
        <GitHubModal
          title="Push to Mock Repository"
          confirmText="Push"
          onCancel={() => setShowPushModal(false)}
          onConfirm={handlePushRepo}
        >
          <p className="text-sm text-gray-300">
            This will simulate pushing your current files to a mock GitHub repository.
          </p>
        </GitHubModal>
      )}
    </div>
  );
}
</content>