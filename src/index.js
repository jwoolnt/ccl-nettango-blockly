import * as Blockly from 'blockly';
import observer_blocks from './blocks/observer';
import agent_blocks from './blocks/agents';
import control_blocks from './blocks/control';
import operator_blocks from './blocks/operators';
import looks_blocks from './blocks/looks';
import data_blocks from './blocks/data';
import { netlogoGenerator } from './generators/netlogo';
import { save, load } from './serialization';
import { toolbox } from './blocks/toolbox';
import { addBreed, resetBreeds } from './blocks/define';
import './index.css';
import data from './blocks/data';

// Register the blocks and generator with Blockly
Blockly.common.defineBlocks({
  ...observer_blocks,
  ...agent_blocks,
  ...control_blocks,
  ...operator_blocks,
  ...looks_blocks,
  ...data_blocks,
});

// Set up UI elements and inject Blockly
const codeDiv = document.getElementById('generatedCode').firstChild;
const blocklyDiv = document.getElementById('blocklyDiv');
const ws = Blockly.inject(blocklyDiv, {
  renderer: 'thrasos',
  toolbox
});

// This function resets the code and output divs, and shows the
// generated code from the workspace.
const generateCode = () => {
  const code = netlogoGenerator.workspaceToCode(ws);
  codeDiv.innerText = code;
};

// Load the initial state from storage and run the code.
try {
  load(ws);
} catch (e) {
  alert("Error loading workspace");
  localStorage.clear();
  load(ws);
} finally {
  generateCode();
}

// Every time the workspace changes state, save the changes to storage.
ws.addChangeListener((e) => {
  // UI events are things like scrolling, zooming, etc.
  // No need to save after one of these.
  if (e.isUiEvent) return;
  save(ws);
});

// Whenever the workspace changes meaningfully, generate the code again.
ws.addChangeListener((e) => {
  // Don't run the code when the workspace finishes loading; we're
  // already running it once when the application starts.
  // Don't run the code during drags; we might have invalid state.
  if (
    e.isUiEvent ||
    e.type == Blockly.Events.FINISHED_LOADING ||
    ws.isDragging()
  ) {
    return;
  }
  generateCode();
});

document.addEventListener("keydown", e => {
  if (e.ctrlKey && e.altKey && !e.repeat) {
    if (e.key == "b") {
      let type = prompt("what is the breed type? (turtle, undirected-link/ulink, directed-link/dlink)");
      if (type == null) return;
      let plural = prompt("what is the breeds plural name?");
      if (plural == null) return;
      let singular = prompt("what is the breeds singular name?");
      if (singular == null) return;
      addBreed(type, [plural, singular]);
    } else if (e.key == "d") {
      resetBreeds();
    }
  }
});
