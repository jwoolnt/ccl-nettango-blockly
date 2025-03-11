import * as Blockly from 'blockly';
import netlogoGenerator from './tools/generator';
import { save, load } from './tools/serializer';
import observer_blocks from './blocks/observer';
import agent_blocks from './blocks/agents';
import control_blocks from './blocks/control';
import operator_blocks from './blocks/operators';
import looks_blocks from './blocks/looks';
import toolbox from './blocks/toolbox';


Blockly.common.defineBlocks({
  ...observer_blocks,
  ...agent_blocks,
  ...control_blocks,
  ...operator_blocks,
  ...looks_blocks,
});


const codeDiv = document.getElementById('generatedCode')?.firstChild;
const blocklyDiv = document.getElementById('blocklyDiv');
if (blocklyDiv && codeDiv) {
  const ws = Blockly.inject(blocklyDiv, {
    renderer: 'thrasos',
    toolbox
  });


  const generateCode = () => {
    const code = netlogoGenerator.workspaceToCode(ws);
    codeDiv.textContent = code;
  };

  load(ws);
  generateCode();


  ws.addChangeListener((e) => {
    if (e.isUiEvent) return;
    save(ws);
  });

  ws.addChangeListener((e) => {
    if (
      e.isUiEvent ||
      e.type == Blockly.Events.FINISHED_LOADING ||
      ws.isDragging()
    ) {
      return;
    }
    generateCode();
  });
} else {
  console.error("Unable to load find codeDiv or blocklyDiv.")
}
