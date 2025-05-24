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
  'frog-pond': {
    name: "Frog Pond",
    blocks: [
        createStatementBlock('frog_eat', {
          message0: 'eat %1',
          args0: [
            {
              type: 'input_value',
              name: 'FOOD',
              check: 'String'
            }
          ],     
            colour: 120,
            tooltip: 'Make the frog eat food',
            helpUrl: '',
            for: (block, generator) => {
              const food = generator.valueToCode(block, 'FOOD', Order.ATOMIC) || '""';
              return `eat ${food}`;
            }
        }),
    ]
  },
};

// Track currently registered domain blocks
let currentDomainBlocks: Set<string> = new Set();

// Function to register domain-specific blocks
function registerDomainBlocks(domainBlocks: BlockDefinition[]) {
  const blockDefinitions: { [key: string]: any } = {};
  
  domainBlocks.forEach(blockDef => {
    if (typeof blockDef !== 'function') {
      blockDefinitions[blockDef.type] = blockDef;
      currentDomainBlocks.add(blockDef.type);
    }
  });
  
  if (Object.keys(blockDefinitions).length > 0) {
    Blockly.common.defineBlocks(blockDefinitions);
  }
}

// Function to unregister domain-specific blocks
function unregisterDomainBlocks() {
  currentDomainBlocks.forEach(blockType => {
    // Remove from Blockly.Blocks registry
    if (Blockly.Blocks[blockType]) {
      delete Blockly.Blocks[blockType];
    }
    
    // Remove from the internal registry if it exists
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

// Create domain-specific toolbox category
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

// Get appropriate color for domain category
function getColorForDomain(domainKey: string): string {
  const colorMap: { [key: string]: string } = {
    'frog-pond': '120',
    'ants': '60', 
    'wolf-sheep': '30',
    'abstract-painting': '300'
  };
  
  return colorMap[domainKey] || '160';
}

// Check if blocks are already registered
function areBlocksRegistered(blockTypes: string[]): boolean {
  return blockTypes.some(blockType => 
    Blockly.Blocks[blockType] !== undefined
  );
}

// update workspace for selected domain
export function updateWorkspaceForDomain(
  workspace: Blockly.WorkspaceSvg, 
  selectedDomain: string, 
  displayCodeCallback: () => void
) {
  console.log(`Updating workspace for domain: ${selectedDomain}`);
  
  // Always unregister previous domain blocks first
  unregisterDomainBlocks();
  
  // If not default, register new domain blocks
  if (selectedDomain !== 'default' && selectedDomain.toLowerCase() !== 'default') {
    // Map the HTML option values to domain keys
    const domainKey = getDomainKey(selectedDomain);
    
    if (domainKey && DOMAIN_BLOCKS[domainKey]) {
      const domainBlocks = DOMAIN_BLOCKS[domainKey].blocks;
      const blockTypes = domainBlocks
        .filter(block => typeof block !== 'function')
        .map(block => block.type);
      
      // Only register if blocks aren't already registered
      if (!areBlocksRegistered(blockTypes)) {
        registerDomainBlocks(domainBlocks);
      } else {
        console.warn('Some domain blocks are already registered, skipping registration');
      }
      
      // Update toolbox to include domain-specific category
      updateToolboxWithDomain(workspace, domainKey);
    }
  } else {
    updateToolboxWithDomain(workspace, null);
  }
  
  // Refresh the workspace
  workspace.refreshToolboxSelection();
  displayCodeCallback();
}

// Map HTML select option values to internal domain keys
function getDomainKey(selectedValue: string): string | null {
  const mapping: { [key: string]: string } = {
    'Frog Pond': 'frog-pond',
    'Ants': 'ants',
    'Wolf-Sheep': 'wolf-sheep', 
    'Abstract Painting': 'abstract-painting'
  };
  
  return mapping[selectedValue] || null;
}

// Update the toolbox to include domain-specific blocks
function updateToolboxWithDomain(workspace: Blockly.WorkspaceSvg, domainKey: string | null) {
  // Clone the original toolbox
  const originalToolbox = JSON.parse(JSON.stringify(toolbox));
  
  if (domainKey && DOMAIN_BLOCKS[domainKey]) {
    // Add domain-specific category at the top
    const domainCategory = createDomainToolboxCategory(domainKey);
    if (domainCategory && originalToolbox.contents) {
      originalToolbox.contents.unshift(domainCategory);
    }
  }
  
  // Update the workspace toolbox
  workspace.updateToolbox(originalToolbox);
}