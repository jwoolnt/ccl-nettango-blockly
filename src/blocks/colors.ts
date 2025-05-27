import { createStatementBlock, createValueBlock, staticOptions } from "./utilities";
import { BlockDefinition } from "./types";

const netlogoColors = staticOptions([
    "black", "gray", "white", "red", "orange",
    "yellow", "green", "blue", "violet", "pink"
]);

// color single variable block
const color: BlockDefinition = createValueBlock("color", "Color", {
    message0: "%1",
    args0: [{
        type: "field_dropdown",
        name: "COLOR",
        options: netlogoColors
    }],
    colour: "#795548",
    for: (block) => {
        const color = block.getFieldValue("COLOR");
        return [`${color}`, 0];
    }
});

// color setters
const setTurtleColor: BlockDefinition = createStatementBlock("set_turtle_color", {
    message0: "set color %1",
    args0: [{
        type: "input_value",
        name: "VALUE",
        check: "Color",
    }],
    colour: "#2E7D32",
    for: (block, generator) => {
        const value = generator.valueToCode(block, "VALUE", 0) || "0";
        return `set color ${value}`;
    }
});

const setPatchColor: BlockDefinition = createStatementBlock("set_patch_color", {
    message0: "set pcolor %1",
    args0: [{
        type: "input_value",
        name: "VALUE",
        check: "Color",
    }],
    colour: "#795548",
    for: (block, generator) => {
        const value = generator.valueToCode(block, "VALUE", 0) || "0";
        return `set pcolor ${value}`;
    }
});

const oneOf: BlockDefinition = createValueBlock("one_of", "Color", {
    message0: "one-of %1",
    args0: [{
        type: "input_value",
        name: "LIST",
        check: "Array",
    }],
    colour: "#795548",
    for: (block, generator) => {
        const list = generator.valueToCode(block, "LIST", 0);
        return [`one-of ${list}`, 0];
    }
});
const colorBlocks: BlockDefinition[] = [
    color,
    setTurtleColor,
    setPatchColor,
    oneOf,
];
export default colorBlocks;
