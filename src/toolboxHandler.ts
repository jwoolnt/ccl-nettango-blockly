// toolboxHandler.ts - Connects custom UI with Blockly toolbox
import * as Blockly from "blockly";

/**
 * This class manages interactions between the custom sidebar UI and Blockly's toolbox
 */
export class ToolboxHandler {
  private workspace: Blockly.WorkspaceSvg;
  private blockTypeMap: Map<string, string[]>;
  private categoryMap: Map<string, string[]>;

  constructor(workspace: Blockly.WorkspaceSvg) {
    this.workspace = workspace;
    this.blockTypeMap = new Map();
    this.categoryMap = new Map();
    this.initializeMappings();
  }

  /**
   * Set up mappings between sidebar items and Blockly blocks/categories
   */
  private initializeMappings() {
    // Map sidebar categories to Blockly toolbox categories
    this.categoryMap.set('Variables', ['Variables']);
    this.categoryMap.set('Control Flow', ['Control Flow']);
    this.categoryMap.set('Math', ['Math']);
    this.categoryMap.set('Logic', ['Logic']);
    this.categoryMap.set('Observer', ['Observer']);
    this.categoryMap.set('Turtles', ['Turtles']);
    this.categoryMap.set('Patches', ['Patches']);
    this.categoryMap.set('Lists', ['Lists']);
    this.categoryMap.set('Strings', ['Strings']);
    
    // Map sidebar items to specific block types
    this.blockTypeMap.set('Conditionals', ['if_', 'ifelse']);
    this.blockTypeMap.set('Loops', ['ask_agent_set']);
    this.blockTypeMap.set('Procedures', ['procedures_defnoreturn', 'procedures_callnoreturn']);
    this.blockTypeMap.set('Numbers', ['number', 'random']);
    this.blockTypeMap.set('Operations', ['addition', 'subtraction', 'multiplication', 'division']);
    this.blockTypeMap.set('Variables', ['lexical_variable_get', 'lexical_variable_set']);
    this.blockTypeMap.set('Lists', ['lists_create_with', 'lists_length']);
  }

  /**
   * Show a specific category in the Blockly toolbox
   */
  showCategory(categoryName: string): void {
    const toolbox = this.workspace.getToolbox();
    if (!toolbox) return;
    
    // Get corresponding Blockly category names
    const blocklyCategories = this.categoryMap.get(categoryName);
    if (!blocklyCategories || blocklyCategories.length === 0) return;
    
    // Find the category by name
    const categories = (toolbox as Blockly.Toolbox).getToolboxItems();
    const category = categories.find(item => 
      item.getId && item.getId() === blocklyCategories[0]
    );
    
    if (category) {
      const selectedItem = categories.find(item => item.getId && item.getId() === blocklyCategories[0]);
      if (selectedItem) {
        (toolbox as Blockly.Toolbox).setSelectedItem(selectedItem);
      }
    }
  }

  /**
   * Add a specific block to the workspace based on sidebar item
   */
  addBlockFromSidebarItem(itemName: string): void {
    const blockTypes = this.blockTypeMap.get(itemName);
    if (!blockTypes || blockTypes.length === 0) return;
    
    // Create the first block type in the array
    this.createBlockInWorkspace(blockTypes[0]);
  }

  /**
   * Create a block in the workspace and position it appropriately
   */
  createBlockInWorkspace(blockType: string): void {
    try {
      // Create a new block
      const block = this.workspace.newBlock(blockType);
      
      // Position it in the center of the visible workspace
      const metrics = this.workspace.getMetrics();
      if (metrics) {
        const x = metrics.viewWidth / 2 + metrics.viewLeft;
        const y = metrics.viewHeight / 2 + metrics.viewTop;
        block.moveBy(x, y);
      }
      
      block.initSvg();
      block.render();
      
      // Highlight the newly created block
      block.select();
    } catch (e) {
      console.error(`Error creating block of type ${blockType}:`, e);
    }
  }
  
  /**
   * Filter the toolbox to show only blocks of a certain color/category
   * This can be used to implement a color-based filtering system
   */
  filterToolboxByColor(colorCategory: string): void {
    // Map color categories to their respective block categories
    const colorCategoryMap = {
      'color-variables': ['Variables'],
      // 'color-control': ['Control Flow'],
      // 'color-math': ['Math'],
      // 'color-logic': ['Logic'],
      // 'color-agents': ['Observer'],
      // 'color-turtles': ['Turtles'],
      // 'color-patches': ['Patches'],
      // 'color-lists': ['Lists'],
      // 'color-strings': ['Strings']
    };
    
    const categories = colorCategoryMap[colorCategory as keyof typeof colorCategoryMap];
    if (categories && categories.length > 0) {
      this.showCategory(categories[0]);
    }
  }
  
  /**
   * Refresh the toolbox after making changes to blocks or categories
   */
  refreshToolbox(): void {
    this.workspace.refreshToolboxSelection();
  }
}

/**
 * Connect custom sidebar UI with Blockly
 */
export function initializeSidebarControls(workspace: Blockly.WorkspaceSvg): ToolboxHandler {
  const handler = new ToolboxHandler(workspace);
  
  // Set up sidebar category click events
  const sidebarCategories = document.querySelectorAll('.sidebar-category');
  sidebarCategories.forEach(category => {
    const titleElement = category.querySelector('span');
    if (!titleElement) return;
    
    const categoryName = titleElement.textContent?.trim();
    if (!categoryName) return;
    
    category.addEventListener('click', () => {
      // Toggle active class
      sidebarCategories.forEach(c => c.classList.remove('active'));
      category.classList.add('active');
      
      // Show blocks for this category
      handler.showCategory(categoryName);
    });
  });
  
  // Set up sidebar item click events (excluding special items)
  const sidebarItems = document.querySelectorAll('.sidebar-item:not(#edit-variables):not(#edit-breeds)');
  sidebarItems.forEach(item => {
    const itemText = item.textContent?.trim();
    if (!itemText) return;
    
    // Extract the item name (remove the first character which is usually an icon)
    const itemName = itemText.substring(1).trim();
    
    item.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent category click event
      handler.addBlockFromSidebarItem(itemName);
    });
  });
  
  return handler;
}