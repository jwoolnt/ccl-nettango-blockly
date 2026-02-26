/**
 * Variables tracker dialogs
 * Handles rename and remove dialogs for variables
 */

import {
  removeVariable,
  updateVariable,
  refreshMITPlugin,
} from "../../data/context";
import { save } from "../../services/serializer";
import {
  openDialog,
  closeDialog,
  createDialogElement,
  createButton,
  createFormField,
} from "../dialog";

/**
 * Show rename dialog for a variable
 */
export function showRenameDialog(
  variableName: string,
  workspace: any,
  onSuccess: () => void
): void {
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
        if (workspace) save(workspace);
        onSuccess();
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

  openDialog(dialog);

  setTimeout(() => {
    const nameInput = document.getElementById('tracker-new-variable-name') as HTMLInputElement;
    if (nameInput) nameInput.focus();
  }, 100);
}

/**
 * Show remove confirmation dialog for a variable
 */
export function showRemoveDialog(
  variableName: string,
  workspace: any,
  onSuccess: () => void
): void {
  if (!confirm(`Are you sure you want to remove the variable "${variableName}"?`)) {
    return;
  }

  try {
    removeVariable(variableName);
    refreshMITPlugin();
    if (workspace) save(workspace);
    onSuccess();
  } catch (error) {
    alert(`Error removing variable: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
