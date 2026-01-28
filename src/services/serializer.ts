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

/**
 * Converts a Blockly workspace to a JSON string for file export.
 * 
 * WRITES AS: WorkspaceFileData JSON object containing:
 *   - version: semantic version string ("1.0.0")
 *   - timestamp: Unix timestamp of when the file was created
 *   - workspace: Blockly serialized workspace data (blocks, variables, connections)
 *   - context: Custom NetTango context data (additional metadata)
 * 
 * PROCESS:
 * 1. Serializes the current workspace using Blockly's serialization API
 * 2. Wraps it in WorkspaceFileData object with metadata (version, timestamp)
 * 3. Saves custom context data alongside workspace data
 * 4. Returns formatted JSON string (2-space indentation for readability)
 * 
 * RETURNS: JSON string representation of the entire workspace that can be:
 *   - Downloaded to a file
 *   - Sent over network
 *   - Stored in database
 */
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

/**
 * Loads a workspace from a JSON file string and reconstructs the workspace.
 * 
 * READS: JSON string containing WorkspaceFileData with structure:
 *   - workspace: Blockly serialized data (blocks, connections, variables)
 *   - context: Optional custom NetTango context data
 *   - version: File format version
 *   - timestamp: When file was created
 * 
 * PROCESS:
 * 1. Disables Blockly events to prevent listener callbacks during loading
 * 2. Parses JSON string to validate it's a proper WorkspaceFileData object
 * 3. Validates that workspace data exists (throws if missing)
 * 4. Clears the current workspace completely
 * 5. Reconstructs blocks and structure from deserialized data
 * 6. Loads custom context if present in file
 * 7. Auto-saves to localStorage for recovery
 * 8. Re-enables events and handles errors
 * 
 * SIDE EFFECTS:
 *   - Clears current workspace
 *   - Updates localStorage for auto-recovery
 *   - Disables/enables Blockly events
 * 
 * THROWS: Error if JSON is invalid or workspace data is missing
 */
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

/**
 * Downloads the workspace as a .ntango file to the user's device.
 * 
 * WRITES AS: .ntango file (JSON format) with content from saveToFile():
 *   - Filename: User-specified or defaults to 'workspace.ntango'
 *   - Content-Type: application/json
 *   - Format: Pretty-printed JSON with workspace and context data
 * 
 * PROCESS:
 * 1. Converts workspace to JSON using saveToFile()
 * 2. Creates a Blob object from the JSON string
 * 3. Generates a download URL using createObjectURL
 * 4. Creates temporary <a> element to trigger browser download
 * 5. Appends .ntango extension if not already present
 * 6. Cleans up resources (removes element, revokes URL)
 * 
 * BROWSER BEHAVIOR:
 *   - Opens native 'Save File' dialog
 *   - Saves to Downloads folder (user can change location)
 *   - Non-blocking operation
 */
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

/**
 * Opens file picker dialog and loads a .ntango or .json file into the workspace.
 * 
 * READS: File selected from file picker dialog:
 *   - Accepted formats: .nettango or .json files
 *   - Content: JSON string containing WorkspaceFileData
 *   - Reads file as text using File.text() API
 * 
 * PROCESS:
 * 1. Creates hidden <input type="file"> element
 * 2. Sets accept filter to .nettango and .json files only
 * 3. Programmatically clicks input to show file picker dialog
 * 4. Waits for user to select a file
 * 5. Reads file content as text asynchronously
 * 6. Passes text to loadFromFile() to reconstruct workspace
 * 7. Returns the selected filename via Promise
 * 8. Rejects Promise if user cancels or file reading fails
 * 
 * RETURNS: Promise<string> - resolves with filename of loaded workspace
 * 
 * ERRORS: 
 *   - Rejects if user cancels file selection
 *   - Rejects if file format is invalid (delegated to loadFromFile)
 *   - Rejects if file reading fails
 */
export function uploadWorkspace(workspace: Workspace): Promise<string> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.ntango,.nettango,.json';
    
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