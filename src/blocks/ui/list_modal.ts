// src/ui/listModal.ts
import { ListRegistry } from "./list_registry";
import * as Blockly from "blockly/core";

export function setupListModal(ws: Blockly.WorkspaceSvg) {
    const modal = document.getElementById("customListModal");
    const confirmButton = document.getElementById("confirmList");
    const cancelButton = document.getElementById("cancelList");

    if (!modal) {
        console.error("List modal not found");
        return;
    }

    if (confirmButton) {
        confirmButton.onclick = () => {
            const listNameInput = document.getElementById("listName") as HTMLInputElement;
            if (!listNameInput) {
                console.error("List name input not found");
                return;
            }
            const name = listNameInput.value.trim();
            if (!name) {
                alert("Please enter a list name.");
                return;
            }

            // Check if the list name already exists
            if (ListRegistry.getList(name) !== undefined) {
                alert("A list with this name already exists.");
                return;
            }

            // Register the list
            try {
                ListRegistry.createList(name);
                // Create blocks for this list
                createBlocksForList(name, ws);
                modal.classList.remove("show");

                // Reset input field
                (document.getElementById("listName") as HTMLInputElement).value = "";
            } catch (err) {
                alert("Failed to create list: " + (err as Error).message);
                console.error(err);
            }
        };
    } else {
        console.error("List confirmation button not found");
    }

    if (cancelButton) {
        cancelButton.onclick = () => {
            modal.classList.remove("show");
            // Reset input field
            (document.getElementById("listName") as HTMLInputElement).value = "";
        };
    }
}

export function openListModal() {
    const modal = document.getElementById("customListModal");
    modal?.classList.add("show");
}

// Function to create blocks for a specific list
function createBlocksForList(listName: string, ws: Blockly.WorkspaceSvg) {
    // Here you would create the Blockly blocks for list operations
    // This would connect to your block system

    // For example, dispatch an event that your block system can listen for
    const event = new CustomEvent('listCreated', {
        detail: { listName: listName }
    });
    window.dispatchEvent(event);
}