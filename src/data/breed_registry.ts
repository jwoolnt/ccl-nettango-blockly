// src/data/breed_registry_integration.ts
import { getBreeds, getTurtleBreeds, getLinkBreeds, addBreed, resetBreeds } from "./breeds";
import { VariableRegistry } from "../blocks/ui/variable_registry";

/**
 * Initializes the breed registry and syncs it with the variable registry
 */
export function initBreedRegistryIntegration() {
  // Sync existing breeds with variable registry
  syncBreedsWithVariableRegistry();
  
  // Original breed functions might be replaced to keep things in sync
  const originalAddBreed = addBreed;
  const originalResetBreeds = resetBreeds;
  
  // Replace the global addBreed function to keep variable registry in sync
  (globalThis as any).addBreedWithSync = function(type: string, breed: [string, string]) {
    // Call the original function
    originalAddBreed(type, breed);
    
    // Add the breed to variable registry scopes
    const [plural] = breed;
    VariableRegistry.addScope(plural);
    
    return breed;
  };
  
  // Replace the global resetBreeds function
  (globalThis as any).resetBreedsWithSync = function() {
    // Call the original function
    originalResetBreeds();
    
    // Reset custom scopes in variable registry
    VariableRegistry.resetCustomScopes();
    
    // Re-sync default breeds
    syncBreedsWithVariableRegistry();
  };
}

/**
 * Syncs all existing breeds with the variable registry
 */
function syncBreedsWithVariableRegistry() {
  
  // Add all custom turtle breeds
  const turtleBreeds = getTurtleBreeds();
  for (const [plural] of turtleBreeds) {
    if (plural !== "turtles") { // Skip default breed
      VariableRegistry.addScope(plural);
    }
  }
  
  // Add all custom link breeds
  const linkBreeds = getLinkBreeds();
  for (const [plural] of linkBreeds) {
    if (plural !== "links") { // Skip default breed
      VariableRegistry.addScope(plural);
    }
  }
}