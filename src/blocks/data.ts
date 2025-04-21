import { createStatementBlock, createValueBlock} from "./definition/utilities";
import { BlockDefinition } from "./definition/types";

const arrayBlock: BlockDefinition = createStatementBlock("array_block", {
	message0: "create list %1 %2 %3",
	args0: [
		{ type: "input_value", name: "ELEMENT1", check: "String" },
		{ type: "input_value", name: "ELEMENT2", check: "String" },
		{ type: "input_value", name: "ELEMENT3", check: "String" }
	],
	// style: "logic_blocks",
	tooltip: "Creates an array with three elements.",
	helpUrl: "",
	for: (block, generator) => {
		const e1 = generator.valueToCode(block, "ELEMENT1", 0);
		const e2 = generator.valueToCode(block, "ELEMENT2", 0);
		const e3 = generator.valueToCode(block, "ELEMENT3", 0);
		return `list ${e1} ${e2} ${e3}`;
	}
});

const numberVariableBlock: BlockDefinition = createValueBlock("number_variable", "String", {
	message0: "number %1",
	args0: [
		{
			type: "field_number",
			name: "VALUE",
			value: 0
		}
	],
	// style: "math_blocks",
	tooltip: "A number input.",
	helpUrl: "",
	for: block => `${block.getFieldValue("VALUE")}`
});

const stringVariableBlock: BlockDefinition = createValueBlock("string_variable", "String", {
	message0: "string %1",
	args0: [
		{
			type: "field_input",
			name: "VALUE",
			text: ""
		}
	],
	// style: "text_blocks",
	tooltip: "A string input.",
	helpUrl: "",
	for: block => `"${block.getFieldValue("VALUE") || ""}"`
});

const blocks: BlockDefinition[] = [arrayBlock, numberVariableBlock, stringVariableBlock];

export default blocks;
