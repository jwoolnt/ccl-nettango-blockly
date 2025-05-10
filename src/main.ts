import * as Blockly from "blockly";
import toolbox from "./blocks/toolbox";
import activeBlocks from "./blocks";
import { save, load, reset } from "./services/serializer"
import netlogoGenerator from "./services/generator";
import { addBreed, BREED_SERIALIZER, BreedType } from "./data/breeds";
import { addGlobal, renameGlobal, removeGlobal } from "./data/globals";

//@ts-expect-error
import { LexicalVariablesPlugin } from '@mit-app-inventor/blockly-block-lexical-variables';


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
	LexicalVariablesPlugin.init(ws);

	const generateCode = () =>
		codeOutput.textContent = netlogoGenerator.workspaceToCode(ws);

	load(ws, generateCode);


	const actionMap: Record<string, () => any> = {
		"add-variable": () => {
			switch (prompt("what do you want to do? (add, rename, remove)")) {
				case "add":
					addGlobal(prompt("what is the name?") as string);
					break;
				case "rename":
					renameGlobal(prompt("what is the old name?") as string, prompt("what is the new name?") as string);
					break;
				case "remove":
					removeGlobal(prompt("what is the name?") as string);
					break;
				default:
					console.error("invalid variable action");
					break;
			}

		},
		"add-breed": () => {
			let type = prompt("what is the breed type? (turtle, undirected-link/ulink, directed-link/dlink)");
			if (type == null) return;
			let plural = prompt("what is the breeds plural name?");
			if (plural == null) return;
			let singular = prompt("what is the breeds singular name?");
			if (singular == null) return;
			addBreed(type as BreedType, [plural, singular]);
		},
		"reset-breed": () => {
			BREED_SERIALIZER.clear(ws);
			save(ws);
		},
		"reset-workspace": () => reset(ws)
	}

	Array.from(actionButtons).forEach(e => {
		if (actionMap[e.id]) {
			e.addEventListener("click", actionMap[e.id]);
		}
	})


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
