import { BlockDefinition } from "./types";
import { Order } from "./utilities";


const let_: BlockDefinition = function simple_local_declaration_statement(block, generator) {
	const variable = block.getFieldValue("VAR");
	const value = generator.valueToCode(block, "DECL", Order.NONE);
	let code = `let ${variable} ${value}\n`;

	generator.INDENT = "";
	code += generator.statementToCode(block, "DO");
	generator.INDENT = "\t";

	return code;
}

const set: BlockDefinition = function lexical_variable_set(block, generator) {
	const variable = block.getFieldValue("VAR");
	const value = generator.valueToCode(block, "VALUE", Order.NONE);
	return `set ${variable} ${value}`;
}

const get: BlockDefinition = function lexical_variable_get(block) {
	return [block.getFieldValue("VAR"), Order.ATOMIC];
}


const variableBlocks: BlockDefinition[] = [
	let_, set, get
];


export default variableBlocks;
