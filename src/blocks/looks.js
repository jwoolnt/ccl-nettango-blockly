import { common } from 'blockly/core';

const netlogoColors = [
    ["Black", "0"],
    ["Gray", "5"],
    ["White", "9.9"],
    ["Red", "15"],
    ["Orange", "25"],
    ["Yellow", "45"],
    ["Green", "55"],
    ["Blue", "95"],
    ["Violet", "105"],
    ["Pink", "125"]
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

// Register the block in Blockly
export default common.createBlockDefinitionsFromJsonArray([
    set_turtle_color,
    set_patch_color,
    
]);
