import { BlockDefinition } from "./definition/types";
import { createMathOperatorBlock } from "./definition/utilities";


const exponentiation: BlockDefinition = createMathOperatorBlock("exponentiation", "^");

const multiplication: BlockDefinition = createMathOperatorBlock("multiplication", "*");

const division: BlockDefinition = createMathOperatorBlock("division", "/");

const addition: BlockDefinition = createMathOperatorBlock("addition", "+");

const subtraction: BlockDefinition = createMathOperatorBlock("subtraction", "-");


const operatorBlocks: BlockDefinition[] = [
	exponentiation,
	multiplication,
	division,
	addition,
	subtraction
];


export default operatorBlocks;
