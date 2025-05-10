import { WorkspaceSvg, serialization, Events } from "blockly";
import { BREED_SERIALIZER } from "../data/breeds";
import { VARIABLE_SERIALIZER } from "../data/variables";


const storageKey = "nettango-workspace";


serialization.registry.register("nettango-breeds", BREED_SERIALIZER);
serialization.registry.register("nettango-variables", VARIABLE_SERIALIZER);


export function save(workspace: WorkspaceSvg) {
  const data = serialization.workspaces.save(workspace);
  window.localStorage?.setItem(storageKey, JSON.stringify(data));
}

export function load(workspace: WorkspaceSvg, loadCheck?: () => unknown) {
  const data = window.localStorage?.getItem(storageKey);
  if (!data) return;

  Events.disable();
  try {
    serialization.workspaces.load(JSON.parse(data), workspace, { recordUndo: false });
    if (loadCheck) {
      loadCheck();
    }
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
  VARIABLE_SERIALIZER.clear(workspace);

  save(workspace);
}
