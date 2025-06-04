import { Order } from "./utilities";
import { BlockFunction, BlockDefinition } from "./types";
import { createValueBlock } from "./utilities";

const generateListsCreateWith: BlockFunction = function lists_create_with(block, generator) {
    const items = [];
    const itemCount = typeof block.getInput === "function"
        ? block.inputList.filter(input => input.name && input.name.startsWith("ADD")).length
        : 0;
    for (let i = 0; i < itemCount; i++) {
        const item = generator.valueToCode(block, `ADD${i}`, Order.NONE);
        if (item) items.push(item);
    }
    return [`[${items.join(" ")}]`, Order.ATOMIC];
};


// TODO: Output type should be Agentset or Array
const one_of: BlockDefinition = createValueBlock("one_of", null, {
    message0: "one-of %1",
    args0: [{
        type: "input_value",
        name: "LIST",
        check: ["Array", "Agentset"],
    }],
    colour: "#795548",
    for: (block, generator) => {
        const list = generator.valueToCode(block, "LIST", 0);
        return [`one-of ${list}`, 0];
    }
});

const listBlocks = [generateListsCreateWith, one_of] as BlockDefinition[];


export default listBlocks;
