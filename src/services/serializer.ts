import { Workspace, serialization, Events } from "blockly";
import { CONTEXT_SERIALIZER } from "../data/context";


const STORAGE_KEY = "nettango-workspace";


serialization.registry.register("nettango-context", CONTEXT_SERIALIZER);


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
    reset(workspace);
  }
  Events.enable();
};

export function reset(workspace: Workspace) {
  workspace.clear();
  CONTEXT_SERIALIZER.clear(workspace);
  localStorage.removeItem(STORAGE_KEY);
}
