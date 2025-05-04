import * as Blockly from "blockly";
import toolbox from "./blocks/toolbox";
import activeBlocks from "./blocks";
import { save, load } from "./services/serializer"
import netlogoGenerator from "./services/generator";
import { addBreed, resetBreeds } from "./data/breeds";
import { VariableRegistry } from "./blocks/ui/variable_registry";
import { setupVariableModal, openCustomVariableModal } from "./blocks/ui/variable_modal";
import { setupBreedModal, openBreedModal } from "./data/breed_modal";
import { initBreedRegistryIntegration } from "./data/breed_registry";
import { setupListModal, openListModal} from "./blocks/ui/list_modal";

Blockly.common.defineBlocks({ ...activeBlocks });

const blockEditor = document.getElementsByClassName("block-editor")[0];
const codeOutput = document.getElementsByClassName("generated-code")[0];
const actionButtons = document.getElementsByClassName("action-button");

if (blockEditor && codeOutput) {
	const ws = Blockly.inject(blockEditor, {
		renderer: 'thrasos',
		toolbox,
		zoom: { controls: true },
		move: { scrollbars: false, drag: true, wheel: true }
	});

	const generateCode = () =>
		codeOutput.textContent = netlogoGenerator.workspaceToCode(ws);

	// Initialize the breed registry integration with variable system
	initBreedRegistryIntegration();
	
	// Set up the breed modal
	setupBreedModal(ws);
	
	// Set up the variable modal
	setupVariableModal(ws);

	// Set up the list modal
	setupListModal(ws);
	
	load(ws);
	generateCode();
	
	actionButtons[0].addEventListener("click", () => {
		openCustomVariableModal();
	});
	
	actionButtons[1].addEventListener("click", () => {
		openBreedModal();
	});

	actionButtons[2].addEventListener("click", () => {
		openListModal();
	});

	actionButtons[3].addEventListener("click", () => {
		if (confirm("Are you sure you want to reset all breeds? This will remove all custom breeds.")) {
			resetBreeds();
			// Reset breed-related scopes in variable registry
			VariableRegistry.resetCustomScopes();
			// Force refresh of dropdowns
			ws.fireChangeListener({ type: Blockly.Events.FINISHED_LOADING } as Blockly.Events.FinishedLoading);
		}
	});

	actionButtons[4].addEventListener("click", () => {
		if (confirm("Are you sure you want to reset the workspace? This will clear all blocks.")) {
			ws.clear();
		}
	});

	ws?.addChangeListener((e) => {
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