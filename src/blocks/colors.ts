import { createStatementBlock, createValueBlock, staticOptions } from "./definition/utilities";
import { BlockDefinition } from "./definition/types";

const netlogoColors = staticOptions([
    "black", "gray", "white", "red", "orange", 
    "yellow", "green", "blue", "violet", "pink"
  ]);

const colorBlocks: BlockDefinition[] = [
createStatementBlock("set_turtle_color", {
    message0: "set color %1",
    args0: [{
    type: "field_dropdown",
    name: "VALUE",
    options: netlogoColors
    }],
    for: block => `set color ${block.getFieldValue("VALUE")}`
}),
createStatementBlock("set_patch_color", {
    message0: "set pcolor %1",
    args0: [{
    type: "field_dropdown",
    name: "VALUE",
    options: netlogoColors
    }],
    for: block => `set pcolor ${block.getFieldValue("VALUE")}`
}),
createValueBlock("one_of", "Color", {
    message0: "one-of %1",
    args0: [{
    type: "input_value",
    name: "LIST",
    }],
    for: (block, generator) => {
    const list = generator.valueToCode(block, "LIST", 0);
    return [`one-of ${list}`, 0];
    }
})
];

export default colorBlocks;