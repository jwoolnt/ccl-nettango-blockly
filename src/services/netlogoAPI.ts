// 
// NetLogo Web API integration functions
// Repo: https://github.com/NetLogo/Galapagos/blob/main/app/assets/javascripts/pages/simulation.js#L280-L310

import { createSliderWidgets } from "../components/variablesTracker";

// 
export interface NetLogoWidget {
  type: "slider" | "switch" | "chooser" | "inputBox";
  id?: number;          // required for update/delete
  variable: string;     // the global variable name, e.g. "density"
  display?: string;     // label shown in UI
  min?: number;         // slider min
  max?: number;         // slider max
  value?: number;       // current value
  step?: number;        // slider increment
  units?: string;
  // set display size to near-zero so the widget is hidden from user
  left?: number;
  top?: number;
  right?: number;
  bottom?: number;
}

// get the iframe
export function getNetLogoFrame(): Window | null {
    const iframe = document.getElementById("netlogo-iframe") as HTMLIFrameElement;
    return iframe ? iframe.contentWindow : null;
}

// Reset the NetLogo iframe to clear any previous state
export function resetNetLogoFrame(): void {
    const iframe = document.getElementById("netlogo-iframe") as HTMLIFrameElement;
    if (!iframe) {
        console.error("NetLogo iframe not found");
        return;
    }
    // Reload the iframe to clear its state
    iframe.src = iframe.src;
}

// Listen for compilation errors from NetLogo Web
let errorListener: ((event: MessageEvent) => void) | null = null;

export function setupErrorListener(): void {
    if (errorListener) {
        window.removeEventListener('message', errorListener);
    }
    
    errorListener = (event: MessageEvent) => {
        // Listen for error messages from NetLogo Web iframe
        if (event.data && event.data.type === 'compiler-error') {
            console.error('NetLogo compilation error:', event.data);
            
            // Display error to user
            const status = document.getElementById('netlogo-status');
            if (status) {
                status.textContent = "Compilation error - check NetLogo Web panel";
                status.style.color = "red";
            }
        }
    };
    
    window.addEventListener('message', errorListener);
}

// send a message
export function sendToNetLogo(type: string, data?: any): void {
    const frame = getNetLogoFrame();
    if (!frame) {
        console.error("NetLogo Web iframe not found");
        return;
    }
    const message = { type, ...data };
    // console.log(`Sending to NetLogo (${type}):`, message);
    try {
        frame.postMessage(message, "*");
    } catch (error) {
        console.error("postMessage failed:", error);
    }
}

//
// setModelCode: set the model code - puts the netlogo code blocks to the netlogo web editor
// doesn't auto compile (call with recompile() separately)
// 
// use when to load code but not run it yet
// 
// input: code string, autoRecompile boolean
export function setModelCode(code: string, autoRecompile: boolean = false): void {
    sendToNetLogo("nlw-set-model-code", {
        codeTabContents: code,
        autoRecompile: autoRecompile
    });
}
// recompile: takes whatever code in the code tab and compiles it
// use after calling setModelCode or when you've made changes in the code tab
export function recompile(): void {
    sendToNetLogo("nlw-recompile");
}

//
// recompileProcedures: replace specifics in memory without touching the code tab
// use when you want to hot-swap procedures during runtime
// EXAMPLE:
// document.getElementById('model-container').contentWindow.postMessage({
//   type: 'nlw-recompile-procedures',
//   proceduresCode: 'to go show "go has been replaced!" end to setup show "setup has been replaced!" end',
//   procedureNames: ['GO', 'SETUP'],
//   autoRerunForevers: true
// }, '*')
// NOTE: This does not update the code tab contents in the UI.  If you want that updated, too, you'll need to use
// `nlw-set-model-code` with `autoRecompile: false`.
export function recompileProcedures(proceduresCode: string, procedureNames: string[], autoRerunForevers: boolean = true): void {
    sendToNetLogo("nlw-recompile-procedures", {
        proceduresCode,
        procedureNames,
        autoRerunForevers
    });
}

// Load a complete .nlogox model into NetLogo Web
export function loadModel(nlogoxContent: string, path: string = 'generated-model.nlogox'): void {
  sendToNetLogo("nlw-load-model", {
    nlogo: nlogoxContent,
    path: path
  });
}

// run netlogo code
export function runCode(code: string): void {
  sendToNetLogo("nlw-run-code", {
    code: code
  });
}

// Common commands
export function runSetup(): void {
  runCode("setup");
}
export function runGo(): void {
  runCode("go");
}

export async function compileModel(code: string): Promise<void> {
  const frame = getNetLogoFrame();
  if (!frame) {
    console.error("NetLogo Web iframe not found");
    throw new Error("NetLogo Web iframe not found");
  }

  const status = document.getElementById('netlogo-status');
  if (status) {
    status.textContent = "Compiling...";
    status.style.color = "";
  }

  try {
    setModelCode(code, false);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // widgets must exist before recompile so NLW knows the variables
    await createSliderWidgets();
    await new Promise(resolve => setTimeout(resolve, 300));
    
    recompile();
    await new Promise(resolve => setTimeout(resolve, 2000));
    if (status) status.textContent = "Compiled (click Setup to initialize)";
    
  } catch (error) {
    console.error("Compilation error:", error);
    if (status) {
      status.textContent = "Compilation failed";
      status.style.color = "red";
    }
    throw error;
  }
}

// compileAndSetupModel: set code, compile it, and run setup (combined operation)
export async function compileAndSetupModel(code: string, createWidgets?: () => Promise<void>): Promise<void> {
  try {
    setModelCode(code, false);
    await new Promise(resolve => setTimeout(resolve, 300));

    if (createWidgets) await createWidgets();
    await new Promise(resolve => setTimeout(resolve, 300));

    recompile();
    await new Promise(resolve => setTimeout(resolve, 500));  // wait for compile

    runSetup();
  } catch (error) {
    console.error("Error in compileAndSetupModel:", error);
    const status = document.getElementById('netlogo-status');
    if (status) {
      status.textContent = "Error during setup";
      status.style.color = "red";
    }
    throw error;
  }
}

// setGlobalVariable: update a global variable directly via NetLogo Web runtime API
// i.e. 0.contentWindow.world.observer.setGlobal('density', 20)
export function setGlobalVariable(variableName: string, value: any): boolean {
  const frame = getNetLogoFrame();
  if (!frame) {
    console.error("NetLogo Web iframe not found");
    return false;
  }

  const world = (frame as any).world;
  if (!world?.observer?.setGlobal) {
    console.error("NetLogo world observer not available");
    return false;
  }

  try {
    world.observer.setGlobal(variableName, value);
    // console.log(`Set global ${variableName} = ${value}`);
    return true;
  } catch (error) {
    console.error("Failed to set global via runtime:", error);
    return false;
  }
}

// createWidget: correct NLW format
// widgetType: 'slider' | 'switch' | 'monitor' | etc.
// properties: widget-specific, see widget-properties.coffee
// Posts back nlw-create-widget-response with newWidgetId
export function createWidget(
  widgetType: string,
  x: number,
  y: number,
  properties: Record<string, any>
): void {
  sendToNetLogo("nlw-create-widget", { widgetType, x, y, properties });
}

// updateWidget: update properties of an existing widget by its NLW-assigned ID
export function updateWidget(id: number, properties: Record<string, any>): void {
  sendToNetLogo("nlw-update-widget", { id, properties });
}

// deleteWidget: remove a widget by its NLW-assigned ID
export function deleteWidget(id: number): void {
  sendToNetLogo("nlw-delete-widget", { id });
}

// createHiddenSlider: creates a slider widget off-screen.
// Note: min/max/step must be STRINGS per NLW API.
// Resolves with the NLW-assigned widget ID via nlw-create-widget-response.
export function createHiddenSlider(
  variableName: string,
  initialValue: number,
  min: number = 0,
  max: number = 100,
  step: number = 1,
  slotIndex: number = 0
): Promise<number> {
  return new Promise((resolve, reject) => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'nlw-create-widget-response') {
        window.removeEventListener('message', handler);
        if (event.data.success) {
          resolve(event.data.newWidgetId);
        } else {
          reject(event.data.error);
        }
      }
    };
    window.addEventListener('message', handler);

    const SLIDER_HEIGHT = 60; // NLW slider widget height approx
    createWidget('slider', 10, 10 + slotIndex * SLIDER_HEIGHT, {
      variable: variableName.toLowerCase(),
      display: variableName,
      default: initialValue,
      min: String(min),
      max: String(max),
      step: String(step),
      units: null,
      direction: 'horizontal',
    });
  });
}

// createHiddenSwitch: creates a switch widget off-screen for boolean values.
// Resolves with the NLW-assigned widget ID via nlw-create-widget-response.
export function createHiddenSwitch(
  variableName: string,
  initialValue: boolean,
  slotIndex: number = 0
): Promise<number> {
  return new Promise((resolve, reject) => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'nlw-create-widget-response') {
        window.removeEventListener('message', handler);
        if (event.data.success) {
          resolve(event.data.newWidgetId);
        } else {
          reject(event.data.error);
        }
      }
    };
    window.addEventListener('message', handler);

    const WIDGET_HEIGHT = 60; // NLW widget height approx
    createWidget('switch', 10, 10 + slotIndex * WIDGET_HEIGHT, {
      variable: variableName.toLowerCase(),
      display: variableName,
      on: initialValue,
    });
  });
}

// testing
const testWidgetBtn = document.getElementById('test-widget-btn');
if (testWidgetBtn) {
  testWidgetBtn.addEventListener('click', () => {
  sendToNetLogo("nlw-create-widget", {
    widgetType: 'slider',
    x: 10,
    y: 10,
    properties: {
      variable: 'density',
      display: 'density',
      default: 50,
      min: "0",
      max: "100",
      step: "1",
      units: null,
      direction: 'horizontal'
    }
  });

    // Listen once for the response
    window.addEventListener('message', (e) => {
      if (e.data?.type === 'nlw-create-widget-response') {
        console.log('Widget creation result:', e.data);
        alert(`Success: ${e.data.success}, ID: ${e.data.newWidgetId}`);
      }
    }, { once: true });
  });
}