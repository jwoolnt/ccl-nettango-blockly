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

const set_property_block = {
    type: "set_color",
    message0: "set %1 to %2",
    args0: [{
        type: "field_dropdown",
        name: "PROPERTY",
        options: [
            ["color", "color"],  // turtles: the first is label shown in the dropdown, the second is the actual value
            ["pcolor", "pcolor"]  // patches
        ]
    }, {
        type: "field_dropdown",
        name: "VALUE",
        options: netlogoColors
    }],
    previousStatement: null,
    nextStatement: null,
    colour: 230  //
};

// Register the block in Blockly
export default common.createBlockDefinitionsFromJsonArray([
    set_property_block,
]);
