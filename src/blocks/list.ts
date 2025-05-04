// src/blocks/list_blocks.ts
import { BlockDefinition } from "./definition/types";
import { createValueBlock, createStatementBlock } from "./definition/utilities";
import { ListRegistry } from "./ui/list_registry";
import { DropdownFieldOption } from "./definition/types";

function createListDropdown() {
    return {
        type: "field_dropdown" as const,
        name: "LIST_NAME",
        options: function (): DropdownFieldOption[] {
            const lists = ListRegistry.getAllLists();
            if (lists.length === 0) {
                return [["No lists", "No lists"]];
            }
            return lists.map(name => [name, name] as [string, string]);
        }
    };
}

// List Item Block - represents an item in a list at a specific index
const listItemBlock: BlockDefinition = createValueBlock("list_item", ["any"], {
    message0: "item %1 of %2",
    args0: [
        {
            type: "input_value",
            name: "INDEX",
            check: "Number"
        },
        createListDropdown()
    ],
    tooltip: "Gets an item at the specified index from the list",
    helpUrl: "",
    for: (block, generator) => {
        const index = generator.valueToCode(block, "INDEX", 0) || "1";
        const listName = block.getFieldValue("LIST_NAME");
        return [`item ${index} of ${listName}`, 0];
    }
});

// Add Item to List Block
const addToListBlock: BlockDefinition = createStatementBlock("add_to_list", {
    message0: "add %1 to %2",
    args0: [
        {
            type: "input_value",
            name: "ITEM",
            check: null // Accept any type
        },
        createListDropdown()
    ],
    tooltip: "Adds an item to the end of the list",
    helpUrl: "",
    for: (block, generator) => {
        const item = generator.valueToCode(block, "ITEM", 0) || "0";
        const listName = block.getFieldValue("LIST_NAME");
        return `add ${item} to ${listName}`;
    }
});

// Delete Item from List Block
const deleteFromListBlock: BlockDefinition = createStatementBlock("delete_from_list", {
    message0: "delete item %1 of %2",
    args0: [
        {
            type: "input_value",
            name: "INDEX",
            check: "Number"
        },
        createListDropdown()
    ],
    tooltip: "Deletes the item at the specified index from the list",
    helpUrl: "",
    for: (block, generator) => {
        const index = generator.valueToCode(block, "INDEX", 0) || "1";
        const listName = block.getFieldValue("LIST_NAME");
        return `delete item ${index} of ${listName}`;
    }
});

// Clear List Block - removes all items from a list
const clearListBlock: BlockDefinition = createStatementBlock("clear_list", {
    message0: "clear %1",
    args0: [
        createListDropdown()
    ],
    tooltip: "Removes all items from the list",
    helpUrl: "",
    for: (block, generator) => {
        const listName = block.getFieldValue("LIST_NAME");
        return `clear ${listName}`;
    }
});

// List of all list blocks
const listBlocks = [
    listItemBlock,
    addToListBlock,
    deleteFromListBlock,
    clearListBlock
];

export default listBlocks;