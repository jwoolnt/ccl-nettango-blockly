import { compileAndSetupModel } from "./netlogoAPI";

let autoCompileTimeout: number | null = null;
export let isAutoCompiling = false;

export function setIsAutoCompiling(value: boolean) {
  isAutoCompiling = value;
}

export function setUnsavedChangesFlag(value: boolean) {
  const banner = document.getElementById('unsaved-banner');
  if (banner) {
    banner.style.display = value ? 'block' : 'none';
  }
}

async function autoCompileAndSetup() {
  if (!isAutoCompiling) return;

  const codeElement = document.getElementsByClassName("generated-code");
  if (codeElement.length === 0) return;

  const code = codeElement[0].textContent || "";
  const status = document.getElementById('netlogo-status');
  
  try {
    // Use simplified approach
    await compileAndSetupModel(code);
    
    setUnsavedChangesFlag(false);
    if (status) {
      status.textContent = "Model auto-updated!";
    }
  } catch (error) {
    console.error("Auto-compile error:", error);
    if (status) {
      status.textContent = "Auto-compile error.";
    }
  }
}

export function scheduleAutoCompile() {
  // clear existing timeout
  if (autoCompileTimeout) {
    clearTimeout(autoCompileTimeout);
  }
  // schedule compile after delay
  autoCompileTimeout = window.setTimeout(() => {
    autoCompileAndSetup();
  }, 2000); // 2 seconds delay
}
