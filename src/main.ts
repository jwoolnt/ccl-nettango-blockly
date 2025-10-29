import * as Blockly from "blockly";
import toolbox from "./blocks/toolbox";
import activeBlocks from "./blocks";
import { save, load, downloadWorkspace, uploadWorkspace, reset } from "./services/serializer";
import netlogoGenerator, { generateCodePrefix } from "./services/generator";
import {getNetLogoFrame, sendToNetLogo, setModelCode, recompile, recompileProcedures} from "./services/netlogoAPI";  
//@ts-expect-error
import { LexicalVariablesPlugin } from '@mit-app-inventor/blockly-block-lexical-variables';
import { refreshMITPlugin } from "./data/context";
import { initSidebar } from "./sidebar";
import { updateWorkspaceForDomain } from "./blocks/domain";
import { get } from "blockly/core/events/utils";

Blockly.common.defineBlocks({ ...activeBlocks });

const blockEditor = document.getElementsByClassName("block-editor")[0];
const codeOutput = document.getElementsByClassName("generated-code")[0];

const customTheme = Blockly.Theme.defineTheme('customTheme', {
  name: 'customTheme',
  blockStyles: {
    number_blocks: {
      colourPrimary: '#c72216',
      hat: ''
    },
    procedure_blocks: {
      colourPrimary: '#673AB7' // purple for procedures
    },
    list_blocks: {
      colourPrimary: "#009688",
    },
    variable_blocks: {
      colourPrimary: '#9C27B0' // gold for variables
    }
  },
  fontStyle: {
    family: 'Fira Code',
    weight: 'normal',
    size: 12
  },
  startHats: false
});

if (blockEditor && codeOutput) {
  const ws = Blockly.inject(blockEditor, {
    renderer: 'thrasos',
    toolbox,
    theme: customTheme,
    zoom: {
      controls: true,
      wheel: true,
      startScale: 1,
      maxScale: 3,
      minScale: 0.3,
      scaleSpeed: 1.2
    },
    move: {
      scrollbars: {
        horizontal: true,
        vertical: true
      },
      drag: true,
      wheel: true
    },
    grid: {
      spacing: 40,
      length: 40,
      colour: '#ccc',
      snap: true
    }
  });

  LexicalVariablesPlugin.init(ws);
  Blockly.Msg.LANG_VARIABLES_GLOBAL_PREFIX = "";

  const displayCode = () => {
    refreshMITPlugin();
    const generatedCode = generateCodePrefix() + netlogoGenerator.workspaceToCode(ws);
    codeOutput.textContent = generatedCode;
    
    // Update the clipboard manager with the new code
    if ((window as any).updateGeneratedCode) {
      (window as any).updateGeneratedCode(generatedCode);
    }
    
    save(ws);
  };

  load(ws);
  displayCode();

  // Initialize the sidebar with workspace and display callback
  initSidebar(ws, displayCode);

  // Initialize workspace selector
  initWorkspaceSelector(ws, displayCode);

  // Initialize file operations
  initFileOperations(ws, displayCode);

  ws.addChangeListener((e) => {
    if (e.isUiEvent || e.type == Blockly.Events.FINISHED_LOADING || ws.isDragging()) {
      return;
    }
    displayCode();
  });

  ws.addChangeListener((e) => {
    if (e.isUiEvent) return;
    save(ws);
  });
} else {
  if (!blockEditor) {
    console.error("Setup: cannot find blockEditor");
  } else if (!codeOutput) {
    console.error("Setup: cannot find codeOutput");
  }
}

// Initialize workspace selector
function initWorkspaceSelector(workspace: Blockly.WorkspaceSvg, displayCodeCallback: () => void) {
  const workspaceSelector = document.getElementById('workspace-selector') as HTMLSelectElement;

  if (!workspaceSelector) {
    console.error("Workspace selector not found");
    return;
  }

  // Handle workspace selection changes
  workspaceSelector.addEventListener('change', (event) => {
    const selectedValue = (event.target as HTMLSelectElement).value;
    console.log(`Switching to workspace: ${selectedValue}`);

    // Update the workspace with domain-specific blocks
    updateWorkspaceForDomain(workspace, selectedValue, displayCodeCallback);
  });

  // Set initial state to default
  updateWorkspaceForDomain(workspace, 'default', displayCodeCallback);
}

// Initialize file operations (save, load, clear)
function initFileOperations(workspace: Blockly.WorkspaceSvg, displayCodeCallback: () => void) {
  // Save workspace to file
  const saveBtn = document.getElementById('saveBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const filename = prompt('Enter filename:', 'my-nettango-project');
      if (filename) {
        try {
          downloadWorkspace(workspace, filename);
          showNotification('Workspace saved successfully!', 'success');
        } catch (error) {
          showNotification('Error saving workspace: ' + (error instanceof Error ? error.message : 'Unknown error'), 'error');
        }
      }
    });
  }

  // Load workspace from file
  const loadBtn = document.getElementById('loadBtn');
  if (loadBtn) {
    loadBtn.addEventListener('click', async () => {
      try {
        const filename = await uploadWorkspace(workspace);
        displayCodeCallback(); // Refresh the generated code
        showNotification(`Workspace "${filename}" loaded successfully!`, 'success');
      } catch (error) {
        if (error instanceof Error && error.message !== 'No file selected') {
          showNotification('Error loading workspace: ' + error.message, 'error');
        }
      }
    });
  }

  // Clear workspace
  const clearBtn = document.getElementById('clearBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear the workspace?\n\nThis will delete all blocks and cannot be undone.\n\nSaving your work first.')) {
        try {
          reset(workspace);
          displayCodeCallback(); // Refresh the generated code
          showNotification('Workspace cleared', 'info');
        } catch (error) {
          showNotification('Error clearing workspace: ' + (error instanceof Error ? error.message : 'Unknown error'), 'error');
        }
      }
    });
  }
}

// Show notification to user
function showNotification(message: string, type: 'success' | 'error' | 'info' = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Add to body
  document.body.appendChild(notification);
  
  // Trigger animation
  setTimeout(() => notification.classList.add('show'), 10);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Netlogo Web integration
function setupNetLogoIntegration() {
  // const runBtn = document.getElementById('compile-run-btn');
  const setupBtn = document.getElementById('setup-btn');
  const goBtn = document.getElementById('go-btn');
  const stopBtn = document.getElementById('stop-btn');
  const status = document.getElementById('netlogo-status');
  const codeElement = document.getElementsByClassName("generated-code");

  const iframe = getNetLogoFrame();
  
  // flow: click setup -> send code -> recompile -> click go
  if (setupBtn) {
    setupBtn.addEventListener('click', () => {
      if (codeElement.length > 0) {
        const code = codeElement[0].textContent || "";
        setModelCode(code, false);
        // recompile();
        if (status) status.textContent = "Code tab updated.";
      }
    });
  }
  if (goBtn) { // recompiles
    // TODO: change to runBtn - right now it just recompiles
    goBtn.addEventListener('click', () => {
      recompile();
      if (status) status.textContent = "Model recompiled.";
    });
  }
  if (stopBtn) {
    stopBtn.addEventListener('click', () => {
      // TODO: send stop command
      if (status) status.textContent = "Model stopped.";
    });
  }
}
setupNetLogoIntegration();