import { BlockDefinition } from "./definition/types";
import { createMathOperatorBlock, createValueBlock, Order } from "./definition/utilities";


const number: BlockDefinition = createValueBlock("number", "Number", {
	message0: "%1",
	args0: [{
		type: "field_number",
		name: "NUMBER"
	}],
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

const random: BlockDefinition = createValueBlock("random", "Number", {
	message0: "random %1",
	args0: [{
		type: "input_value",
		name: "N",
		check: "Number"
	}],
	for: (block, generator) => {
		const number = generator.valueToCode(block, "N", Order.FUNCTION_CALL);
		return [`random ${number}`, Order.FUNCTION_CALL];
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
	random
];


export default mathBlocks;
