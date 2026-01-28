// 
// NetLogo Web API integration functions
// Repo: https://github.com/NetLogo/Galapagos/blob/main/app/assets/javascripts/pages/simulation.js#L280-L310
// 

// get the iframe
export function getNetLogoFrame(): Window | null {
    const iframe = document.getElementById("netlogo-iframe") as HTMLIFrameElement;
    return iframe ? iframe.contentWindow : null;
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
// type: message type string
// data: additional data object
export function sendToNetLogo(type: string, data?: any): void {
    const frame = getNetLogoFrame();
    if (!frame) {
        console.error("NetLogo Web iframe not found");
        return;
    }

    frame.postMessage({ type: 'nlw-request-model-state' }, "*");
    window.addEventListener('message', function handler(event) {
        console.log("Received model state response:", event.data);
        // Remove listener after first response
        window.removeEventListener('message', handler);
    });

    // combine type with any additional data
    // this creates an object like { type: "nlw-command", command: "setup" }
    const message = { type, ...data };
    console.log(`Sending to NetLogo (${type}):`, message);
    try {
        frame.postMessage(message, "*");
        console.log("postMessage call successful");
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
    // Set the model code
    setModelCode(code, false);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Recompile
    recompile();
    
    // Wait for compilation (longer for errors)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (status) status.textContent = "Compiled (click Setup to initialize)";
    
    console.log("Model compiled! Use Setup button to initialize.");
  } catch (error) {
    console.error("Compilation error:", error);
    if (status) {
      status.textContent = "Compilation failed";
      status.style.color = "red";
    }
    throw error;
  }
}

// updateGlobalVariable: update a global variable in the NetLogo runtime
// For dynamic variable updates without recompiling
export function updateGlobalVariable(variableName: string, value: any): void {
  const frame = getNetLogoFrame();
  if (!frame) {
    console.error("NetLogo Web iframe not found");
    return;
  }
  
  sendToNetLogo("nlw-update-model-state", {
    globalUpdate: {
      [variableName]: value
    }
  });
  console.log(`Updated ${variableName} = ${value} in NetLogo`);
}

// compileAndSetupModel: set code, compile it, and run setup (combined operation)
export async function compileAndSetupModel(code: string): Promise<void> {
  const frame = getNetLogoFrame();
  if (!frame) {
    console.error("NetLogo Web iframe not found");
    return;
  }

  try {
    // set the model code
    setModelCode(code, false); 
    
    // wait a bit
    // await new Promise(resolve => setTimeout(resolve, 500));
    
    // recompile the model
    recompile();
    
    // wait for compilation to finish
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // run setup
    runSetup();
    
    console.log("Model compiled and setup complete!");
  } catch (error) {
    console.error("Compile and setup error:", error);
    throw error;
  }
}