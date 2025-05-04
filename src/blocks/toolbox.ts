type PresetBlockData = {
	type: string;
	fields?: Record<string, any>;
};

type PreconnectedBlock = {
	"block": PresetBlockData
};

type ShadowBlock = {
	"shadow": PresetBlockData
};

type PresetBlock = PreconnectedBlock | ShadowBlock;

type PresetBlocks = Record<string, PresetBlock>;

type PresetFields = Record<string, any>;

interface Block {
	kind: 'block';
	type: string;
	disabled?: boolean;
	inputs?: PresetBlocks;
	fields?: PresetFields;
}

interface Category {
    kind: 'category';
    name: string;
    contents?: ToolboxItem[];
    colour?: string; // Added colour property
}

type ToolboxItem = Block | Category
// TODO: add https://developers.google.com/blockly/guides/configure/web/toolboxes/separators
// TODO: add https://developers.google.com/blockly/guides/configure/web/toolboxes/buttons


type ToolboxType = "flyoutToolbox" | "categoryToolbox"

interface ToolboxBase<T extends ToolboxType, I extends ToolboxItem> {
	kind: T;
	contents: I[];
}


type FlyoutToolbox = ToolboxBase<"flyoutToolbox", Block>

type CategoryToolbox = ToolboxBase<"categoryToolbox", Category>


type Toolbox = FlyoutToolbox | CategoryToolbox


const toolbox: Toolbox = {
    kind: 'categoryToolbox',
    contents: [
        {
            kind: "category",
            name: "Observer",
            colour: "#FFAB19", // Orange
            contents: [
                {
                    kind: "block",
                    type: "clear_all"
                },
                {
                    kind: "block",
                    type: "reset_ticks"
                }
            ]
        },
        {
            kind: "category",
            name: "Turtles",
            colour: "#4CAF50", // Green
            contents: [
                {
                    kind: "block",
                    type: "create_breeds",
                    inputs: {
                        "COUNT": {
                            "shadow": {
                                type: "number",
                                fields: {
                                    "NUMBER": 0
                                }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "die"
                }
            ]
        },
        {
            kind: "category",
            name: "Patches",
            colour: "#2196F3", // Blue
        },
        {
            kind: "category",
            name: "Links",
            colour: "#9C27B0", // Purple
        },
        {
            kind: "category",
            name: "Colors",
            colour: "#FFC107", // Yellow
            contents: [
                {
                    kind: "block",
                    type: "set_turtle_color",
                },
                {
                    kind: "block",
                    type: "set_patch_color",
                },
                {
                    kind: "block",
                    type: "one_of",
                },
                {
                    kind: "block",
                    type: "set_patch_color_one_of",
                },
            ]
        },
        {
            kind: "category",
            name: "Logic",
            colour: "#F44336", // Red
            contents: [
                {
                    kind: "block",
                    type: "boolean"
                },
                {
                    kind: "block",
                    type: "and",
                    inputs: {
                        "A": {
                            "shadow": {
                                type: "boolean",
                                fields: {
                                    "BOOLEAN": "true"
                                }
                            }
                        },
                        "B": {
                            "shadow": {
                                type: "boolean",
                                fields: {
                                    "BOOLEAN": "true"
                                }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "or",
                    inputs: {
                        "A": {
                            "shadow": {
                                type: "boolean",
                                fields: {
                                    "BOOLEAN": "true"
                                }
                            }
                        },
                        "B": {
                            "shadow": {
                                type: "boolean",
                                fields: {
                                    "BOOLEAN": "true"
                                }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "not",
                    inputs: {
                        "A": {
                            "shadow": {
                                type: "boolean",
                                fields: {
                                    "BOOLEAN": "true"
                                }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "xor",
                    inputs: {
                        "A": {
                            "shadow": {
                                type: "boolean",
                                fields: {
                                    "BOOLEAN": "false"
                                }
                            }
                        },
                        "B": {
                            "shadow": {
                                type: "boolean",
                                fields: {
                                    "BOOLEAN": "false"
                                }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "equal"
                },
                {
                    kind: "block",
                    type: "not_equal"
                },
                {
                    kind: "block",
                    type: "less_than"
                },
                {
                    kind: "block",
                    type: "less_than_or_equal_to"
                },
                {
                    kind: "block",
                    type: "greater_than"
                },
                {
                    kind: "block",
                    type: "greater_than_or_equal_to"
                },
            ]
        },
        {
            kind: "category",
            name: "Variables",
            colour: "#3F51B5", // Indigo
            contents: [
                {
                    kind: "block",
                    type: "set_variable"
                },
                {
                    kind: "block",
                    type: "get_variable"
                },
            ]
        },
        {
            kind: "category",
            name: "Control Flow",
            colour: "#FF5722", // Deep Orange
            contents: [
                {
                    kind: "block",
                    type: "ask_agent_set",
                    inputs: {
                        "AGENTSET": {
                            "shadow": {
                                type: "agentset",
                                fields: {
                                    "AGENTSET": "turtles"
                                }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "if_",
                },
                {
                    kind: "block",
                    type: "ifelse",
                }
            ]
        },
        {
            kind: "category",
            name: "Operators",
            colour: "#607D8B", // Blue Grey
            contents: [
                {
                    kind: "block",
                    type: "greater_than",
                },
                {
                    kind: "block",
                    type: "less_than",
                },
                {
                    kind: "block",
                    type: "equal_to",
                },
                {
                    kind: "block",
                    type: "not_equal_to",
                },
                {
                    kind: "block",
                    type: "greater_than_or_equal_to",
                },
                {
                    kind: "block",
                    type: "less_than_or_equal_to",
                },
                {
                    kind: "block",
                    type: "and",
                },
                {
                    kind: "block",
                    type: "or",
                },
                {
                    kind: "block",
                    type: "not",
                },
                {
                    kind: "block",
                    type: "xor",
                },
            ]
        },
        {
            kind: "category",
            name: "Math",
            colour: "#009688", // Teal
            contents: [
                {
                    kind: "block",
                    type: "number"
                },
                {
                    kind: "block",
                    type: "negation",
                    inputs: {
                        "A": {
                            "shadow": {
                                type: "number",
                                fields: {
                                    "NUMBER": 0
                                }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "exponentiation",
                    inputs: {
                        "A": {
                            "shadow": {
                                type: "number",
                                fields: {
                                    "NUMBER": 1
                                }
                            }
                        },
                        "B": {
                            "shadow": {
                                type: "number",
                                fields: {
                                    "NUMBER": 1
                                }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "multiplication",
                    inputs: {
                        "A": {
                            "shadow": {
                                type: "number",
                                fields: {
                                    "NUMBER": 1
                                }
                            }
                        },
                        "B": {
                            "shadow": {
                                type: "number",
                                fields: {
                                    "NUMBER": 1
                                }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "division",
                    inputs: {
                        "A": {
                            "shadow": {
                                type: "number",
                                fields: {
                                    "NUMBER": 1
                                }
                            }
                        },
                        "B": {
                            "shadow": {
                                type: "number",
                                fields: {
                                    "NUMBER": 1
                                }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "addition",
                    inputs: {
                        "A": {
                            "shadow": {
                                type: "number",
                                fields: {
                                    "NUMBER": 0
                                }
                            }
                        },
                        "B": {
                            "shadow": {
                                type: "number",
                                fields: {
                                    "NUMBER": 0
                                }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "subtraction",
                    inputs: {
                        "A": {
                            "shadow": {
                                type: "number",
                                fields: {
                                    "NUMBER": 0
                                }
                            }
                        },
                        "B": {
                            "shadow": {
                                type: "number",
                                fields: {
                                    "NUMBER": 0
                                }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "random",
                    inputs: {
                        "N": {
                            "shadow": {
                                type: "number",
                                fields: {
                                    "NUMBER": 0
                                }
                            }
                        }
                    }
                }
            ]
        },
        {
            kind: "category",
            name: "Strings",
            colour: "#E91E63", // Pink
            contents: [
                {
                    kind: "block",
                    type: "string"
                }
            ]
        },
        {
            kind: "category",
            name: "Agentsets",
            colour: "#795548", // Brown
            contents: [
                {
                    kind: "block",
                    type: "agentset"
                }
            ]
        },
        {
            kind: "category",
            name: "List",
            colour: "#00BCD4", // Cyan
            contents: [
                {
                    kind: "block",
                    type: "list_item",
                    inputs: {
                        "INDEX": {
                            "shadow": {
                                type: "number",
                                fields: {
                                    "NUMBER": 1
                                }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "add_to_list",
                    inputs: {
                        "ITEM": {
                            "shadow": {
                                type: "string",
                                fields: {
                                    "STRING": "item"
                                }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "delete_from_list",
                    inputs: {
                        "INDEX": {
                            "shadow": {
                                type: "number",
                                fields: {
                                    "NUMBER": 1
                                }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "clear_list"
                },
            ]
        },
    ]
};

export default toolbox;
