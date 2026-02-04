import {refreshMITPlugin, getUserVariables, getVariableOwner, removeVariable, updateVariable} from "../data/context";
import {save} from "../services/serializer";
import { setGlobalVariable } from "../services/netlogoAPI";

import { openDialog, closeDialog, createDialogElement, createButton, createFormField, showAddVariableDialogFromBlock } from "./dialog";

let workspace: any = null;
let displayCodeCallback: (() => void) | null = null;
let selectedVariable: string | null = null;

interface VariableControl {
  type: 'slider' | 'switch';
  enabled: boolean;
  min?: number;
  max?: number;
  step?: number;
}

const variableControls = new Map<string, VariableControl>();
const variableValues = new Map<string, any>();

export function initVariablesTracker(ws: any, callback: () => void) {
  workspace = ws;
  displayCodeCallback = callback;
  
  const trackerList = document.getElementById('variables-tracker-list');
  const contextMenu = document.getElementById('variables-context-menu');
  
  if (!trackerList || !contextMenu) {
    console.error("Variables tracker elements not found");
    return;
  }

  updateVariablesDisplay();

  // Listen for clicks to create controls
  trackerList.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest('.variable-item');
    if (target && !target.classList.contains('add-item-btn')) {
      const variableName = target.getAttribute('data-variable');
      if (variableName) {
        if (variableControls.has(variableName)) {
          // Toggle off - remove the control
          variableControls.delete(variableName);
          updateVariablesDisplay();
        } else {
          // Toggle on - create the control
          handleVariableClick(variableName);
        }
      }
    }
  });

  // Context menu handlers
  trackerList.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    const target = (e.target as HTMLElement).closest('.variable-item');
    if (target && !target.classList.contains('add-item-btn')) {
      selectedVariable = target.getAttribute('data-variable') || null;
      if (selectedVariable) {
        showContextMenu(e.clientX, e.clientY);
      }
    }
  });

  document.addEventListener('click', () => {
    hideContextMenu();
  });

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

  ws.addChangeListener(() => {
    updateVariablesDisplay();
  });
}

function handleVariableClick(variableName: string) {
  const currentValue = variableValues.get(variableName) ?? inferVariableType(variableName);
  const varType = typeof currentValue;
  
  if (varType === 'number') {
    const isInteger = Number.isInteger(currentValue);
    variableControls.set(variableName, {
      type: 'slider',
      enabled: true,
      min: 0,
      max: Math.max(100, currentValue * 2),
      step: isInteger ? 1 : 0.1
    });
    if (!variableValues.has(variableName)) {
      variableValues.set(variableName, currentValue);
    }
  } else if (varType === 'boolean') {
    variableControls.set(variableName, {
      type: 'switch',
      enabled: true
    });
    if (!variableValues.has(variableName)) {
      variableValues.set(variableName, currentValue);
    }
  }
  
  updateVariablesDisplay();
}

function inferVariableType(variableName: string): number | boolean {
  const name = variableName.toLowerCase();
  if (name.includes('?') || name.startsWith('is-') || name.startsWith('has-')) {
    return false;
  }
  return 0;
}

function updateVariableValue(variableName: string, newValue: any) {
  variableValues.set(variableName, newValue);

  const updated = setGlobalVariable(variableName, newValue);
  if (!updated) {
    console.warn(`Could not update ${variableName}.`);
  }
}

function updateVariablesDisplay() {
  const trackerList = document.getElementById('variables-tracker-list');
  if (!trackerList) return;

  trackerList.innerHTML = '';

  const allVars = getUserVariables();

  if (allVars.length === 0) {
    const emptyMsg = document.createElement('div');
    emptyMsg.className = 'variable-empty';
    emptyMsg.textContent = 'No variables defined';
    trackerList.appendChild(emptyMsg);
  } else {
    allVars.forEach(variableName => {
      const control = variableControls.get(variableName);
      const value = variableValues.get(variableName) ?? inferVariableType(variableName);
      
      const item = document.createElement('div');
      item.className = 'variable-item';
      item.setAttribute('data-variable', variableName);

      if (control?.enabled) {
        item.classList.add('has-control');
        
        const header = document.createElement('div');
        header.className = 'control-header';
        
        const nameSpan = document.createElement('span');
        nameSpan.textContent = variableName;
        
        header.appendChild(nameSpan);
        item.appendChild(header);
        
        if (control.type === 'slider') {
          const sliderContainer = document.createElement('div');
          sliderContainer.className = 'control-slider-container';
          
          const valueDisplay = document.createElement('div');
          valueDisplay.className = 'control-value-display';
          valueDisplay.textContent = String(value);
          
          const slider = document.createElement('input');
          slider.type = 'range';
          slider.className = 'control-slider';
          slider.min = String(control.min);
          slider.max = String(control.max);
          slider.step = String(control.step);
          slider.value = String(value);
          
          slider.addEventListener('input', (e) => {
            const newValue = Number((e.target as HTMLInputElement).value);
            valueDisplay.textContent = String(newValue);
            updateVariableValue(variableName, newValue);
          });
          
          sliderContainer.appendChild(valueDisplay);
          sliderContainer.appendChild(slider);
          item.appendChild(sliderContainer);
        } else if (control.type === 'switch') {
          const switchContainer = document.createElement('div');
          switchContainer.className = 'control-switch-container';
          
          const switchInput = document.createElement('input');
          switchInput.type = 'checkbox';
          switchInput.className = 'control-switch-input';
          switchInput.checked = Boolean(value);
          
          const label = document.createElement('span');
          label.className = 'control-switch-label';
          label.textContent = value ? 'true' : 'false';
          
          switchInput.addEventListener('change', (e) => {
            const newValue = (e.target as HTMLInputElement).checked;
            label.textContent = newValue ? 'true' : 'false';
            updateVariableValue(variableName, newValue);
          });
          
          switchContainer.appendChild(switchInput);
          switchContainer.appendChild(label);
          item.appendChild(switchContainer);
        }
        
        const owner = getVariableOwner(variableName);
        const badge = document.createElement('span');
        badge.className = 'control-scope-badge';
        badge.textContent = owner ? owner : 'unknown';
        item.appendChild(badge);
      } else {
        const nameSpan = document.createElement('span');
        nameSpan.textContent = variableName;

        const owner = getVariableOwner(variableName);
        const badge = document.createElement('span');
        badge.className = 'variable-scope-badge';
        badge.textContent = owner ? owner : 'unknown';

        item.appendChild(nameSpan);
        item.appendChild(badge);
      }
      
      trackerList.appendChild(item);
    });
  }

  const addButton = document.createElement('button');
  addButton.className = 'add-item-btn';
  addButton.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
    Add Variable
  `;
  addButton.addEventListener('click', () => {
    if (workspace && displayCodeCallback) {
      showAddVariableDialogFromBlock(workspace, displayCodeCallback);
    }
  });
  trackerList.appendChild(addButton);
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
// Export function to get variable values for code generation
export function getVariableInitialValues(): Map<string, any> {
  return new Map(variableValues);
}

// Export function to manually refresh the display
export function refreshVariablesDisplay() {
  updateVariablesDisplay();
}