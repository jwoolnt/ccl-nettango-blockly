import { createValueBlock } from "./definition/utilities";
import { BlockDefinition } from "./definition/types";

const arrayBlock: BlockDefinition = createValueBlock("array_block", "Array", {
    message0: "list %1 %2 %3",
    args0: [
        { type: "input_value", name: "ELEMENT1" }, 
        { type: "input_value", name: "ELEMENT2" }, 
        { type: "input_value", name: "ELEMENT3" }  
    ],
    inputsInline: true, 
    output: "Array",
    tooltip: "Creates a list with three elements.",
    helpUrl: "",
    for: (block, generator) => {
        const e1 = generator.valueToCode(block, "ELEMENT1", 0) || "null"; 
        const e2 = generator.valueToCode(block, "ELEMENT2", 0) || "null"; 
        const e3 = generator.valueToCode(block, "ELEMENT3", 0) || "null"; 
        return [`${e1}, ${e2}, ${e3}`, 0];
    }
});

const blocks: BlockDefinition[] = [arrayBlock];

export default blocks;