/**
 * Variables display UI rendering
 * Handles display of variable controls (sliders, switches) in the UI
 */

import { getUserVariables, getVariableOwner, type VariableControl } from "../../data/context";

/**
 * Render variable controls in the tracker list
 */
export function renderVariablesList(
  variableControls: Map<string, VariableControl>,
  variableValues: Map<string, any>,
  onVariableValueChange: (variableName: string, newValue: any, debounced?: boolean) => void
): void {
  const trackerList = document.getElementById('variables-tracker-list');
  if (!trackerList) return;

  const allVars = getUserVariables();
  trackerList.innerHTML = '';

  if (allVars.length === 0) {
    const emptyMsg = document.createElement('div');
    emptyMsg.className = 'variable-empty';
    emptyMsg.textContent = 'No variables defined';
    trackerList.appendChild(emptyMsg);
  } else {
    allVars.forEach(variableName => {
      const item = createVariableItem(
        variableName,
        variableControls,
        variableValues,
        onVariableValueChange
      );
      trackerList.appendChild(item);
    });
  }
}

/**
 * Create a single variable item element
 */
export function createVariableItem(
  variableName: string,
  variableControls: Map<string, VariableControl>,
  variableValues: Map<string, any>,
  onVariableValueChange: (variableName: string, newValue: any, debounced?: boolean) => void
): HTMLElement {
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
      const sliderContainer = createSliderControl(
        variableName,
        value,
        control,
        variableValues,
        onVariableValueChange
      );
      item.appendChild(sliderContainer);
    } else if (control.type === 'switch') {
      const switchContainer = createSwitchControl(
        variableName,
        value,
        variableValues,
        onVariableValueChange
      );
      item.appendChild(switchContainer);
    }

    const owner = getVariableOwner(variableName);
    const badge = createScopeBadge(owner, true);
    item.appendChild(badge);
  } else {
    const nameSpan = document.createElement('span');
    nameSpan.textContent = variableName;
    item.appendChild(nameSpan);

    const owner = getVariableOwner(variableName);
    const badge = createScopeBadge(owner, false);
    item.appendChild(badge);
  }

  return item;
}

/**
 * Create a slider control element
 */
function createSliderControl(
  variableName: string,
  value: any,
  control: VariableControl,
  variableValues: Map<string, any>,
  onVariableValueChange: (variableName: string, newValue: any, debounced?: boolean) => void
): HTMLElement {
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
    onVariableValueChange(variableName, newValue, true); // true = debounced
  });

  slider.addEventListener('change', (e) => {
    const newValue = Number((e.target as HTMLInputElement).value);
    // Ensure final value is applied immediately when slider is released
    onVariableValueChange(variableName, newValue, false); // false = immediate
  });

  sliderContainer.appendChild(valueDisplay);
  sliderContainer.appendChild(slider);
  return sliderContainer;
}

/**
 * Create a switch control element
 */
function createSwitchControl(
  variableName: string,
  value: any,
  variableValues: Map<string, any>,
  onVariableValueChange: (variableName: string, newValue: any) => void
): HTMLElement {
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
    onVariableValueChange(variableName, newValue);
  });

  switchContainer.appendChild(switchInput);
  switchContainer.appendChild(label);
  return switchContainer;
}

/**
 * Create a scope badge (ui/global indicator)
 */
function createScopeBadge(owner: string | null | undefined, isControl: boolean): HTMLElement {
  const badge = document.createElement('span');
  badge.className = isControl ? 'control-scope-badge' : 'variable-scope-badge';
  badge.textContent = owner ?? 'unknown';

  if (owner === 'ui') {
    badge.classList.add('badge-ui');
    badge.title = 'UI variable — survives setup/clear-all';
  } else if (owner === 'globals') {
    badge.classList.add('badge-global');
    badge.title = 'Code global — reset by clear-all';
  }

  return badge;
}

/**
 * Infer variable type from name conventions
 */
export function inferVariableType(variableName: string): number | boolean {
  const name = variableName.toLowerCase();
  if (name.includes('?') || name.startsWith('is-') || name.startsWith('has-')) {
    return false;
  }
  return 0;
}

/**
 * Show context menu at specified position
 */
export function showContextMenu(x: number, y: number): void {
  const contextMenu = document.getElementById('variables-context-menu');
  if (!contextMenu) return;

  contextMenu.style.left = `${x}px`;
  contextMenu.style.top = `${y}px`;
  contextMenu.classList.add('show');
}

/**
 * Hide context menu
 */
export function hideContextMenu(): void {
  const contextMenu = document.getElementById('variables-context-menu');
  if (contextMenu) {
    contextMenu.classList.remove('show');
  }
}
