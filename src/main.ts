import * as Blockly from "blockly";
import { save, load } from "./services/serializer";
import netlogoGenerator from "./services/generator";
import { addBreed, resetBreeds } from "./data/breeds";


const blockEditor = document.getElementsByClassName("block-editor")[0];
const codeOutput = document.getElementsByClassName("generated-code")[0];
const actionButtons = document.getElementsByClassName("action-button");

if (blockEditor && codeOutput) {
	const ws = Blockly.inject(blockEditor, {
		renderer: 'thrasos',
		// toolbox,
		// zoom: { controls: true }
		// move: { scrollbars: true, drag: true, wheel: true }
	});

	const generateCode = () =>
		codeOutput.textContent = netlogoGenerator.workspaceToCode(ws);

	load(ws);
	generateCode();


	actionButtons[0].addEventListener("click", () => {
		Blockly.Variables.createVariableButtonHandler(ws);
	});

	actionButtons[1].addEventListener("click", () => {
		let type = prompt("what is the breed type? (turtle, undirected-link/ulink, directed-link/dlink)");
		if (type == null) return;
		let plural = prompt("what is the breeds plural name?");
		if (plural == null) return;
		let singular = prompt("what is the breeds singular name?");
		if (singular == null) return;
		addBreed(type, [plural, singular]);
	});

	actionButtons[2].addEventListener("click", () => {
		resetBreeds();
	});


	ws.addChangeListener((e) => {
		if (
			e.isUiEvent ||
			e.type == Blockly.Events.FINISHED_LOADING ||
			ws.isDragging()
		) {
			return;
		}
		generateCode();
	});

	ws.addChangeListener((e) => {
		if (e.isUiEvent) return;
		save(ws);
	});
} else {
	if (!blockEditor) {
		console.error("Setup: cannot find blockEditor");
	} else if (!codeOutput) {
		console.error("Setup: cannot find codeOutput");
	}
}
