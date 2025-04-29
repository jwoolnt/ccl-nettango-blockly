// src/data/breed_modal.ts
import { addBreed, resetBreeds } from "./breeds";
import { updateVarScopeDropdown } from "../blocks/ui/variable_modal";
import { VariableRegistry } from "../blocks/ui/variable_registry";
import * as Blockly from "blockly";

// Safe DOM element getter with type checking
function getElement<T extends HTMLElement>(id: string, type: new () => T): T | null {
  const element = document.getElementById(id);
  if (!element) {
      console.error(`Element with ID "${id}" not found`);
      return null;
  }
  if (!(element instanceof type)) {
      console.error(`Element with ID "${id}" is not of expected type`);
      return null;
  }
  return element as T;
}
// Reset breeds on workspace change
export function setupBreedModal(ws: Blockly.WorkspaceSvg) {
  const modal = document.getElementById("customBreedModal");
  const confirmButton = document.getElementById("confirmBreed");
  const cancelButton = document.getElementById("cancelBreed");
  
  if (!modal) {
      console.error("Breed modal not found");
      return;
  }
  
  if (confirmButton) {
      confirmButton.onclick = () => {
          const typeSelect = getElement("breedTypeSelect", HTMLSelectElement);
          const pluralInput = getElement("breedPluralInput", HTMLInputElement);
          const singularInput = getElement("breedSingularInput", HTMLInputElement);
          
          if (!typeSelect || !pluralInput || !singularInput) {
              alert("Modal form elements not found.");
              return;
          }
          
          const type = typeSelect.value;
          const plural = pluralInput.value.trim();
          const singular = singularInput.value.trim();
          
          if (!plural || !singular) {
              alert("Please enter both plural and singular names for the breed.");
              return;
          }
          
          try {
              // Add the breed
              addBreed(type, [plural, singular]);
              
              // Add the new breed as a scope option for variables
              VariableRegistry.addScope(plural);
              
              // Close the modal
              modal.classList.remove("show");
              
              // Clear the input fields
              pluralInput.value = "";
              singularInput.value = "";
              
              // Force refresh of dropdowns by triggering a workspace change event
              try {
                  ws.fireChangeListener({ type: Blockly.Events.FINISHED_LOADING } as any);
              } catch (err) {
                  console.error("Error refreshing workspace:", err);
              }
          } catch (err) {
              alert("Failed to add breed: " + (err as Error).message);
              console.error(err);
          }
      };
  } else {
      console.error("Breed confirmation button not found");
  }
  
  if (cancelButton) {
      cancelButton.onclick = () => {
          // Find and clear input fields
          const pluralInput = getElement("breedPluralInput", HTMLInputElement);
          const singularInput = getElement("breedSingularInput", HTMLInputElement);
          
          if (pluralInput) pluralInput.value = "";
          if (singularInput) singularInput.value = "";
          
          modal.classList.remove("show");
      };
  } else {
      console.error("Breed cancel button not found");
  }
}

export function openBreedModal() {
  const modal = document.getElementById("customBreedModal");
  if (modal) {
      modal.classList.add("show");
  } else {
      console.error("Cannot open breed modal: element not found");
  }
}