import { refreshMITPlugin, getAllBreeds, updateBreed, removeBreed } from "./data/context";
import { save } from "./services/serializer";
import { openDialog, closeDialog, createDialogElement, createButton, createFormField } from "./moduleElements";

let workspace: any = null;
let displayCodeCallback: (() => void) | null = null;
let selectedBreed: string | null = null;

export function initBreedTracker(ws: any, callback: () => void) {
  workspace = ws;
  displayCodeCallback = callback;

  const trackerList = document.getElementById('breeds-tracker-list');
  const contextMenu = document.getElementById('breeds-context-menu');

  if (!trackerList || !contextMenu) {
    console.error("Breeds tracker elements not found");
    return;
  }

  updateBreedsDisplay();

  trackerList.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    const target = (e.target as HTMLElement).closest('.variable-item');
    if (target) {
      selectedBreed = target.getAttribute('data-breed') || null;
      if (selectedBreed) {
        showContextMenu(e.clientX, e.clientY);
      }
    }
  });

  document.addEventListener('click', () => {
    hideContextMenu();
  });

  const renameItem = document.getElementById('breed-context-menu-rename');
  const removeItem = document.getElementById('breed-context-menu-remove');

  if (renameItem) {
    renameItem.addEventListener('click', () => {
      if (selectedBreed) {
        showRenameDialog(selectedBreed);
        hideContextMenu();
      }
    });
  }

  if (removeItem) {
    removeItem.addEventListener('click', () => {
      if (selectedBreed) {
        showRemoveDialog(selectedBreed);
        hideContextMenu();
      }
    });
  }

  ws.addChangeListener(() => {
    updateBreedsDisplay();
  });
}

function updateBreedsDisplay() {
  const trackerList = document.getElementById('breeds-tracker-list');
  if (!trackerList) return;

  trackerList.innerHTML = '';

  const breeds = getAllBreeds();

  if (!breeds || breeds.length === 0) {
    const emptyMsg = document.createElement('div');
    emptyMsg.className = 'variable-empty';
    emptyMsg.textContent = 'No breeds defined';
    emptyMsg.style.cssText = 'padding: 16px; color: #9ca3af; font-size: 13px; text-align: center; width: 100%;';
    trackerList.appendChild(emptyMsg);
    return;
  }

  breeds.forEach(({ pluralName }) => {
    const item = document.createElement('div');
    item.className = 'variable-item';
    item.setAttribute('data-breed', pluralName);
    item.textContent = pluralName;
    trackerList.appendChild(item);
  });
}

function showContextMenu(x: number, y: number) {
  const contextMenu = document.getElementById('breeds-context-menu');
  if (!contextMenu) return;
  contextMenu.style.left = `${x}px`;
  contextMenu.style.top = `${y}px`;
  contextMenu.classList.add('show');
}

function hideContextMenu() {
  const contextMenu = document.getElementById('breeds-context-menu');
  if (contextMenu) {
    contextMenu.classList.remove('show');
  }
  selectedBreed = null;
}

function showRenameDialog(breedName: string) {
  const dialog = createDialogElement('Rename Breed');
  const content = dialog.querySelector('.dialog-content') as HTMLDivElement;

  const form = document.createElement('form');
  form.id = 'rename-breed-tracker-form';

  const oldNameField = createFormField('Current Name:', 'tracker-old-breed-name');
  (oldNameField.querySelector('input') as HTMLInputElement).value = breedName;
  (oldNameField.querySelector('input') as HTMLInputElement).disabled = true;
  form.appendChild(oldNameField);

  const newNameField = createFormField('New Name:', 'tracker-new-breed-name');
  form.appendChild(newNameField);

  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'button-container';

  const cancelButton = createButton('Cancel', closeDialog);
  const renameButton = createButton('Rename', () => {
    const newName = (document.getElementById('tracker-new-breed-name') as HTMLInputElement).value;

    if (newName && newName.trim()) {
      try {
        updateBreed(breedName, { pluralName: newName.trim() });
        refreshMITPlugin();
        if (displayCodeCallback) displayCodeCallback();
        if (workspace) save(workspace);
        updateBreedsDisplay();
        closeDialog();
      } catch (error) {
        alert(`Error renaming breed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } else {
      alert('Please enter a new breed name');
    }
  }, 'primary');

  buttonContainer.appendChild(cancelButton);
  buttonContainer.appendChild(renameButton);
  form.appendChild(buttonContainer);
  content.appendChild(form);

  openDialog(dialog);

  setTimeout(() => {
    const nameInput = document.getElementById('tracker-new-breed-name') as HTMLInputElement;
    if (nameInput) nameInput.focus();
  }, 100);
}

function showRemoveDialog(breedName: string) {
  if (!confirm(`Are you sure you want to remove the breed "${breedName}"?`)) {
    return;
  }

  try {
    removeBreed(breedName);
    refreshMITPlugin();
    if (displayCodeCallback) displayCodeCallback();
    if (workspace) save(workspace);
    updateBreedsDisplay();
  } catch (error) {
    alert(`Error removing breed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function refreshBreedsDisplay() {
  updateBreedsDisplay();
}
