import { BlockDefinition } from "./types";
import { createMathOperatorBlock, createValueBlock, netlogoCommand, Order } from "./utilities";


const number: BlockDefinition = createValueBlock("number", "Number", {
	message0: "%1",
	args0: [{
		type: "field_number",
		name: "NUMBER"
	}],
	colour: "#c72216",
	for: (block) => {
		const number = block.getFieldValue("NUMBER");
		return [`${number}`, Order.ATOMIC];
	}
});

const negation: BlockDefinition = createMathOperatorBlock("negation", "-", false);

const exponentiation: BlockDefinition = createMathOperatorBlock("exponentiation", "^");

const multiplication: BlockDefinition = createMathOperatorBlock("multiplication", "*");

const division: BlockDefinition = createMathOperatorBlock("division", "/");

const addition: BlockDefinition = createMathOperatorBlock("addition", "+");

const subtraction: BlockDefinition = createMathOperatorBlock("subtraction", "-");

// helper function for random, round blocks
function mathFunctionBlock(name: string, color: string = "#c72216"): BlockDefinition {
	return createValueBlock(name, "Number", {
		message0: `${netlogoCommand(name)} %1`,
		args0: [{
			type: "input_value",
			name: "N",
			check: "Number"
		}],
		colour: color,
		for: (block, generator) => {
			const value = generator.valueToCode(block, "N", Order.FUNCTION_CALL);
			return [`${netlogoCommand(name)} ${value}`, Order.FUNCTION_CALL];
		}
	});
}

const random = mathFunctionBlock("random");
const random_float = mathFunctionBlock("random_float");
const round = mathFunctionBlock("round");

// count block, takes in an array or conditional blocks like
// change checkvalue to null to build the wolf-sheep model
const count: BlockDefinition = createValueBlock("count", "Number", {
	message0: "count %1",
	args0: [{
		type: "input_value",
		name: "AGENT_SET",
	}],
	colour: "#c72216",
	for: (block, generator) => {
		const agentset = generator.valueToCode(block, "AGENT_SET", Order.FUNCTION_CALL);
		return [`count ${agentset}`, Order.FUNCTION_CALL];
	}
});


const mathBlocks: BlockDefinition[] = [
	number,
	negation,
	exponentiation,
	multiplication,
	division,
	addition,
	subtraction,
	random,
	random_float,
	round,
	count
];


export default mathBlocks;
