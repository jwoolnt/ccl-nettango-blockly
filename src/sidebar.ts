// sidebar.ts - Handles sidebar interactions and state
import * as Blockly from "blockly";
import { addBreed, addVariable, BreedType, refreshMITPlugin, removeBreed, removeVariable, updateVariable } from "./data/context";
import { save } from "./services/serializer";

// Sidebar state management
export type SidebarCategory = 'variables' | 'control' | 'math' | 'logic' | 'agents' | 'turtles' | 'patches' | 'lists' | 'strings';

let activeCategory: SidebarCategory = 'variables';

// Initialize sidebar functionality
export function initSidebar(workspace: any, displayCodeCallback: () => void) {
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
//   setupListActions(workspace, displayCodeCallback);
  
  // Set up the file menu dropdown
  setupFileMenu(workspace);
}

// Filter blocks based on selected category (for future implementation)
function filterBlocksByCategory(category: SidebarCategory) {
  console.log(`Filtering blocks by category: ${category}`);
  // Future implementation: show/hide blocks based on category
}

// Set up variable-related actions
function setupVariableActions(workspace: any, displayCodeCallback: () => void) {
  const editVariablesButton = document.getElementById('edit-variables');
  if (editVariablesButton) {
    editVariablesButton.addEventListener('click', () => {
      const action = prompt("What do you want to do? (add, rename, remove)");
      
      switch (action) {
        case "add":
          const name = prompt("What is the variable name?");
          if (name == null) return;
          
          const type = prompt("What breed? (hit enter if none)");
          if (type == null) return;
          
          addVariable(name, type ? type : "globals");
          break;
          
        case "rename":
          const currentName = prompt("What is the old variable name?");
          if (currentName == null) return;
          
          const newName = prompt("What is the new variable name?");
          if (newName == null) return;
          
          updateVariable(currentName, newName);
          break;
          
        case "remove":
          const removeName = prompt("What is the variable name?");
          if (removeName == null) return;
          
          removeVariable(removeName);
          break;
          
        default:
          console.error("Invalid variable action");
          break;
      }
      
      refreshMITPlugin();
      displayCodeCallback();
      save(workspace);
    });
  }
}

// Set up breed-related actions
function setupBreedActions(workspace: any, displayCodeCallback: () => void) {
  const editBreedsButton = document.getElementById('edit-breeds');
  if (editBreedsButton) {
    editBreedsButton.addEventListener('click', () => {
      const action = prompt("What do you want to do? (add, remove)");
      
      switch (action) {
        case "add":
          const typeRaw = prompt("What is the breed type? (turtle, undirected-link, directed-link)");
          if (typeRaw == null || !["turtle", "undirected-link", "directed-link"].includes(typeRaw)) return;
          
          const type = typeRaw as BreedType;
          const pluralName = prompt("What is the breeds plural name?");
          if (pluralName == null) return;
          
          const singularName = prompt("What is the breeds singular name?");
          if (singularName == null) return;
          
          addBreed({
            type,
            pluralName,
            singularName
          });
          break;
          
        case "remove":
          const removeName = prompt("What is the breed name?");
          if (removeName == null) return;
          
          removeBreed(removeName);
          break;
          
        default:
          console.error("Invalid breed action");
          break;
      }
      
      refreshMITPlugin();
      displayCodeCallback();
      save(workspace);
    });
  }
}

// Set up list-related actions (placeholder for future implementation)
// function setupListActions(workspace: any, displayCodeCallback: () => void) {
//   const listButton = document.querySelector('.sidebar-item:nth-child(3)');
//   if (listButton) {
//     listButton.addEventListener('click', () => {
//       alert("List: Working on it...!");
//       // Future implementation
//     });
//   }
// }

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