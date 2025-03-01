import { common } from 'blockly/core';
import { defineLooksBlock } from './define';

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

const looksBlocks = [
    {
        type: "set_turtle_color",
        message0: "set color %1",
        args0: [{ type: "field_dropdown", name: "VALUE", options: netlogoColors }],
        previousStatement: null,
        nextStatement: null
    },
    {
        type: "set_patch_color",
        message0: "set pcolor %1",
        args0: [{ type: "field_dropdown", name: "VALUE", options: netlogoColors }],
        previousStatement: null,
        nextStatement: null
    },
    {
        type: "color_list",
        message0: "list of colors %1",
        args0: [{ type: "input_statement", name: "COLOR_ITEMS", options: undefined, check: undefined }],
        output: "Array"
    },
    {
        type: "one_of",
        message0: "one-of %1",
        args0: [{ type: "input_value", name: "LIST", check: "Array", options: undefined }],
        output: "Color"
    }
].map(block => defineLooksBlock(
    block.type,
    block.message0,
    block.args0 as Array<{ type: string; name: string; options?: [string, string][]; check?: string }>,
    block.previousStatement ?? null,
    block.nextStatement ?? null,
    block.output ?? undefined
));

export default common.createBlockDefinitionsFromJsonArray(looksBlocks);