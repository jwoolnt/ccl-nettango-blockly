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

  // Retrieve all variables across all scopes
  getAllVariables(): NetLogoVariable[] {
    return [...scopedVars];
  },

  // Retrieve all unique scopes that have variables
  getScopes(): string[] {
    return Array.from(new Set(scopedVars.map(v => v.scope)));
  },

  // Retrieve all breed-like scopes (i.e., not global)
  getBreedScopes(): string[] {
    return Array.from(new Set(
      scopedVars
        .map(v => v.scope)
        .filter(scope => scope !== "global")
    ));
  }
  
};