// src/ui/variableModal.ts
import { VariableRegistry } from "./variable_registry";
import * as Blockly from "blockly/core";

export function setupVariableModal(ws: Blockly.WorkspaceSvg) {
  const modal = document.getElementById("customVarModal");

  if (!modal) {
    console.error("Modal not found");
    return;
  }

  document.getElementById("confirmVar")!.onclick = () => {
    const name = (document.getElementById("varNameInput") as HTMLInputElement).value.trim();
    const scope = (document.getElementById("varScopeSelect") as HTMLSelectElement).value;

    if (!name) {
      alert("Please enter a variable name.");
      return;
    }

    VariableRegistry.registerVariable(name, scope);
    Blockly.Variables.flyoutCategory(ws); // Refresh the variable flyout
    modal.classList.remove("show");
  };

  document.getElementById("cancelVar")!.onclick = () => {
    modal.classList.remove("show");
  };
}

export function openCustomVariableModal() {
  const modal = document.getElementById("customVarModal");
  modal?.classList.add("show");
}