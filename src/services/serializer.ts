// services/serializer.ts
import { Workspace, serialization, Events } from "blockly";
import { CONTEXT_SERIALIZER } from "../data/context";


const STORAGE_KEY = "nettango-workspace";


serialization.registry.register("nettango-context", CONTEXT_SERIALIZER);

export interface WorkspaceFileData {
  version: string;
  timestamp: number;
  workspace: any; // Blockly serialization data
  context?: any; // custom context data
}

export function save(workspace: Workspace) {
  let data = serialization.workspaces.save(workspace);
  window.localStorage?.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function load(workspace: Workspace) {
  let data = window.localStorage?.getItem(STORAGE_KEY);
  if (!data) return;

  Events.disable();
  try {
    serialization.workspaces.load(JSON.parse(data), workspace, { recordUndo: false });
  }
  catch (e) {
    console.error(`Serialization: cannot load workspace (${e})`);
    // reset(workspace);
  }
  Events.enable();
};

export function reset(workspace: Workspace) {
  workspace.clear();
  CONTEXT_SERIALIZER.clear(workspace);
  localStorage.removeItem(STORAGE_KEY);
}

// New file-based save/load functions
export function saveToFile(workspace: Workspace): string {
  const workspaceData = serialization.workspaces.save(workspace);
  
  const fileData: WorkspaceFileData = {
    version: "1.0.0",
    timestamp: Date.now(),
    workspace: workspaceData,
    context: CONTEXT_SERIALIZER.save(workspace) // save custom context too
  };
  
  return JSON.stringify(fileData, null, 2);
}

export function loadFromFile(workspace: Workspace, jsonString: string): void {
  Events.disable();
  
  try {
    const fileData: WorkspaceFileData = JSON.parse(jsonString);
    
    // Validate file format
    if (!fileData.workspace) {
      throw new Error("Invalid workspace file: missing workspace data");
    }
    
    // Clear existing workspace
    workspace.clear();
    
    // Load workspace data
    serialization.workspaces.load(fileData.workspace, workspace, { recordUndo: false });
    
    // Load custom context if available
    if (fileData.context) {
      CONTEXT_SERIALIZER.load(fileData.context, workspace);
    }
    
    // Also save to localStorage for auto-recovery
    save(workspace);
    
  } catch (e) {
    console.error(`Failed to load workspace file: ${e}`);
    throw new Error(`Cannot load workspace file: ${e instanceof Error ? e.message : 'Unknown error'}`);
  } finally {
    Events.enable();
  }
}

export function downloadWorkspace(workspace: Workspace, filename: string = 'workspace.ntango'): void {
  const json = saveToFile(workspace);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.ntango') ? filename : `${filename}.ntango`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  URL.revokeObjectURL(url);
}

export function uploadWorkspace(workspace: Workspace): Promise<string> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.nettango,.json';
    
    input.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) {
        reject(new Error('No file selected'));
        return;
      }
      
      try {
        const text = await file.text();
        loadFromFile(workspace, text);
        resolve(file.name);
      } catch (error) {
        reject(error);
      }
    };
    
    input.click();
  });
}