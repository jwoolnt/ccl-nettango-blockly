import { createStatementBlock} from "./definition/utilities";
import { BlockDefinition } from "./definition/types";

const ifBlock: BlockDefinition = createStatementBlock("if_block", {
	message0: "if %1 then",
	args0: [{ type: "input_value", name: "CONDITION", check: "Boolean" }],
	message1: "%1",
	args1: [{ type: "input_statement", name: "DO" }],
	tooltip: "Executes the statements if the condition is true.",
	helpUrl: "",
	for: (block, generator) => {
		const condition = generator.valueToCode(block, "CONDITION", 0);
		const statements = generator.statementToCode(block, "DO");
		return `if ${condition} [ ${statements} ]`;
	}
});

const ifElseBlock: BlockDefinition = createStatementBlock("if_else_block", {
	message0: "if %1 then",
	args0: [{ type: "input_value", name: "CONDITION", check: "Boolean" }],
	message1: "%1",
	args1: [{ type: "input_statement", name: "DO_IF" }],
	message2: "else %1",
	args2: [{ type: "input_statement", name: "DO_ELSE" }],
	tooltip: "Executes one set of statements if the condition is true, otherwise executes another.",
	helpUrl: "",
	for: (block, generator) => {
		const condition = generator.valueToCode(block, "CONDITION", 0);
		const doIf = generator.statementToCode(block, "DO_IF");
		const doElse = generator.statementToCode(block, "DO_ELSE");
		return `ifelse ${condition} [ ${doIf} ] [ ${doElse} ]`;
	}
});

const blocks: BlockDefinition[] = [ifBlock, ifElseBlock];

export default blocks;
