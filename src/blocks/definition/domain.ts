// domain.ts - Handles domain-specific workspace selection
import * as Blockly from "blockly";
import { BlockDefinition, ValueType } from "./types";
import { createStatementBlock, createValueBlock, Order } from "./utilities";
import toolbox from "../toolbox";

// Define domain-specific block configurations
interface DomainBlocks {
  name: string;
  blocks: BlockDefinition[];
}

// Domain-specific block definitions
export const DOMAIN_BLOCKS: { [key: string]: DomainBlocks } = {
  'ants': {
    name: "Ants",
    blocks: [
      {
        type: 'ant_move',
        message0: 'move %1',
        args0: [
          {
            type: 'input_value',
            name: 'DIRECTION',
            check: 'String'
          }
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 60,
        tooltip: 'Make the ant move in a direction',
        helpUrl: '',
        for: (block, generator) => {
          const direction = generator.valueToCode(block, 'DIRECTION', Order.ATOMIC) || '';
          return `move ${direction}`;
        }
      }
    ]
  },
  'frog-pond': {
    name: "Frog Pond",
    blocks: [
      {
        type: 'frog_jump',
        message0: 'hop %1',
        args0: [
          {
            type: 'input_value',
            name: 'DISTANCE',
            check: 'Number'
          }
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 120,
        tooltip: 'Make the frog jump a certain distance',
        helpUrl: '',
        for: (block, generator) => {
          const distance = generator.valueToCode(block, 'DISTANCE', Order.ATOMIC) || '0';
          return `hop ${distance}`;
        }
      },
      {
        // chirp
        type: 'frog_chirp',
        message0: 'chirp %1',
        args0: [
          {
            type: 'input_value',
            name: 'VOLUME',
            check: 'Number'
          }
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 120,
        tooltip: 'Make the frog chirp at a certain volume',
        helpUrl: '',
        for: (block, generator) => {
          const volume = generator.valueToCode(block, 'VOLUME', Order.ATOMIC) || '0';
          return `chirp ${volume}`;
        }
      }
    ]
  },
  'wolf-sheep': {
    name: "Wolf-Sheep",
    blocks: [
      {
        type: 'wolf_hunt',
        message0: 'hunt %1',
        args0: [
          {
            type: 'input_value',
            name: 'TARGET',
            check: 'String'
          }
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 30,
        tooltip: 'Make the wolf hunt a target',
        helpUrl: '',
        for: (block, generator) => {
          const target = generator.valueToCode(block, 'TARGET', Order.ATOMIC) || '';
          return `hunt ${target}`;
        }
      }
    ]
  },
};

let currentDomainBlocks: Set<string> = new Set();

function registerDomainBlocks(domainBlocks: BlockDefinition[]) {
  // filter out function blocks and get only object definitions
  const blockDefObjects = domainBlocks.filter(blockDef => typeof blockDef !== 'function');
  
  if (blockDefObjects.length > 0) {
    const blockDefinitions = Blockly.common.createBlockDefinitionsFromJsonArray(blockDefObjects);
    
    // register block
    Object.keys(blockDefinitions).forEach(blockType => {
      if (!Blockly.Blocks[blockType]) {
        Blockly.Blocks[blockType] = blockDefinitions[blockType];
        currentDomainBlocks.add(blockType);
        console.log(`Successfully registered block: ${blockType}`);
      }
    });
  }
}

function unregisterDomainBlocks() {
  currentDomainBlocks.forEach(blockType => {
    if (Blockly.Blocks[blockType]) {
      delete Blockly.Blocks[blockType];
    }
    
    try {
      if (Blockly.registry.hasItem('block', blockType)) {
        Blockly.registry.unregister('block', blockType);
      }
    } catch (e) {
      console.warn(`Could not unregister block ${blockType}:`, e);
    }
  });
  currentDomainBlocks.clear();
}

function createDomainToolboxCategory(domainKey: string): any {
  if (!DOMAIN_BLOCKS[domainKey]) {
    return null;
  }

  const domainBlocks = DOMAIN_BLOCKS[domainKey];
  const categoryBlocks = domainBlocks.blocks
    .filter(block => typeof block !== 'function')
    .map(block => ({ kind: 'block', type: block.type }));

  return {
    kind: 'category',
    name: domainBlocks.name,
    colour: getColorForDomain(domainKey),
    contents: categoryBlocks
  };
}

function getColorForDomain(domainKey: string): string {
  const colorMap: { [key: string]: string } = {
    'frog-pond': '120',
    'ants': '60',
    'wolf-sheep': '30',
  };
  
  return colorMap[domainKey] || '160';
}

export function updateWorkspaceForDomain(
  workspace: Blockly.WorkspaceSvg, 
  selectedDomain: string, 
  displayCodeCallback: () => void
) {
  console.log(`Updating workspace for domain: ${selectedDomain}`);
  
  unregisterDomainBlocks();
  
  if (selectedDomain !== 'default' && selectedDomain.toLowerCase() !== 'default') {
    const domainKey = getDomainKey(selectedDomain);
    console.log(`Mapped domain key: ${domainKey}`);
    
    if (domainKey && DOMAIN_BLOCKS[domainKey]) {
      console.log(`Found domain blocks for: ${domainKey}`);
      const domainBlocks = DOMAIN_BLOCKS[domainKey].blocks;
      registerDomainBlocks(domainBlocks);
      console.log(`Registered domain blocks`);

      updateToolboxWithDomain(workspace, domainKey);
      console.log(`Updated toolbox with domain: ${domainKey}`);
    } else {
      console.log(`No domain blocks found for key: ${domainKey}`);
    }
  } else {
    console.log(`Using default workspace`);
    updateToolboxWithDomain(workspace, null);
  }
  
  workspace.refreshToolboxSelection();
  displayCodeCallback();
}

function getDomainKey(selectedValue: string): string | null {
  const mapping: { [key: string]: string } = {
    'Frog Pond': 'frog-pond',
    'Ants': 'ants',
    'Wolf-Sheep': 'wolf-sheep', 
  };
  
  return mapping[selectedValue] || null;
}

function updateToolboxWithDomain(workspace: Blockly.WorkspaceSvg, domainKey: string | null) {
  const originalToolbox = JSON.parse(JSON.stringify(toolbox));
  
  if (domainKey && DOMAIN_BLOCKS[domainKey]) {
    const domainCategory = createDomainToolboxCategory(domainKey);
    if (domainCategory && originalToolbox.contents) {
      originalToolbox.contents.unshift(domainCategory);
    }
  }
  
  workspace.updateToolbox(originalToolbox);
}
