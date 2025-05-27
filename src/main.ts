import * as Blockly from "blockly";
import toolbox from "./blocks/toolbox";
import activeBlocks from "./blocks";
import { save, load } from "./services/serializer";
import netlogoGenerator, { generateCodePrefix } from "./services/generator";
//@ts-expect-error
import { LexicalVariablesPlugin } from '@mit-app-inventor/blockly-block-lexical-variables';
import { refreshMITPlugin } from "./data/context";
import { initSidebar } from "./sidebar";
import { updateWorkspaceForDomain } from "./blocks/domain";

Blockly.common.defineBlocks({ ...activeBlocks });

const blockEditor = document.getElementsByClassName("block-editor")[0];
const codeOutput = document.getElementsByClassName("generated-code")[0];

const customTheme = Blockly.Theme.defineTheme('customTheme', {
  name: 'customTheme',
  blockStyles: {
    number_blocks: {
      colourPrimary: '#c72216',
      hat: ''
    },
    procedure_blocks: {
      colourPrimary: '#673AB7' // purple for procedures
    },
    list_blocks: {
      colourPrimary: "#009688",
    },
    variable_blocks: {
      colourPrimary: '#9C27B0' // gold for variables
    }
  },
  fontStyle: {
    family: 'Fira Code',
    weight: 'normal',
    size: 12
  },
  startHats: false
});

if (blockEditor && codeOutput) {
  const ws = Blockly.inject(blockEditor, {
    renderer: 'thrasos',
    toolbox,
    theme: customTheme,
    zoom: {
      controls: true
    },
    move: {
      scrollbars: false,
      drag: true,
      wheel: true
    },
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

  // Initialize workspace selector
  initWorkspaceSelector(ws, displayCode);

  ws.addChangeListener((e) => {
    if (e.isUiEvent || e.type == Blockly.Events.FINISHED_LOADING || ws.isDragging()) {
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

// Initialize workspace selector
function initWorkspaceSelector(workspace: Blockly.WorkspaceSvg, displayCodeCallback: () => void) {
  const workspaceSelector = document.getElementById('workspace-selector') as HTMLSelectElement;

  if (!workspaceSelector) {
    console.error("Workspace selector not found");
    return;
  }

  // Handle workspace selection changes
  workspaceSelector.addEventListener('change', (event) => {
    const selectedValue = (event.target as HTMLSelectElement).value;
    console.log(`Switching to workspace: ${selectedValue}`);

    // Update the workspace with domain-specific blocks
    updateWorkspaceForDomain(workspace, selectedValue, displayCodeCallback);
  });

  // Set initial state to default
  updateWorkspaceForDomain(workspace, 'default', displayCodeCallback);
}
