import { common } from 'blockly/core';

const netlogoColors = [
    ["black", "0"],
    ["gray", "5"],
    ["white", "9.9"],
    ["red", "15"],
    ["orange", "25"],
    ["yellow", "45"],
    ["green", "55"],
    ["blue", "95"],
    ["violet", "105"],
    ["pink", "125"]
];

const set_turtle_color = {
    type: "set_turtle_color",
    message0: "set color %1",
    args0: [{
        type: "field_dropdown",
        name: "VALUE",
        options: netlogoColors
    }],
    previousStatement: null,
    nextStatement: null,
};

const set_patch_color = {
    type: "set_patch_color",
    message0: "set pcolor %1",
    args0: [{
        type: "field_dropdown",
        name: "VALUE",
        options: netlogoColors
    }],
    previousStatement: null,
    nextStatement: null,
};


const color_list_block = {
    type: "color_list",
    message0: "list of colors %1",
    args0: [{
        type: "input_statement",
        name: "COLOR_ITEMS"
    }],
    output: "Array", // Specifies that this block outputs an array
};

const one_of_block = {
    type: "one_of",
    message0: "one-of %1",
    args0: [{
        type: "input_value",
        name: "LIST",
        check: "Array" // Ensures it only accepts an array input
    }],
    output: "Color", // Specifies that this block returns a color
};

// Register both blocks in Blockly
export default common.createBlockDefinitionsFromJsonArray([
    set_turtle_color,
    set_patch_color,
    color_list_block,
    one_of_block
]);