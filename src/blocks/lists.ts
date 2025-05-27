import { Order } from "./utilities";
import { BlockFunction } from "./types";

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


const listBlocks = [generateListsCreateWith];


export default listBlocks;
