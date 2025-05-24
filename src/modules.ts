// dialog.ts - Custom modal dialog components
import * as Blockly from "blockly";
import { addBreed, addVariable, BreedType, getAllBreeds, refreshMITPlugin, removeBreed, removeVariable, updateVariable, addList, removeList} from "./data/context";
import { save } from "./services/serializer";

// Dialog DOM elements
let dialogOverlay: HTMLDivElement | null = null;
let currentDialog: HTMLDivElement | null = null;

// Initialize dialog elements
export function initDialogs() {
    // Create overlay element if it doesn't exist
    if (!dialogOverlay) {
        dialogOverlay = document.createElement('div');
        dialogOverlay.className = 'dialog-overlay';
        dialogOverlay.style.display = 'none';
        document.body.appendChild(dialogOverlay);

        // Close dialog when clicking on overlay
        dialogOverlay.addEventListener('click', (e) => {
            if (e.target === dialogOverlay) {
                closeDialog();
            }
        });
    }
}

// Open a dialog
function openDialog(dialogContent: HTMLDivElement) {
    if (!dialogOverlay) initDialogs();

    // Remove any existing dialog
    if (currentDialog && dialogOverlay) {
        dialogOverlay.removeChild(currentDialog);
    }

    // Set current dialog and display
    currentDialog = dialogContent;
    if (dialogOverlay) {
        dialogOverlay.appendChild(currentDialog);
        dialogOverlay.style.display = 'flex';
    }
}

// Close the dialog
export function closeDialog() {
    if (dialogOverlay) {
        dialogOverlay.style.display = 'none';
        if (currentDialog) {
            dialogOverlay.removeChild(currentDialog);
            currentDialog = null;
        }
    }
}

// Create a dialog element with title and content
function createDialogElement(title: string): HTMLDivElement {
    const dialog = document.createElement('div');
    dialog.className = 'dialog';

    const dialogHeader = document.createElement('div');
    dialogHeader.className = 'dialog-header';

    const dialogTitle = document.createElement('h3');
    dialogTitle.textContent = title;
    dialogHeader.appendChild(dialogTitle);

    const closeButton = document.createElement('button');
    closeButton.className = 'dialog-close';
    closeButton.textContent = '×';
    closeButton.addEventListener('click', closeDialog);
    dialogHeader.appendChild(closeButton);

    const dialogContent = document.createElement('div');
    dialogContent.className = 'dialog-content';

    dialog.appendChild(dialogHeader);
    dialog.appendChild(dialogContent);

    return dialog;
}

// Create a button element
function createButton(text: string, onClick: () => void, className: string = ''): HTMLButtonElement {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = `dialog-button ${className}`;
    button.addEventListener('click', onClick);
    return button;
}

// Create a form input with label
function createFormField(label: string, id: string, type: string = 'text'): HTMLDivElement {
    const field = document.createElement('div');
    field.className = 'form-field';

    const labelElement = document.createElement('label');
    labelElement.htmlFor = id;
    labelElement.textContent = label;
    field.appendChild(labelElement);

    const input = document.createElement('input');
    input.type = type;
    input.id = id;
    input.name = id;
    field.appendChild(input);

    return field;
}

// Create a select dropdown with options
function createSelectField(label: string, id: string, options: { value: string, text: string }[]): HTMLDivElement {
    const field = document.createElement('div');
    field.className = 'form-field';

    const labelElement = document.createElement('label');
    labelElement.htmlFor = id;
    labelElement.textContent = label;
    field.appendChild(labelElement);

    const select = document.createElement('select');
    select.id = id;
    select.name = id;

    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        select.appendChild(optionElement);
    });

    field.appendChild(select);

    return field;
}

// Variable Dialogs
export function showVariableActionDialog(workspace: any, displayCodeCallback: () => void) {
    const dialog = createDialogElement('Variable Actions');
    const content = dialog.querySelector('.dialog-content') as HTMLDivElement;

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    // Create title element
    const title = document.createElement('p');
    title.textContent = "Select an action:";
    title.className = 'dialog-title';
    content.appendChild(title);


    const addButton = createButton('Add', () => {
        closeDialog();
        showAddVariableDialog(workspace, displayCodeCallback);
    }, 'primary');

    const renameButton = createButton('Rename', () => {
        closeDialog();
        showRenameVariableDialog(workspace, displayCodeCallback);
    });

    const removeButton = createButton('Remove', () => {
        closeDialog();
        showRemoveVariableDialog(workspace, displayCodeCallback);
    });

    buttonContainer.appendChild(addButton);
    buttonContainer.appendChild(renameButton);
    buttonContainer.appendChild(removeButton);

    content.appendChild(buttonContainer);
    openDialog(dialog);
}

// 
// Show the add variable dialog
// 
function showAddVariableDialog(workspace: any, displayCodeCallback: () => void) {
    const dialog = createDialogElement('Add Variable');
    const content = dialog.querySelector('.dialog-content') as HTMLDivElement;

    // Create form
    const form = document.createElement('form');
    form.id = 'add-variable-form';

    // Variable name field
    const nameField = createFormField('Variable Name:', 'variable-name');
    form.appendChild(nameField);

    // Scope selection field
    const scopeOptions = [
        { value: "globals", text: "Global" },
        { value: "turtles", text: "Turtles" },
        { value: "patches", text: "Patches" },
        { value: "links", text: "Links" },
        { value: "ui", text: "UI" },
        ...getAllBreeds().map(breed => ({ value: breed.pluralName, text: breed.pluralName }))
    ];

    const scopeField = createSelectField('Scope:', 'variable-scope', scopeOptions);
    form.appendChild(scopeField);

    // Button container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    const cancelButton = createButton('Cancel', closeDialog);
    const addButton = createButton('Add', () => {
        const name = (document.getElementById('variable-name') as HTMLInputElement).value;
        const scope = (document.getElementById('variable-scope') as HTMLSelectElement).value;

        if (name) {
            // Add to Blockly's internal variable model
            workspace.createVariable(name); 
            workspace.updateToolbox(workspace.options.languageTree);

            addVariable(name, scope);
            refreshMITPlugin();
            displayCodeCallback();
            save(workspace);

            const toolbox = workspace.getToolbox();
            const selectedItem = toolbox.getSelectedItem();
            if (selectedItem) {
                toolbox.refreshSelection(); 
            }

            closeDialog();
        } else {
            alert('Please enter a variable name');
        }
    }, 'primary');

    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(addButton);

    form.appendChild(buttonContainer);
    content.appendChild(form);

    openDialog(dialog);

    // Focus on the name field
    setTimeout(() => {
        const nameInput = document.getElementById('variable-name') as HTMLInputElement;
        if (nameInput) nameInput.focus();
    }, 100);
}

// 
// Show the rename variable dialog
// 
function showRenameVariableDialog(workspace: any, displayCodeCallback: () => void) {
    const dialog = createDialogElement('Rename Variable');
    const content = dialog.querySelector('.dialog-content') as HTMLDivElement;

    // Create form
    const form = document.createElement('form');
    form.id = 'rename-variable-form';

    // Old name field
    const oldNameField = createFormField('Current Variable Name:', 'old-variable-name');
    form.appendChild(oldNameField);

    // New name field
    const newNameField = createFormField('New Variable Name:', 'new-variable-name');
    form.appendChild(newNameField);

    // Button container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    const cancelButton = createButton('Cancel', closeDialog);
    const renameButton = createButton('Rename', () => {
        const oldName = (document.getElementById('old-variable-name') as HTMLInputElement).value;
        const newName = (document.getElementById('new-variable-name') as HTMLInputElement).value;

        if (oldName && newName) {
            updateVariable(oldName, newName);
            refreshMITPlugin();
            displayCodeCallback();
            save(workspace);
            closeDialog();
        } else {
            alert('Please enter both the current and new variable names');
        }
    }, 'primary');

    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(renameButton);

    form.appendChild(buttonContainer);
    content.appendChild(form);

    openDialog(dialog);

    // Focus on the old name field
    setTimeout(() => {
        const nameInput = document.getElementById('old-variable-name') as HTMLInputElement;
        if (nameInput) nameInput.focus();
    }, 100);
}

function showRemoveVariableDialog(workspace: any, displayCodeCallback: () => void) {
    const dialog = createDialogElement('Remove Variable');
    const content = dialog.querySelector('.dialog-content') as HTMLDivElement;

    // Create form
    const form = document.createElement('form');
    form.id = 'remove-variable-form';

    // Variable name field
    const nameField = createFormField('Variable Name:', 'remove-variable-name');
    form.appendChild(nameField);

    // Button container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    const cancelButton = createButton('Cancel', closeDialog);
    const removeButton = createButton('Remove', () => {
        const name = (document.getElementById('remove-variable-name') as HTMLInputElement).value;

        if (name) {
            removeVariable(name);
            refreshMITPlugin();
            displayCodeCallback();
            save(workspace);
            closeDialog();
        } else {
            alert('Please enter a variable name');
        }
    }, 'primary');

    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(removeButton);

    form.appendChild(buttonContainer);
    content.appendChild(form);

    openDialog(dialog);

    // Focus on the name field
    setTimeout(() => {
        const nameInput = document.getElementById('remove-variable-name') as HTMLInputElement;
        if (nameInput) nameInput.focus();
    }, 100);
}

// Breed Dialogs
export function showBreedActionDialog(workspace: any, displayCodeCallback: () => void) {
    const dialog = createDialogElement('Breed Actions');
    const content = dialog.querySelector('.dialog-content') as HTMLDivElement;

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    // Create title element
    const title = document.createElement('p');
    title.textContent = "Select an action:";
    title.className = 'dialog-title';
    content.appendChild(title);
    
    const addButton = createButton('Add Breed', () => {
        closeDialog();
        showAddBreedDialog(workspace, displayCodeCallback);
    }, 'primary');

    const removeButton = createButton('Remove Breed', () => {
        closeDialog();
        showRemoveBreedDialog(workspace, displayCodeCallback);
    });

    buttonContainer.appendChild(addButton);
    buttonContainer.appendChild(removeButton);

    content.appendChild(buttonContainer);
    openDialog(dialog);
}

function showAddBreedDialog(workspace: any, displayCodeCallback: () => void) {
    const dialog = createDialogElement('Add Breed');
    const content = dialog.querySelector('.dialog-content') as HTMLDivElement;

    // Create form
    const form = document.createElement('form');
    form.id = 'add-breed-form';

    // Breed type selection
    const typeOptions = [
        { value: "turtle", text: "Turtle" },
        { value: "undirected-link", text: "Undirected Link" },
        { value: "directed-link", text: "Directed Link" }
    ];

    const typeField = createSelectField('Breed Type:', 'breed-type', typeOptions);
    form.appendChild(typeField);

    // Plural name field
    const pluralNameField = createFormField('Plural Name:', 'breed-plural-name');
    form.appendChild(pluralNameField);

    // Singular name field
    const singularNameField = createFormField('Singular Name:', 'breed-singular-name');
    form.appendChild(singularNameField);

    // Button container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    const cancelButton = createButton('Cancel', closeDialog);
    const addButton = createButton('Add', () => {
        const typeSelect = document.getElementById('breed-type') as HTMLSelectElement;
        const pluralName = (document.getElementById('breed-plural-name') as HTMLInputElement).value;
        const singularName = (document.getElementById('breed-singular-name') as HTMLInputElement).value;

        if (typeSelect && pluralName && singularName) {
            const type = typeSelect.value as BreedType;

            addBreed({
                type,
                pluralName,
                singularName
            });

            refreshMITPlugin();
            displayCodeCallback();
            save(workspace);
            closeDialog();
        } else {
            alert('Please fill in all fields');
        }
    }, 'primary');

    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(addButton);

    form.appendChild(buttonContainer);
    content.appendChild(form);

    openDialog(dialog);

    // Focus on the plural name field
    setTimeout(() => {
        const nameInput = document.getElementById('breed-plural-name') as HTMLInputElement;
        if (nameInput) nameInput.focus();
    }, 100);
}

function showRemoveBreedDialog(workspace: any, displayCodeCallback: () => void) {
    const dialog = createDialogElement('Remove Breed');
    const content = dialog.querySelector('.dialog-content') as HTMLDivElement;

    // Create form
    const form = document.createElement('form');
    form.id = 'remove-breed-form';

    // Breed name field
    const nameField = createFormField('Breed Name:', 'remove-breed-name');
    form.appendChild(nameField);

    // Button container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    const cancelButton = createButton('Cancel', closeDialog);
    const removeButton = createButton('Remove', () => {
        const name = (document.getElementById('remove-breed-name') as HTMLInputElement).value;

        if (name) {
            removeBreed(name);
            refreshMITPlugin();
            displayCodeCallback();
            save(workspace);
            closeDialog();
        } else {
            alert('Please enter a breed name');
        }
    }, 'primary');

    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(removeButton);

    form.appendChild(buttonContainer);
    content.appendChild(form);

    openDialog(dialog);

    // Focus on the name field
    setTimeout(() => {
        const nameInput = document.getElementById('remove-breed-name') as HTMLInputElement;
        if (nameInput) nameInput.focus();
    }, 100);
}


// List Dialogs
export function showListActionDialog(workspace: any, displayCodeCallback: () => void) {
    const dialog = createDialogElement('List Actions');
    const content = dialog.querySelector('.dialog-content') as HTMLDivElement;

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    // Create title element
    const title = document.createElement('p');
    title.textContent = "Select an action:";
    title.className = 'dialog-title';
    content.appendChild(title);

    const addButton = createButton('Add List', () => {
        closeDialog();
        showAddListDialog(workspace, displayCodeCallback);
    }, 'primary');

    const removeButton = createButton('Remove List', () => {
        closeDialog();
        showRemoveListDialog(workspace, displayCodeCallback);
    });

    buttonContainer.appendChild(addButton);
    buttonContainer.appendChild(removeButton);

    content.appendChild(buttonContainer);
    openDialog(dialog);
}
function showAddListDialog(workspace: any, displayCodeCallback: () => void) {
    const dialog = createDialogElement('Add List');
    const content = dialog.querySelector('.dialog-content') as HTMLDivElement;

    // Create form
    const form = document.createElement('form');
    form.id = 'add-list-form';

    // List name field
    const nameField = createFormField('List Name:', 'list-name');
    form.appendChild(nameField);

    // Button container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    const cancelButton = createButton('Cancel', closeDialog);
    const addButton = createButton('Add', () => {
        const name = (document.getElementById('list-name') as HTMLInputElement).value;

        if (name) {
            addList(name);
            refreshMITPlugin();
            displayCodeCallback();
            save(workspace);
            closeDialog();
        } else {
            alert('Please enter a list name');
        }
    }, 'primary');

    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(addButton);

    form.appendChild(buttonContainer);
    content.appendChild(form);

    openDialog(dialog);

    // Focus on the name field
    setTimeout(() => {
        const nameInput = document.getElementById('list-name') as HTMLInputElement;
        if (nameInput) nameInput.focus();
    }, 100);
}
function showRemoveListDialog(workspace: any, displayCodeCallback: () => void) {
    const dialog = createDialogElement('Remove List');
    const content = dialog.querySelector('.dialog-content') as HTMLDivElement;

    // Create form
    const form = document.createElement('form');
    form.id = 'remove-list-form';

    // List name field
    const nameField = createFormField('List Name:', 'remove-list-name');
    form.appendChild(nameField);

    // Button container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    const cancelButton = createButton('Cancel', closeDialog);
    const removeButton = createButton('Remove', () => {
        const name = (document.getElementById('remove-list-name') as HTMLInputElement).value;

        if (name) {
            removeList(name);
            refreshMITPlugin();
            displayCodeCallback();
            save(workspace);
            closeDialog();
        } else {
            alert('Please enter a list name');
        }
    }, 'primary');

    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(removeButton);

    form.appendChild(buttonContainer);
    content.appendChild(form);

    openDialog(dialog);

    // Focus on the name field
    setTimeout(() => {
        const nameInput = document.getElementById('remove-list-name') as HTMLInputElement;
        if (nameInput) nameInput.focus();
    }, 100);
}

function reset(workspace: Blockly.WorkspaceSvg): void {
    workspace.clear();
}

// reset module to reset the workspace
export function resetWorkspace(workspace: Blockly.WorkspaceSvg): void {
    const dialog = createDialogElement('Reset');
    const content = dialog.querySelector('.dialog-content') as HTMLDivElement;

    const message = document.createElement('p');
    message.textContent = 'Are you sure you want to reset the workspace?';
    content.appendChild(message);

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    const cancelButton = createButton('Cancel', closeDialog);
    const resetButton = createButton('Reset', () => {
        reset(workspace);
        closeDialog();
    }, 'primary');

    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(resetButton);

    content.appendChild(buttonContainer);
    openDialog(dialog);
}
