// src/ui/variableModal.ts
import { VariableRegistry } from "./variable_registry";
import * as Blockly from "blockly/core";

export function setupVariableModal(ws: Blockly.WorkspaceSvg) {
  const modal = document.getElementById("customVarModal");
  const confirmButton = document.getElementById("confirmVar");
  const cancelButton = document.getElementById("cancelVar");
  
  // Listen for scope changes
  window.addEventListener('variableScopesChanged', () => {
    updateVarScopeDropdown();
  });

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


export function updateVarScopeDropdown() {
  const scopeSelect = document.getElementById('varScopeSelect') as HTMLSelectElement;
  if (!scopeSelect) return;

  // Clear existing options
  scopeSelect.innerHTML = '';

  // Add basic scopes
  const basicScopes = [
    { label: "Global", value: "global" },
    { label: "Turtle", value: "turtle" },
    { label: "Patch", value: "patch" },
    { label: "Link", value: "link" }
  ];

  basicScopes.forEach(({ label, value }) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    scopeSelect.appendChild(option);
  });

  // Add custom scopes (breeds)
  const customScopes = VariableRegistry.getCustomScopes();
  customScopes.forEach(scope => {
    const option = document.createElement('option');
    option.value = scope;
    option.textContent = capitalizeFirstLetter(scope);
    scopeSelect.appendChild(option);
  });
}

// Helper to capitalize first letter (optional, makes breed names like "Wolves" look nicer)
export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
