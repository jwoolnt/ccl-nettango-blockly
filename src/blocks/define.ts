import { common } from 'blockly/core';

// --- breed definition ---
type BreedInfo = [string, string];

let turtleBreeds: BreedInfo[] = [
	["turtles", "turtle"]
];

let undirectedLinkBreeds: BreedInfo[] = [];

let directedLinkBreeds: BreedInfo[] = [];

let linkBreeds: BreedInfo[] = [
	["links", "link"],
	...undirectedLinkBreeds,
	...directedLinkBreeds
];

let breeds: BreedInfo[] = [
	...turtleBreeds,
	...linkBreeds
];

export let breedPlurals: string[] = toPluralArray(breeds);

export let agentSets: string[] = toPluralArray([
	["patches", "patch"],
	...turtleBreeds,
	...linkBreeds
]);

function toPluralArray(array: BreedInfo[]): string[] {
	return array.map(([plural]) => plural);
}

function refreshBreeds(): void {
	breeds = [
		...turtleBreeds,
		...linkBreeds
	];
	breedPlurals = toPluralArray(breeds);
	agentSets = toPluralArray([
		["patches", "patch"],
		...turtleBreeds,
		...linkBreeds
	]);
}

export function resetBreeds(): void {
	turtleBreeds = [
		["turtles", "turtle"]
	];
	undirectedLinkBreeds = [];
	directedLinkBreeds = [];
	linkBreeds = [
		["links", "link"],
		...undirectedLinkBreeds,
		...directedLinkBreeds
	];
	refreshBreeds();
}

export function addBreed(type: string, breedInfo: BreedInfo): void {
	switch (type) {
		case "turtle":
			turtleBreeds.push(breedInfo);
			break;
		case "ulink":
		case "undirected-link":
			undirectedLinkBreeds.push(breedInfo);
			break;
		case "dlink":
		case "directed-link":
			directedLinkBreeds.push(breedInfo);
			break;
		default:
			alert(`Unsupported breed type: ${type}`);
			return;
	}

	linkBreeds = [
		["links", "link"],
		...undirectedLinkBreeds,
		...directedLinkBreeds
	];
	breeds = [
		...turtleBreeds,
		...linkBreeds
	];
	refreshBreeds();
}

// --- basic block definition ---
interface BasicBlock {
	type: string;
	message0: string;
	previousStatement: null;
	nextStatement: null;
}

export function defineBasicBlock(type: string): BasicBlock {
	return {
		type,
		message0: type.replace("_", "-"),
		previousStatement: null,
		nextStatement: null
	};
}

export function defineBasicBlocks(...types: string[]): BasicBlock[] {
	return types.map(type => defineBasicBlock(type));
}

// 
// --- control block definition ---
// 
interface controlBlock {
    type: string;
    message0: string;
    args0: Array<{
        type: string;
        name: string;
        check?: string;
    }>;
    message1?: string;
    args1?: Array<{
        type: string;
        name: string;
    }>;
    message2?: string;
    args2?: Array<{
        type: string;
        name: string;
    }>;
    previousStatement: string | null;
    nextStatement: string | null;
    style: string;
    tooltip: string;
    helpUrl: string;
}

export function defineControlBlock(type: string, message0: string, tooltip: string): controlBlock {
    return {
        type,
        message0,
        args0: [],
        previousStatement: null,
        nextStatement: null,
        style: "logic_blocks",
        tooltip,
        helpUrl: ""
    };
}

// 
// --- operator block definition ---
// 
interface operatorBlock {
    type: string;
    message0: string;
    args0: Array<{ type: string; name: string; value?: number | string; text?: string; check?: string }>;
    inputsInline: boolean;
    output: string;
    style: string;
    tooltip: string;
    helpUrl: string;
}

export function defineOperatorBlock(type: string, message0: string, output: string, tooltip: string): operatorBlock {
    return {
        type,
        message0,
        args0: [],
        inputsInline: true,
        output,
        style: "math_blocks",
        tooltip,
        helpUrl: ""
    };
}
// helper function to create args0 based on input type for the operator block
export function createOperatorArgs(inputs: Array<{ name: string; type: "number" | "text" | "boolean" }>) {
    return inputs.map(input => {
        switch (input.type) {
            case "number":
                return { type: "field_number", name: input.name, value: 0 };
            case "text":
                return { type: "field_input", name: input.name, text: "" };
            case "boolean":
                return { type: "input_value", name: input.name, check: "Boolean" };
            default:
                return {};
        }
    });
}

// 
// --- looks block definition ---
//
type colorDict = [string, string];

interface looksBlock {
    type: string;
    message0: string;
    args0: Array<{
        type: string;
        name: string;
        options?: colorDict[];
        check?: string;
    }>;
    previousStatement?: string | null;
    nextStatement?: string | null;
    output?: string;
}

export function defineLooksBlock(
    type: string,
    message0: string,
    args0: Array<{ type: string; name: string; options?: colorDict[]; check?: string }>,
    previousStatement: string | null = null,
    nextStatement: string | null = null,
    output?: string
): looksBlock {
    return {
        type,
        message0,
        args0,
        previousStatement,
        nextStatement,
        output
    };
}
