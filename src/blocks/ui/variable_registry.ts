export type NetLogoScope = "global" | "turtle" | "patch" | "link" | string;

export interface NetLogoVariable {
  name: string;
  scope: NetLogoScope;
}

let scopedVars: NetLogoVariable[] = [];
let customScopes: string[] = []; // Stores custom (breed) scopes

// Helper to dispatch a scope change event
function dispatchScopeChange() {
  const event = new CustomEvent('variableScopesChanged');
  window.dispatchEvent(event);
}

export const VariableRegistry = {  
  // Register a new variable with scope
  registerVariable(name: string, scope: NetLogoScope) {
    if (!scopedVars.find(v => v.name === name && v.scope === scope)) {
      scopedVars.push({ name, scope });
    }
  },

  // Add a new custom scope (breed)
  addScope(scope: string) {
    if (!customScopes.includes(scope)) {
      customScopes.push(scope);
      dispatchScopeChange();
    }
  },

  // Get all custom scopes
  getCustomScopes(): string[] {
    return [...customScopes];
  },

  // Reset custom scopes
  resetCustomScopes(): void {
    customScopes = [];
    dispatchScopeChange();
  },

  // Get all scopes (built-in + custom)
  getAllScopes(): string[] {
    return ["global", "turtle", "patch", "link", ...customScopes];
  },

  // Retrieve variables by scope
  getVariablesByScope(scope: NetLogoScope): NetLogoVariable[] {
    return scopedVars.filter(v => v.scope.toString() === scope.toString());
  },
  
  // Retrieve all variables
  // getAllVariables(scope?: NetLogoScope): NetLogoVariable[] {
  //   if (!scope) return [...scopedVars];
  //   return scopedVars.filter(v => v.scope === scope);
  // },
  getAllVariables(scope?: NetLogoScope): NetLogoVariable[] {
    if (!scope) return scopedVars;
    return scopedVars.filter(v => v.scope.toString() === scope.toString());
  },

  // Retrieve all unique scopes that have variables
  getScopes(): NetLogoScope[] {
    return Array.from(new Set(scopedVars.map(v => v.scope)));
  },

  // Retrieve all breed-like scopes (non-global)
  getBreedScopes(): NetLogoScope[] {
    return Array.from(new Set(
      scopedVars.map(v => v.scope).filter(scope => scope !== "global")
    ));
  },

  // Rename an existing variable
  renameVariable(oldName: string, newName: string, scope?: NetLogoScope): void {
    scopedVars.forEach(v => {
      if (v.name === oldName && (!scope || v.scope === scope)) {
        v.name = newName;
      }
    });
  },

  // Delete a variable by name and optionally scope
  deleteVariable(name: string, scope?: NetLogoScope): void {
    scopedVars = scopedVars.filter(v => {
      if (scope) {
        return !(v.name === name && v.scope === scope);
      }
      return v.name !== name;
    });
  },

  // Clear all variables and custom scopes
  reset(): void {
    scopedVars = [];
    customScopes = [];
    dispatchScopeChange();
  }
};
