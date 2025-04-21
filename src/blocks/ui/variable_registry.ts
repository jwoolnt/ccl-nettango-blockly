export type NetLogoScope = "global" | "turtle" | "patch" | "link" | string;

export interface NetLogoVariable {
  name: string;
  scope: NetLogoScope;
}

let scopedVars: NetLogoVariable[] = [];

export const VariableRegistry = {
  // Register a new variable with scope
  registerVariable(name: string, scope: NetLogoScope) {
    if (!scopedVars.find(v => v.name === name && v.scope === scope)) {
      scopedVars.push({ name, scope });
    }
  },

  // Retrieve variables by scope
  getVariablesByScope(scope: NetLogoScope): NetLogoVariable[] {
    return scopedVars.filter(v => v.scope === scope);
  },

  // Retrieve all variables
  getAllVariables(): NetLogoVariable[] {
    return [...scopedVars];
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

  // Clear all variables
  reset(): void {
    scopedVars = [];
  }
};
