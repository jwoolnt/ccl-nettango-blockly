import { WorkspaceSvg, serialization, Events } from "blockly";
import { BREED_SERIALIZER } from "../data/breeds";
import { GLOBAL_SERIALIZER } from "../data/globals";


const storageKey = "nettango-workspace";


serialization.registry.register("nettango-breeds", BREED_SERIALIZER);
serialization.registry.register("nettango-globals", GLOBAL_SERIALIZER);


export function save(workspace: WorkspaceSvg) {
  const data = serialization.workspaces.save(workspace);
  window.localStorage?.setItem(storageKey, JSON.stringify(data));
}

export function load(workspace: WorkspaceSvg, loadCheck: () => any) {
  const data = window.localStorage?.getItem(storageKey);
  if (!data) return;

  Events.disable();
  try {
    serialization.workspaces.load(JSON.parse(data), workspace, { recordUndo: false });
    loadCheck();
  }
  catch (e) {
    console.error(`Serialization: cannot load workspace (${e})`);
    reset(workspace);
  }
  Events.enable();
};

export function reset(workspace: WorkspaceSvg) {
  localStorage.removeItem(storageKey);

  workspace.clear();
  BREED_SERIALIZER.clear(workspace);
  GLOBAL_SERIALIZER.clear(workspace);

  save(workspace);
}
