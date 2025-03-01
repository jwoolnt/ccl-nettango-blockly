import { WorkspaceSvg, serialization, Events } from 'blockly/core';


const storageKey = 'nettango-workspace';


export function save(workspace: WorkspaceSvg) {
  const data = serialization.workspaces.save(workspace);
  window.localStorage?.setItem(storageKey, JSON.stringify(data));
}

export function load(workspace: WorkspaceSvg) {
  const data = window.localStorage?.getItem(storageKey);
  if (!data) return;

  // Don't emit events during loading.
  Events.disable();
  serialization.workspaces.load(JSON.parse(data), workspace, { recordUndo: false });
  Events.enable();
};
