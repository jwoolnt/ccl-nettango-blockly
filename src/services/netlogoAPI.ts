// 
// NetLogo Web API integration functions
// Repo: https://github.com/NetLogo/Galapagos/blob/main/app/assets/javascripts/pages/simulation.js#L280-L310
// 

// get the iframe
export function getNetLogoFrame(): Window | null {
    const iframe = document.getElementById("netlogo-iframe") as HTMLIFrameElement;
    return iframe ? iframe.contentWindow : null;
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