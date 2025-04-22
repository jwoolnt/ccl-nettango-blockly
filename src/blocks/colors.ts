import { createStatementBlock, createValueBlock, staticOptions } from "./definition/utilities";
import { BlockDefinition } from "./definition/types";

const netlogoColors = staticOptions([
    "black", "gray", "white", "red", "orange", 
    "yellow", "green", "blue", "violet", "pink"
]);

const setTurtleColor: BlockDefinition = createStatementBlock("set_turtle_color", {
    message0: "set color %1",
    args0: [{
        type: "field_dropdown",
        name: "VALUE",
        options: netlogoColors
    }],
    for: block => `set color ${block.getFieldValue("VALUE")}`
});

const setPatchColor: BlockDefinition = createStatementBlock("set_patch_color", {
    message0: "set pcolor %1",
    args0: [{
        type: "field_dropdown",
        name: "VALUE",
        options: netlogoColors
    }],
    for: block => `set pcolor ${block.getFieldValue("VALUE")}`
});
const setPatchColorOneOf: BlockDefinition = createStatementBlock("set_patch_color_one_of", {
    message0: "set pcolor one-of [ %1 ]",
    args0: [{
        type: "input_value",
        name: "LIST",
        check: "Array" // Ensures the input is a list
    }],
    for: (block, generator) => {
        const list = generator.valueToCode(block, "LIST", 0) || "[]"; // Default to an empty list if none is provided
        return `set pcolor one-of [ ${list} ]`;
    }
});

const oneOf: BlockDefinition = createValueBlock("one_of", "Color", {
    message0: "one-of %1",
    args0: [{
        type: "input_value",
        name: "LIST",
        check: "Array",
    }],
    for: (block, generator) => {
        const list = generator.valueToCode(block, "LIST", 0);
        return [`one-of ${list}`, 0];
    }
});
const colorBlocks: BlockDefinition[] = [
    setTurtleColor,
    setPatchColor,
    oneOf,
    setPatchColorOneOf,
];
export default colorBlocks;
