import * as Blockly from "blockly";
import toolbox from "./blocks/toolbox";
import activeBlocks from "./blocks";
import { save, load, reset } from "./services/serializer"
import netlogoGenerator, { generateCodePrefix } from "./services/generator";

//@ts-expect-error
import { LexicalVariablesPlugin } from '@mit-app-inventor/blockly-block-lexical-variables';
import { addBreed, addVariable, BreedType, refreshMITPlugin, removeBreed, removeVariable, updateVariable } from "./data/context";


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
	Blockly.Msg.LANG_VARIABLES_GLOBAL_PREFIX = "";

	const displayCode = () => {
		refreshMITPlugin();
		codeOutput.textContent = generateCodePrefix() + netlogoGenerator.workspaceToCode(ws);
		save(ws);
	}

	load(ws);
	displayCode();


	const actionMap: Record<string, () => any> = {
		"edit-variables": () => {
			switch (prompt("what do you want to do? (add, rename, remove)")) {
				case "add":
					let name = prompt("what is the variable name?");
					if (name == null) return;
					let type = prompt("what breed? (hit enter if none)");
					if (type == null) return;
					addVariable(name, type ? type : "globals");
					break;
				case "rename":
					let currentName = prompt("what is the old variable name?");
					if (currentName == null) return;
					let newName = prompt("what is the new variable name?");
					if (newName == null) return;
					updateVariable(currentName, newName);
					break;
				case "remove":
					let removeName = prompt("what is the variable name?");
					if (removeName == null) return;
					removeVariable(removeName);
					break;
				default:
					console.error("invalid variable action");
					break;
			}
		},
		"edit-breeds": () => {
			switch (prompt("what do you want to do? (add, remove)")) {
				case "add":
					let typeRaw = prompt("what is the breed type? (turtle, undirected-link, directed-link)");
					if (typeRaw == null || !["turtle", "undirected-link", "directed-link"].includes(typeRaw)) return;
					let type = typeRaw as BreedType;
					let pluralName = prompt("what is the breeds plural name?");
					if (pluralName == null) return;
					let singularName = prompt("what is the breeds singular name?");
					if (singularName == null) return;
					addBreed({
						type,
						pluralName,
						singularName
					});
					break;
				case "remove":
					let removeName = prompt("what is the breed name?");
					if (removeName == null) return;
					removeBreed(removeName)
					break;
				default:
					console.error("invalid breed action");
					break;
			}
		},
		"reset-workspace": () => reset(ws)
	}

	Array.from(actionButtons).forEach(e => {
		if (actionMap[e.id]) {
			e.addEventListener("click", () => {
				actionMap[e.id]();
				displayCode();
			});
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
		displayCode();
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
