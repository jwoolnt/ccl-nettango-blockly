import {refreshMITPlugin, getUserVariables, removeVariable, updateVariable} from "./data/context";
import {save} from "./services/serializer";

import { openDialog, closeDialog, createDialogElement, createButton, createFormField } from "./moduleElements";

let workspace: any = null;
let displayCodeCallback: (() => void) | null = null;
let selectedVariable: string | null = null;

export function initVariablesTracker(ws: any, callback: () => void) {
  workspace = ws;
  displayCodeCallback = callback;
  
  const trackerList = document.getElementById('variables-tracker-list');
  const contextMenu = document.getElementById('variables-context-menu');
  
  if (!trackerList || !contextMenu) {
    console.error("Variables tracker elements not found");
    return;
  }

  // Update display initially
  updateVariablesDisplay();

  // Listen for right-click on variable items
  trackerList.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    const target = (e.target as HTMLElement).closest('.variable-item');
    if (target) {
      selectedVariable = target.getAttribute('data-variable') || null;
      if (selectedVariable) {
        showContextMenu(e.clientX, e.clientY);
      }
    }
  });

  // Hide context menu on click outside
  document.addEventListener('click', () => {
    hideContextMenu();
  });

  // Handle context menu actions
  const renameItem = document.getElementById('context-menu-rename');
  const removeItem = document.getElementById('context-menu-remove');

  if (renameItem) {
    renameItem.addEventListener('click', () => {
      if (selectedVariable) {
        showRenameDialog(selectedVariable);
        hideContextMenu();
      }
    });
  }

  if (removeItem) {
    removeItem.addEventListener('click', () => {
      if (selectedVariable) {
        showRemoveDialog(selectedVariable);
        hideContextMenu();
      }
    });
  }

  // Listen for variable changes (you may need to add a custom event or poll)
  // For now, we'll update on workspace changes
  ws.addChangeListener(() => {
    updateVariablesDisplay();
  });
}

function updateVariablesDisplay() {
  const trackerList = document.getElementById('variables-tracker-list');
  if (!trackerList) return;

  // Clear existing items
  trackerList.innerHTML = '';

  // Only show variables created by the user (exclude built-ins)
  const allVars = getUserVariables();

  if (allVars.length === 0) {
    const emptyMsg = document.createElement('div');
    emptyMsg.className = 'variable-empty';
    emptyMsg.textContent = 'No variables defined';
    emptyMsg.style.cssText = 'padding: 16px; color: #9ca3af; font-size: 13px; text-align: center; width: 100%;';
    trackerList.appendChild(emptyMsg);
    return;
  }

  // Create variable items
  allVars.forEach(variableName => {
    const item = document.createElement('div');
    item.className = 'variable-item';
    item.setAttribute('data-variable', variableName);
    item.textContent = variableName;
    trackerList.appendChild(item);
  });
}

function showContextMenu(x: number, y: number) {
  const contextMenu = document.getElementById('variables-context-menu');
  if (!contextMenu) return;

  contextMenu.style.left = `${x}px`;
  contextMenu.style.top = `${y}px`;
  contextMenu.classList.add('show');
}

function hideContextMenu() {
  const contextMenu = document.getElementById('variables-context-menu');
  if (contextMenu) {
    contextMenu.classList.remove('show');
  }
  selectedVariable = null;
}

function showRenameDialog(variableName: string) {
  const dialog = createDialogElement('Rename Variable');
  const content = dialog.querySelector('.dialog-content') as HTMLDivElement;

  const form = document.createElement('form');
  form.id = 'rename-variable-tracker-form';

  const oldNameField = createFormField('Current Name:', 'tracker-old-variable-name');
  (oldNameField.querySelector('input') as HTMLInputElement).value = variableName;
  (oldNameField.querySelector('input') as HTMLInputElement).disabled = true;
  form.appendChild(oldNameField);

  const newNameField = createFormField('New Name:', 'tracker-new-variable-name');
  form.appendChild(newNameField);

  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'button-container';

  const cancelButton = createButton('Cancel', closeDialog);
  const renameButton = createButton('Rename', () => {
    const newName = (document.getElementById('tracker-new-variable-name') as HTMLInputElement).value;

    if (newName && newName.trim()) {
      try {
        updateVariable(variableName, newName.trim());
        refreshMITPlugin();
        if (displayCodeCallback) displayCodeCallback();
        if (workspace) save(workspace);
        updateVariablesDisplay();
        closeDialog();
      } catch (error) {
        alert(`Error renaming variable: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } else {
      alert('Please enter a new variable name');
    }
  }, 'primary');

  buttonContainer.appendChild(cancelButton);
  buttonContainer.appendChild(renameButton);
  form.appendChild(buttonContainer);
  content.appendChild(form);

  // Import openDialog from modules
  openDialog(dialog);

  setTimeout(() => {
    const nameInput = document.getElementById('tracker-new-variable-name') as HTMLInputElement;
    if (nameInput) nameInput.focus();
  }, 100);
}

function showRemoveDialog(variableName: string) {
  if (!confirm(`Are you sure you want to remove the variable "${variableName}"?`)) {
    return;
  }

  try {
    removeVariable(variableName);
    refreshMITPlugin();
    if (displayCodeCallback) displayCodeCallback();
    if (workspace) save(workspace);
    updateVariablesDisplay();
  } catch (error) {
    alert(`Error removing variable: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Export function to manually refresh the display
export function refreshVariablesDisplay() {
  updateVariablesDisplay();
}
