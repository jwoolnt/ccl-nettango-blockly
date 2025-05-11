import { BlockDefinition } from "./definition/types";
import { createStatementBlock} from "./definition/utilities";

const procedureBlock: BlockDefinition = createStatementBlock("procedure_def", {
    message0: "to %1",
    message1: "%1",  // Body input
    message2: "end",
    args0: [
        {
            type: "field_input",
            name: "PROC_NAME",
            text: "my-procedure"
        }
    ],
    args1: [
        {
            type: "input_statement",
            name: "BODY"
        }
    ],
    args2: [],
    color: 290,
    for: (block, generator) => {
        const procName = block.getFieldValue("PROC_NAME");
        const body = generator.statementToCode(block, "BODY");
        return `to ${procName}\n${body}end\n`;
    }
});

export default [procedureBlock];
