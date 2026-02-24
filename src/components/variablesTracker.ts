import {refreshMITPlugin, getUserVariables, getVariableOwner, removeVariable, updateVariable, addVariable} from "../data/context";
import {save} from "../services/serializer";
import { createHiddenSlider, runCode } from "../services/netlogoAPI";

import { openDialog, closeDialog, createDialogElement, createButton, createFormField, showAddVariableDialogFromBlock } from "./dialog";

let workspace: any = null;
let displayCodeCallback: (() => void) | null = null;
let selectedVariable: string | null = null;
let previousVariableList: string[] = [];

interface VariableControl {
  type: 'slider' | 'switch';
  enabled: boolean;
  min?: number;
  max?: number;
  step?: number;
}

const variableControls = new Map<string, VariableControl>();
const variableValues = new Map<string, any>();
const widgetIds = new Map<string, number>();
const sliderDebounceTimers = new Map<string, ReturnType<typeof setTimeout>>(); // Track debounce timers for slider updates
const createdWidgets = new Set<string>();
let nextWidgetId = 1000; // arbitrary starting ID

export function registerWidgetId(variableName: string, id: number) {
  widgetIds.set(variableName, id);
}

export function getWidgetId(variableName: string): number | undefined {
  return widgetIds.get(variableName);
}

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
    const clickedElement = e.target as HTMLElement;
    
    // Don't toggle if clicking directly on the slider or switch input elements
    if (clickedElement.classList.contains('control-slider') ||
        clickedElement.classList.contains('control-switch-input')) {
      return;
    }
    
    const target = clickedElement.closest('.variable-item');
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
    // Only update display if the variable list has changed
    const currentVars = getUserVariables();
    const varsChanged = currentVars.length !== previousVariableList.length ||
      currentVars.some((v, i) => v !== previousVariableList[i]);
    
    if (varsChanged) {
      previousVariableList = [...currentVars];
      updateVariablesDisplay();
    }
  });
}

function handleVariableClick(variableName: string) {
  const currentValue = variableValues.get(variableName) ?? inferVariableType(variableName);
  const varType = typeof currentValue;

  if (varType === 'number') {
    const control: VariableControl = {
      type: 'slider',
      enabled: true,
      min: 0,
      max: Math.max(100, (currentValue as number) * 2),
      step: Number.isInteger(currentValue as number) ? 1 : 0.1
    };
    variableControls.set(variableName, control);
    if (!variableValues.has(variableName)) variableValues.set(variableName, currentValue);

  } else if (varType === 'boolean') {
    variableControls.set(variableName, { type: 'switch', enabled: true });
    if (!variableValues.has(variableName)) variableValues.set(variableName, currentValue);
  }

  updateVariablesDisplay();
  if (displayCodeCallback) displayCodeCallback();
}

function updateVariableValue(variableName: string, newValue: any) {
  variableValues.set(variableName, newValue);
  runCode(`set ${variableName} ${newValue}`);
}

function inferVariableType(variableName: string): number | boolean {
  const name = variableName.toLowerCase();
  if (name.includes('?') || name.startsWith('is-') || name.startsWith('has-')) {
    return false;
  }
  return 0;
}

// Debounced update for slider input events - prevents queuing of rapid updates
function updateVariableValueDebounced(variableName: string, newValue: any, delay: number = 100): void {
  // Clear existing timer if one is pending
  const existingTimer = sliderDebounceTimers.get(variableName);
  if (existingTimer) {
    clearTimeout(existingTimer);
  }
  
  // Set new timer for the update
  const timer = setTimeout(() => {
    updateVariableValue(variableName, newValue);
    sliderDebounceTimers.delete(variableName);
  }, delay);
  
  sliderDebounceTimers.set(variableName, timer);
}

function updateVariablesDisplay() {
  const trackerList = document.getElementById('variables-tracker-list');
  if (!trackerList) return;

  // Store previous variable list
  const allVars = getUserVariables();
  previousVariableList = [...allVars];

  // sees the new ui variable has no control yet - calls handleVariableClick automatically
  // for (const variableName of allVars) {
  //   const owner = getVariableOwner(variableName);
  //   if (owner === 'ui' && !variableControls.has(variableName)) {
  //     handleVariableClick(variableName);  // auto-toggle slider on
  //   }
  // }

  trackerList.innerHTML = '';

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
            variableValues.set(variableName, newValue);
            // Update NetLogo runtime with debounced updates to prevent queueing
            updateVariableValueDebounced(variableName, newValue);
          });
          
          slider.addEventListener('change', (e) => {
            const newValue = Number((e.target as HTMLInputElement).value);
            // Ensure final value is applied immediately when slider is released
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
            variableValues.set(variableName, newValue);
            updateVariableValue(variableName, newValue);
          });
          
          switchContainer.appendChild(switchInput);
          switchContainer.appendChild(label);
          item.appendChild(switchContainer);
        }
        
        // Badge with ui/global distinction
        const owner = getVariableOwner(variableName);
        const badge = document.createElement('span');
        badge.className = 'control-scope-badge';
        badge.textContent = owner ?? 'unknown';

        if (owner === 'ui') {
          badge.classList.add('badge-ui');
          badge.title = 'UI variable — survives setup/clear-all';
        } else if (owner === 'globals') {
          badge.classList.add('badge-global');
          badge.title = 'Code global — reset by clear-all';
        }

        item.appendChild(badge);
      } else {
        const nameSpan = document.createElement('span');
        nameSpan.textContent = variableName;

        const owner = getVariableOwner(variableName);
        const badge = document.createElement('span');
        badge.className = 'variable-scope-badge';
        badge.textContent = owner ?? 'unknown';

        if (owner === 'ui') {
          badge.classList.add('badge-ui');
          badge.title = 'UI variable — survives setup/clear-all';
        } else if (owner === 'globals') {
          badge.classList.add('badge-global');
          badge.title = 'Code global — reset by clear-all';
        }

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
export async function createSliderWidgets(): Promise<void> {
  for (const [variableName, control] of variableControls.entries()) {
    if (control.type === 'slider' && !widgetIds.has(variableName)) {
      console.log(`Attempting to create slider for '${variableName}'`);
      const value = variableValues.get(variableName) ?? 0;
      try {
        const id = await createHiddenSlider(
          variableName,
          value as number,
          control.min!,
          control.max!,
          control.step!
        );
        registerWidgetId(variableName, id);
        console.log(`Post-compile: created slider widget ${id} for '${variableName}'`);
      } catch (e) {
        console.warn(`Failed to create slider for '${variableName}':`, e);
      }
    }
  }
}