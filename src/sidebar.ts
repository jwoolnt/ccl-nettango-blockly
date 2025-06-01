// sidebar.ts - Handles sidebar interactions and state
import * as Blockly from "blockly";
import { addBreed, addVariable, BreedType, refreshMITPlugin, removeBreed, removeVariable, updateVariable } from "./data/context";
import { reset, save } from "./services/serializer";
import { initDialogs, showVariableActionDialog, showBreedActionDialog} from "./modules";

// Sidebar state management
export type SidebarCategory = 'variables';

let activeCategory: SidebarCategory = 'variables';

// Initialize sidebar functionality
export function initSidebar(workspace: any, displayCodeCallback: () => void) {
  // Initialize custom dialogs
  initDialogs();
  
  // Set up category click handlers
  const categories = document.querySelectorAll('.sidebar-category');
  categories.forEach(category => {
    category.addEventListener('click', () => {
      // Remove active class from all categories
      categories.forEach(c => c.classList.remove('active'));
      // Add active class to clicked category
      category.classList.add('active');
      
      // Get category name from the span text
      const categoryName = category.querySelector('span')?.textContent?.toLowerCase() as SidebarCategory;
      if (categoryName) {
        activeCategory = categoryName;
        filterBlocksByCategory(categoryName);
      }
    });
  });

  // Set up actions for sidebar items
  setupVariableActions(workspace, displayCodeCallback);
  setupBreedActions(workspace, displayCodeCallback);

  const resetButton = document.getElementById('reset');
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      if (confirm("Are you sure you want to reset the workspace?")) {
        reset(workspace);
      }
    });
  }
  // Set up the file menu dropdown
  setupFileMenu(workspace);
}

// Filter blocks based on selected category (for future implementation)
function filterBlocksByCategory(category: SidebarCategory) {
  console.log(`Filtering blocks by category: ${category}`);
}

// Set up variable-related actions using custom dialogs
function setupVariableActions(workspace: any, displayCodeCallback: () => void) {
  const editVariablesButton = document.getElementById('edit-variables');
  if (editVariablesButton) {
    editVariablesButton.addEventListener('click', () => {
      showVariableActionDialog(workspace, displayCodeCallback);
    });
  }
}

// Set up breed-related actions using custom dialogs
function setupBreedActions(workspace: any, displayCodeCallback: () => void) {
  const editBreedsButton = document.getElementById('edit-breeds');
  if (editBreedsButton) {
    editBreedsButton.addEventListener('click', () => {
      showBreedActionDialog(workspace, displayCodeCallback);
    });
  }
}

// Set up file menu functionality
function setupFileMenu(workspace: any) {
  const fileMenuLink = document.querySelector('.nav-item:first-child .nav-link');
  const dropdownMenu = document.querySelector('.dropdown-menu');
  
  if (fileMenuLink && dropdownMenu) {
    // Toggle dropdown visibility on click
    fileMenuLink.addEventListener('click', (e) => {
      e.preventDefault();
      dropdownMenu.classList.toggle('show');
    });
    
    // Set up file menu item actions
    const menuItems = dropdownMenu.querySelectorAll('.dropdown-item');
    menuItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const action = item.textContent;
        
        switch (action) {
          case 'New':
            if (confirm('Start a new project? Any unsaved changes will be lost.')) {
              location.reload(); // Simple reset for now
            }
            break;
          case 'Upload local':
          case 'Upload from computer':
            // Create a file input element
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.xml, .json';
            fileInput.style.display = 'none';
            document.body.appendChild(fileInput);
            
            fileInput.click();
            fileInput.addEventListener('change', (event) => {
              const target = event.target as HTMLInputElement;
              if (target.files && target.files[0]) {
                const file = target.files[0];
                const reader = new FileReader();
                
                reader.onload = (e) => {
                  try {
                    // Handle the file content
                    console.log('File loaded, implementation needed');
                    // Future: Parse file and load into workspace
                  } catch (error) {
                    console.error('Error loading file:', error);
                    alert('Could not load the file.');
                  }
                };
                
                reader.readAsText(file);
              }
              document.body.removeChild(fileInput);
            });
            break;
          case 'Save':
            // Create a file download
            const workspaceXml = Blockly.serialization.workspaces.save(workspace);
            const blob = new Blob([JSON.stringify(workspaceXml)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'nettango-workspace.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            break;
        }
        
        // Hide dropdown after action
        dropdownMenu.classList.remove('show');
      });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!fileMenuLink.contains(e.target as Node) && !dropdownMenu.contains(e.target as Node)) {
        dropdownMenu.classList.remove('show');
      }
    });
  }
}