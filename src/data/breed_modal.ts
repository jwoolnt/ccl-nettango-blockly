// src/data/breed_modal.ts
import { addBreed, resetBreeds } from "./breeds";
import { updateVarScopeDropdown } from "../blocks/ui/variable_modal";
import { VariableRegistry } from "../blocks/ui/variable_registry";
import * as Blockly from "blockly";

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
      const type = (document.getElementById("breedTypeSelect") as HTMLSelectElement).value;
      const plural = (document.getElementById("breedPluralInput") as HTMLInputElement).value.trim();
      const singular = (document.getElementById("breedSingularInput") as HTMLInputElement).value.trim();
      
      if (!plural || !singular) {
        alert("Please enter both plural and singular names for the breed.");
        return;
      }
      
      // Check if the breed name already exists (simple validation)
      try {
        // Add the breed
        addBreed(type, [plural, singular]);
        
        // Add the new breed as a scope option for variables
        VariableRegistry.addScope(plural);
        // updateVarScopeDropdown();
        // Close the modal
        modal.classList.remove("show");
        
        // Clear the input fields
        (document.getElementById("breedPluralInput") as HTMLInputElement).value = "";
        (document.getElementById("breedSingularInput") as HTMLInputElement).value = "";
        
        // Force refresh of dropdowns by triggering a workspace change event
        ws.fireChangeListener({ type: Blockly.Events.FINISHED_LOADING } as any);
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
      modal.classList.remove("show");
    };
  }
}

export function openBreedModal() {
  const modal = document.getElementById("customBreedModal");
  modal?.classList.add("show");
}