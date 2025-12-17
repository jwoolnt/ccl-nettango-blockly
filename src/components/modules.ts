// modules.ts - Handles UI module initialization
import { reset } from "../services/serializer";
import { createDefaultProcedures } from "../services/defaultProcedures";
import { initDialogs } from "./dialog";
import { updateWorkspaceForDomain } from "../blocks/domain";

// Store the current workspace domain
let currentDomain: string = 'default';

// Initialize UI modules and event handlers
export function initUIModules(workspace: any, displayCodeCallback: () => void) {
  // Initialize custom dialogs
  initDialogs();

  // Set up the file menu dropdown
  setupFileMenu(workspace, displayCodeCallback);
}

// Generate HTML template for the new project modal
function createNewProjectModalHTML(): string {
  return `
    <h2 class="new-project-modal-title">New Project</h2>
    
    <div class="new-project-field">
      <label class="new-project-label">Project Name</label>
      <input 
        type="text" 
        id="project-name-input" 
        class="new-project-input"
        placeholder="Enter project name..."
      />
    </div>

    <div class="new-project-field">
      <label class="new-project-label">Domain</label>
      <select id="domain-select" class="new-project-select">
        <option value="default">Default</option>
        <option value="Ants">Ants</option>
        <option value="Wolf-Sheep">Wolf-Sheep</option>
        <option value="Frog Pond">Frog Pond</option>
      </select>
    </div>

    <div class="new-project-buttons">
      <button id="cancel-btn" class="new-project-btn new-project-btn-cancel">
        Cancel
      </button>
      <button id="create-btn" class="new-project-btn new-project-btn-primary">
        Create Project
      </button>
    </div>
  `;
}

// Show the New Project modal
function showNewProjectModal(_workspace: any): Promise<{projectName: string, domain: string} | null> {
  return new Promise((resolve) => {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'new-project-overlay';

    // Create modal content
    const modal = document.createElement('div');
    modal.className = 'new-project-modal';
    modal.innerHTML = createNewProjectModalHTML();

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Get elements
    const projectNameInput = modal.querySelector('#project-name-input') as HTMLInputElement;
    const domainSelect = modal.querySelector('#domain-select') as HTMLSelectElement;
    const cancelBtn = modal.querySelector('#cancel-btn') as HTMLButtonElement;
    const createBtn = modal.querySelector('#create-btn') as HTMLButtonElement;

    // Set default domain to current
    domainSelect.value = currentDomain;

    // Focus on input
    setTimeout(() => projectNameInput.focus(), 100);

    // Handle cancel
    const handleCancel = () => {
      document.body.removeChild(overlay);
      resolve(null);
    };

    // Handle create
    const handleCreate = () => {
      const projectName = projectNameInput.value.trim();
      const domain = domainSelect.value;

      if (!projectName) {
        projectNameInput.classList.add('new-project-input-error');
        projectNameInput.focus();
        return;
      }

      currentDomain = domain;
      document.body.removeChild(overlay);
      resolve({ projectName, domain });
    };

    // Event listeners
    cancelBtn.addEventListener('click', handleCancel);
    createBtn.addEventListener('click', handleCreate);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) handleCancel();
    });

    // Handle Enter key
    projectNameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleCreate();
      else if (e.key === 'Escape') handleCancel();
    });

    // Remove error class on input
    projectNameInput.addEventListener('input', () => {
      projectNameInput.classList.remove('new-project-input-error');
    });
  });
}

// Get the current domain
export function getCurrentDomain(): string {
  return currentDomain;
}

// Set up file menu functionality
function setupFileMenu(workspace: any, displayCodeCallback: () => void) {
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
      item.addEventListener('click', async (e) => {
        e.preventDefault();
        const action = item.textContent;

        switch (action) {
          case 'New':
            // Show confirmation first
            if (confirm('Start a new project? Any unsaved changes will be lost.')) {
              // Show the new project modal
              const result = await showNewProjectModal(workspace);
              
              if (result) {
                console.log('Creating new project:', result);
                
                // 1. Reset the workspace
                reset(workspace);
                
                // 2. Update workspace with domain-specific blocks (updates toolbox)
                updateWorkspaceForDomain(workspace, result.domain, displayCodeCallback);

                // 3. Insert default setup/go procedures into a fresh workspace
                createDefaultProcedures(workspace);

                // 4. Refresh generated code to reflect new defaults
                displayCodeCallback();
                
                // 5. Set the project name in your app state
                // setProjectName(result.projectName);
                
                // 6. Update any UI elements showing the project name
                console.log(`Project "${result.projectName}" created with domain "${result.domain}"`);
              }
            }
            break;
          case 'Upload local':
          case 'Upload from computer':
            // Create a file input element
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.json';
            fileInput.style.display = 'none';
            document.body.appendChild(fileInput);

            fileInput.click();
            fileInput.addEventListener('change', (event) => {
              const target = event.target as HTMLInputElement;
              if (target.files && target.files[0]) {
                const file = target.files[0];
                const reader = new FileReader();

                reader.onload = (_e) => {
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
            // No-op here; dropdown will be closed below.
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