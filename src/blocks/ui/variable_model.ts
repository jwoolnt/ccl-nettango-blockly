// src/ui/variableModal.ts
import { VariableRegistry } from "./variable_registry";
import * as Blockly from "blockly/core";

export function setupVariableModal(ws: Blockly.WorkspaceSvg) {
  const modal = document.getElementById("customVarModal");
  const confirmButton = document.getElementById("confirmVar");
  const cancelButton = document.getElementById("cancelVar");

  if (!modal) {
    console.error("Modal not found");
    return;
  }
  
  if (confirmButton){
    confirmButton.onclick = () => {
      const name = (document.getElementById("varNameInput") as HTMLInputElement).value.trim();
      const scope = (document.getElementById("varScopeSelect") as HTMLSelectElement).value;

      if (!name) {
        alert("Please enter a variable name.");
        return;
      }
      if (!scope) {
        alert("Please select a variable scope.");
        return;
      }
      // check if the variable name already exists in the selected scope
      if (VariableRegistry.getVariablesByScope(scope).some(v => v.name === name)) {
        alert("Variable already exists in this scope.");
        return;
      }
      // register the variable
      try {
        VariableRegistry.registerVariable(name, scope);
        Blockly.Variables.flyoutCategory(ws); // Refresh the variable flyout
        modal.classList.remove("show");
      } catch (err) {
        alert("Failed to register variable: " + (err as Error).message);
        console.error(err);
      }
    };
  } else {
    console.error("Confirmation failed");
  }

  if (cancelButton) {
    cancelButton.onclick = () => {
      modal.classList.remove("show");
    };
  }
}

export function openCustomVariableModal() {
  const modal = document.getElementById("customVarModal");
  modal?.classList.add("show");
}