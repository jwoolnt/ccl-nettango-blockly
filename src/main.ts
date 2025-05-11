import * as Blockly from "blockly";
import toolbox from "./blocks/toolbox";
import activeBlocks from "./blocks";
import { save, load, reset } from "./services/serializer";
import netlogoGenerator, { generateCodePrefix } from "./services/generator";

//@ts-expect-error
import { LexicalVariablesPlugin } from '@mit-app-inventor/blockly-block-lexical-variables';
import { addBreed, addVariable, BreedType, refreshMITPlugin, removeBreed, removeVariable, updateVariable } from "./data/context";
import { initSidebar } from "./sidebar";

Blockly.common.defineBlocks({ ...activeBlocks });

const blockEditor = document.getElementsByClassName("block-editor")[0];
const codeOutput = document.getElementsByClassName("generated-code")[0];

if (blockEditor && codeOutput) {
  const ws = Blockly.inject(blockEditor, {
    renderer: 'thrasos',
    toolbox,
	zoom: { controls: true },
	move: { scrollbars: false, drag: true, wheel: true },
  });
  
  LexicalVariablesPlugin.init(ws);
  Blockly.Msg.LANG_VARIABLES_GLOBAL_PREFIX = "";
  
  const displayCode = () => {
    refreshMITPlugin();
    codeOutput.textContent = generateCodePrefix() + netlogoGenerator.workspaceToCode(ws);
    save(ws);
  };
  
  load(ws);
  displayCode();
  
  // Initialize the sidebar with workspace and display callback
  initSidebar(ws, displayCode);
  
  ws.addChangeListener((e) => {
    if (e.isUiEvent ||
        e.type == Blockly.Events.FINISHED_LOADING ||
        ws.isDragging()) {
      return;
    }
    displayCode();
  });
  
  ws.addChangeListener((e) => {
    if (e.isUiEvent) return;
    save(ws);
  });
} else {
  if (!blockEditor) {
    console.error("Setup: cannot find blockEditor");
  } else if (!codeOutput) {
    console.error("Setup: cannot find codeOutput");
  }
}