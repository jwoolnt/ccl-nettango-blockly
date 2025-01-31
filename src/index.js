/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly';
// import {blocks} from './blocks/text';
// import {forBlock} from './generators/javascript';
import {javascriptGenerator} from 'blockly/javascript';
import {blocks} from './blocks/json';
import {jsonGenerator} from './generators/json';

import {save, load} from './serialization';
import {toolbox} from './toolbox';
import './index.css';

// Register the blocks and generator with Blockly
Blockly.common.defineBlocks(blocks);
// Object.assign(javascriptGenerator.forBlock, forBlock);

// Set up UI elements and inject Blockly
const codeDiv = document.getElementById('generatedCode').firstChild;
// const outputDiv = document.getElementById('output');
const blocklyDiv = document.getElementById('blocklyDiv');
// const ws = Blockly.inject(blocklyDiv, {toolbox});
const ws = Blockly.inject(blocklyDiv, {
  toolbox,
  toolboxPosition: 'start', // Keeps toolbox on the left
  trashcan: true, 
  scrollbars: true, 
  grid: { spacing: 20, length: 3, colour: '#ccc', snap: true }, 
  zoom: {
    controls: true,
    wheel: true,
    startScale: 1.0,
    maxScale: 2.0,
    minScale: 0.5,
    scaleSpeed: 1.2,
  },
});

// This function resets the code div and shows the
// generated code from the workspace.
const runCode = () => {
  const code = jsonGenerator.workspaceToCode(ws);
  codeDiv.innerText = code;
};

// Load the initial state from storage and run the code.
load(ws);
runCode();

// Every time the workspace changes state, save the changes to storage.
ws.addChangeListener((e) => {
  // UI events are things like scrolling, zooming, etc.
  // No need to save after one of these.
  if (e.isUiEvent) return;
  save(ws);
});

// Whenever the workspace changes meaningfully, run the code again.
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
  runCode();
});
