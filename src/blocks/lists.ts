import { Order } from "./definition/utilities";
import { BlockFunction } from "./definition/types";

export const generateListsCreateWith: BlockFunction = function (block, generator) {
    const items = [];
    const itemCount = typeof block.getInput === "function"
        ? block.inputList.filter(input => input.name && input.name.startsWith("ADD")).length
        : 0;
    for (let i = 0; i < itemCount; i++) {
        const item = generator.valueToCode(block, `ADD${i}`, Order.NONE);
        if (item) items.push(item);
    }
    return [`[${items.join(", ")}]`, Order.ATOMIC];
};