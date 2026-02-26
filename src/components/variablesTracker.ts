/**
 * Variables tracker
 * Core state management for variables and their controls
 * Coordinates display, dialogs, and widget creation
 */

import {
  getUserVariables,
  VariableControl,
  registerVariableTrackerSerializers,
} from "../data/context";
import { runCode } from "../services/netlogoAPI";
import { createSliderWidgets } from "../services/widgets/widgetCreation";
import {
  renderVariablesList,
  inferVariableType,
  showContextMenu,
  hideContextMenu,
} from "./variablesDisplay/display";
import {
  showRenameDialog,
  showRemoveDialog,
} from "./variablesDisplay/dialogs";
import { showAddVariableDialogFromBlock } from "./dialog";

// ===== State Management =====

let workspace: any = null;
let displayCodeCallback: (() => void) | null = null;
let selectedVariable: string | null = null;
let previousVariableList: string[] = [];

const variableControls = new Map<string, VariableControl>();
const variableValues = new Map<string, any>();
const sliderDebounceTimers = new Map<string, ReturnType<typeof setTimeout>>();

// ===== Initialization =====

export function initVariablesTracker(ws: any, callback: () => void): void {
  workspace = ws;
  displayCodeCallback = callback;

  registerVariableTrackerSerializers(
    getVariableControlsData,
    getVariableValuesData,
    setVariableControlsData,
    setVariableValuesData
  );

  const trackerList = document.getElementById('variables-tracker-list');
  const contextMenu = document.getElementById('variables-context-menu');

  if (!trackerList || !contextMenu) {
    console.error("Variables tracker elements not found");
    return;
  }

  updateVariablesDisplay();
  setupEventListeners();

  ws.addChangeListener(() => {
    const currentVars = getUserVariables();
    const varsChanged =
      currentVars.length !== previousVariableList.length ||
      currentVars.some((v, i) => v !== previousVariableList[i]);

    if (varsChanged) {
      previousVariableList = [...currentVars];
      updateVariablesDisplay();
    }
  });
}

// ===== Event Setup =====

function setupEventListeners(): void {
  const trackerList = document.getElementById('variables-tracker-list');
  const contextMenu = document.getElementById('variables-context-menu');

  if (!trackerList || !contextMenu) return;

  // Click handlers for toggle and add variable
  trackerList.addEventListener('click', (e) => {
    const clickedElement = e.target as HTMLElement;

    if (
      clickedElement.classList.contains('control-slider') ||
      clickedElement.classList.contains('control-switch-input')
    ) {
      return;
    }

    const target = clickedElement.closest('.variable-item');
    if (target && !target.classList.contains('add-item-btn')) {
      const variableName = target.getAttribute('data-variable');
      if (variableName) {
        handleVariableItemClick(variableName);
      }
    } else if (target?.classList.contains('add-item-btn')) {
      if (workspace && displayCodeCallback) {
        showAddVariableDialogFromBlock(workspace, displayCodeCallback);
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
        showContextMenu((e as MouseEvent).clientX, (e as MouseEvent).clientY);
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
        showRenameDialog(selectedVariable, workspace, updateVariablesDisplay);
        hideContextMenu();
      }
    });
  }

  if (removeItem) {
    removeItem.addEventListener('click', () => {
      if (selectedVariable) {
        showRemoveDialog(selectedVariable, workspace, updateVariablesDisplay);
        hideContextMenu();
      }
    });
  }
}

// ===== Variable Interaction =====

function handleVariableItemClick(variableName: string): void {
  if (variableControls.has(variableName)) {
    // Toggle off - remove the control
    variableControls.delete(variableName);
    updateVariablesDisplay();
  } else {
    // Toggle on - create the control
    handleVariableCreation(variableName);
  }
}

function handleVariableCreation(variableName: string): void {
  const currentValue =
    variableValues.get(variableName) ?? inferVariableType(variableName);
  const varType = typeof currentValue;

  if (varType === 'number') {
    const control: VariableControl = {
      type: 'slider',
      enabled: true,
      min: 0,
      max: Math.max(100, (currentValue as number) * 2),
      step: Number.isInteger(currentValue as number) ? 1 : 0.1,
    };
    variableControls.set(variableName, control);
    if (!variableValues.has(variableName))
      variableValues.set(variableName, currentValue);
  } else if (varType === 'boolean') {
    variableControls.set(variableName, { type: 'switch', enabled: true });
    if (!variableValues.has(variableName))
      variableValues.set(variableName, currentValue);
  }

  updateVariablesDisplay();
  if (displayCodeCallback) displayCodeCallback();
}

function updateVariableValue(
  variableName: string,
  newValue: any,
  debounced: boolean = false
): void {
  if (debounced) {
    updateVariableValueDebounced(variableName, newValue);
  } else {
    variableValues.set(variableName, newValue);
    runCode(`set ${variableName} ${newValue}`);
  }
}

function updateVariableValueDebounced(
  variableName: string,
  newValue: any,
  delay: number = 100
): void {
  const existingTimer = sliderDebounceTimers.get(variableName);
  if (existingTimer) {
    clearTimeout(existingTimer);
  }

  const timer = setTimeout(() => {
    variableValues.set(variableName, newValue);
    runCode(`set ${variableName} ${newValue}`);
    sliderDebounceTimers.delete(variableName);
  }, delay);

  sliderDebounceTimers.set(variableName, timer);
}


// ===== Display =====

function updateVariablesDisplay(): void {
  const allVars = getUserVariables();
  previousVariableList = [...allVars];

  renderVariablesList(
    variableControls,
    variableValues,
    updateVariableValue
  );

  // Add button for creating new variables
  const trackerList = document.getElementById('variables-tracker-list');
  if (!trackerList) return;

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


// ===== Widget Creation =====

export async function createSliderWidgetsFromTracker(): Promise<void> {
  await createSliderWidgets(variableControls, variableValues);
}

export function syncSliderValuesToNetLogo(): void {
  for (const [variableName, control] of variableControls.entries()) {
    if (control.type === 'slider') {
      const value = variableValues.get(variableName) ?? 0;
      runCode(`set ${variableName} ${value}`);
    } else if (control.type === 'switch') {
      const value = variableValues.get(variableName) ?? false;
      runCode(`set ${variableName} ${Boolean(value)}`);
    }
  }
}

// ===== Serialization =====

export function getVariableInitialValues(): Map<string, any> {
  return new Map(variableValues);
}

export function refreshVariablesDisplay(): void {
  updateVariablesDisplay();
}

export function getVariableControlsData(): Record<string, VariableControl> {
  const data: Record<string, VariableControl> = {};
  variableControls.forEach((control, name) => {
    data[name] = { ...control };
  });
  return data;
}

export function getVariableValuesData(): Record<string, any> {
  const data: Record<string, any> = {};
  variableValues.forEach((value, name) => {
    data[name] = value;
  });
  return data;
}

export function setVariableControlsData(
  data: Record<string, VariableControl>
): void {
  variableControls.clear();
  Object.entries(data).forEach(([name, control]) => {
    variableControls.set(name, control);
  });
  if (workspace) {
    updateVariablesDisplay();
  }
}

export function setVariableValuesData(data: Record<string, any>): void {
  variableValues.clear();
  Object.entries(data).forEach(([name, value]) => {
    variableValues.set(name, value);
  });
  if (workspace) {
    updateVariablesDisplay();
  }
}