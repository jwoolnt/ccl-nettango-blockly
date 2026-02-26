import * as Blockly from "blockly";
import toolbox from "./blocks/toolbox";
import activeBlocks from "./blocks";
import { save, load, downloadWorkspace, uploadWorkspace, reset } from "./services/serializer";
import { createDefaultProcedures } from "./services/defaultProcedures";
import netlogoGenerator, { generateCodePrefix } from "./services/generator";
import { runGo, runSetup, compileAndSetupModel, compileModel, setupErrorListener, resetNetLogoFrame} from "./services/netlogoAPI";
import { scheduleAutoCompile, setIsAutoCompiling, isAutoCompiling, setUnsavedChangesFlag } from "./services/autoCompile";
//@ts-expect-error
import { LexicalVariablesPlugin } from '@mit-app-inventor/blockly-block-lexical-variables';
import { getUIVariables, refreshMITPlugin } from "./data/context";
import { updateWorkspaceForDomain } from "./blocks/domain";

import { showAddVariableDialogFromBlock, showAddBreedDialogFromBlock} from "./components/dialog";
import { initVariablesTracker, createSliderWidgets, syncSliderValuesToNetLogo} from "./components/variablesTracker";
import { initBreedTracker } from "./components/breedTracker";
import { initUIModules } from "./components/modules";

Blockly.common.defineBlocks({ ...activeBlocks });

// Setup error listener for NetLogo Web compilation errors
setupErrorListener();

const blockEditor = document.getElementsByClassName("block-editor")[0];
const codeOutput = document.getElementsByClassName("generated-code")[0];

const customTheme = Blockly.Theme.defineTheme('customTheme', {
  name: 'customTheme',
  // theme colors for blocks from the MIT Plug-in/Blockly
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

// 
// Custom Blockly workspace
// 
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
      length: 10,
      colour: '#ccc',
      snap: true
    }
  });

  LexicalVariablesPlugin.init(ws);
  Blockly.Msg.LANG_VARIABLES_GLOBAL_PREFIX = "";

  // Intercept variable dropdown changes to handle "create new variable"
  // Store the last valid variable value for each block
  const blockVariableValues = new Map<string, string>();
  const blockBreedValues = new Map<string, string>();
  // Intercept variable selection to detect "create new"
  ws.addChangeListener((e) => {
      // Mark as having uncompiled changes on any block edit
      setUnsavedChangesFlag(true);
    if (e.type === Blockly.Events.BLOCK_CHANGE) {
      const changeEvent = e as Blockly.Events.BlockChange;

      const blockId = changeEvent.blockId;
      const fieldName = changeEvent.name;
      const newValue = changeEvent.newValue;
      const oldValue = changeEvent.oldValue;

      // Check for variable creation trigger
      if (newValue && typeof newValue === 'string' && newValue.includes('+ create new variable')) {
        // Prevent this from being the actual value
        if (blockId) {
          const block = ws.getBlockById(blockId);
          if (block && fieldName) {
            // Revert to old value or empty
            const revertValue = oldValue || (blockVariableValues.get(blockId) || '');
            block.setFieldValue(revertValue, fieldName);

            // Open your variable creation dialog
            showAddVariableDialogFromBlock(ws, displayCode, blockId, fieldName);
          }
        }
      }
      // Check for breed creation trigger
      else if (newValue && typeof newValue === 'string' && newValue.includes('+ create new breed')) {
          if (blockId) {
            const block = ws.getBlockById(blockId);
            // prevent '+ create new breed' to be the actual value, just a trigger to open a dialog
            // So we immediately reset it to empty ('')
            if (block && fieldName) {
              const revertValue = oldValue || (blockBreedValues.get(blockId) || '');
              block.setFieldValue(revertValue, fieldName);
              showAddBreedDialogFromBlock(ws, displayCode, blockId, fieldName);
            }
          }
        }
      // 
      else if (newValue && typeof newValue === 'string') {
        if (blockId) {
          if (newValue.includes('breed') || fieldName === 'BREED_SELECT') {
            blockBreedValues.set(blockId, newValue);
          } else {
            blockVariableValues.set(blockId, newValue);
          }
        }
      }
    }
  });

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

  // Add default procedures for new/empty workspaces
  if (ws.getAllBlocks().length === 0) {
    createDefaultProcedures(ws);
  }

  displayCode();

  // Initialize UI modules (dialogs, file menu)
  initUIModules(ws, displayCode);

  // Initialize variables tracker
  initVariablesTracker(ws, displayCode);

  // Initialize breeds tracker
  initBreedTracker(ws, displayCode);

  // Initialize workspace selector
  initWorkspaceSelector(ws, displayCode);

  // Initialize file operations
  initFileOperations(ws, displayCode);

  // Initialize auto-compile toggle
  function initAutoCompile() {
    const toggleCheckbox = document.getElementById('auto-compile-toggle') as HTMLInputElement;

    if (!toggleCheckbox) {
      console.error("Auto-compile toggle button not found");
      return;
    }

    // Set initial state
    toggleCheckbox.checked = isAutoCompiling;

    toggleCheckbox.addEventListener('change', () => {
      setIsAutoCompiling(toggleCheckbox.checked);

      if (isAutoCompiling) {
        // Compile
        scheduleAutoCompile();
      }
    });
  }

  // Initialize auto-compile toggle
  initAutoCompile();

  ws.addChangeListener((e) => {
    if (e.isUiEvent || e.type == Blockly.Events.FINISHED_LOADING || ws.isDragging()) {
      return;
    }
    displayCode();
    // Mark workspace as having unsaved changes until setup is run
    setUnsavedChangesFlag(true);
    // schedule auto-compile if enabled
    if (isAutoCompiling) {
      scheduleAutoCompile();
    }
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
  // New workspace
  const newBtn = document.getElementById('newBtn');
  if (newBtn) {
    newBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to create a new workspace?\n\nAll unsaved changes will be lost.')) {
        try {
          reset(workspace);
          resetNetLogoFrame(); // Reset iframe for new workspace
          displayCodeCallback(); // Refresh the generated code
          showNotification('New workspace created', 'success');
        } catch (error) {
          showNotification('Error creating new workspace: ' + (error instanceof Error ? error.message : 'Unknown error'), 'error');
        }
      }
    });
  }

  // Save workspace to file
  const saveBtn = document.getElementById('saveBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const filename = prompt('Enter filename:', 'project');
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
        resetNetLogoFrame(); // Reset iframe when loading a new model
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
          resetNetLogoFrame(); // Reset iframe when clearing workspace
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
  const status = document.getElementById('netlogo-status');
  const codeElement = document.getElementsByClassName("generated-code");

  // buttons
  const compileBtn = document.getElementById('compile-run-btn'); // Run/Compile button
  const compileOnlyBtn = document.getElementById('compile-btn'); // Compile only button
  const setupOnlyBtn = document.getElementById('setup-btn'); // Setup only button
  const goBtn = document.getElementById('go-btn'); // Go button
  let goForeverBtn = document.getElementById('go-forever-btn'); // Go Forever button
  let goInterval: number | null = null;

  //Compile+Setup Button - compiles the code and runs setup
  if (compileBtn) {
    compileBtn.addEventListener('click', async () => {
      if (codeElement.length > 0) {
        const code = codeElement[0].textContent || "";
        console.log("Compiling and setting up model...");

        try {
          await compileAndSetupModel(code, createSliderWidgets);

          // Clear unsaved banner on successful setup
          setUnsavedChangesFlag(false);
          if (status) {
            status.textContent = "Model compiled and setup executed!";
          }
        } catch (error) {
          console.error("Error compiling model:", error);
          if (status) {
            status.textContent = "Error compiling model. Check console.";
          }
        }
      } else {
        if (status) status.textContent = "No code to compile.";
      }
    });
  }

  // Compile Only Button - compiles the code without running setup
  if (compileOnlyBtn) {
    compileOnlyBtn.addEventListener('click', async () => {
      if (codeElement.length > 0) {
        const code = codeElement[0].textContent || "";
        console.log("Compiling model only...");

        try {
          await compileModel(code);
          await createSliderWidgets(); 
          
          // Clear unsaved banner on successful compile
          setUnsavedChangesFlag(false);
          syncSliderValuesToNetLogo(); // Sync slider values to NetLogo after compilation
          if (status) {
            status.textContent = "Model compiled successfully! Click Setup to initialize.";
          }
        } catch (error) {
          console.error("Error compiling model:", error);
          if (status) {
            status.textContent = "Compilation error. Check console.";
          }
        }
      } else {
        if (status) status.textContent = "No code to compile.";
      }
    });
  }

  // Setup Only Button - runs the setup procedure
  if (setupOnlyBtn) {
    setupOnlyBtn.addEventListener('click', () => {
      runSetup();
      setTimeout(() => {
        syncSliderValuesToNetLogo();  // re-sync after setup clears values
      }, 500);  // small delay to let setup finish
    });
  }
  // Go Button - Runs the go procedure
  if (goBtn) {
    goBtn.addEventListener('click', () => {
      runGo();
      if (status) {
        status.textContent = "Step";
      }
    });
  }

  // Go Forever Button - Runs the go procedure repeatedly
  if (goForeverBtn) {
    goForeverBtn.addEventListener('click', () => {
      if (goInterval) {
        // stop if already running
        clearInterval(goInterval);
        goInterval = null;
        if (status) status.textContent = "Stopped";
        goForeverBtn!.textContent = "▶";
      } else {
        // start running
        goInterval = window.setInterval(() => {
          runGo();
        }, 100); // adjust interval as needed
        if (status) status.textContent = "Running...";
        goForeverBtn!.textContent = "⏸";
      }
    });
  }
}

setupNetLogoIntegration();