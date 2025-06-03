// Type definitions (unchanged)
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
	colour?: string;
	categorystyle?: string;
}

type ToolboxItem = Block | Category;

type ToolboxType = "flyoutToolbox" | "categoryToolbox";

interface ToolboxBase<T extends ToolboxType, I extends ToolboxItem> {
	kind: T;
	contents: I[];
}

type FlyoutToolbox = ToolboxBase<"flyoutToolbox", Block>;

type CategoryToolbox = ToolboxBase<"categoryToolbox", Category>;

type Toolbox = FlyoutToolbox | CategoryToolbox;

const toolbox: Toolbox = {
	kind: 'categoryToolbox',
	contents: [
        {
            kind: "category",
            name: "Observer",
            colour: "#4527A0", // Deep Purple
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
            colour: "#178f49", // Dark Green
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
                    type: "set_turtle_color",
                    inputs: {
                        "VALUE": {
                            "shadow": {
                                type: "color",
                                fields: {
                                    "COLOR": "#000000"
                                }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "die"
                },
                {
                    kind: "block",
                    type: "hatch",
                    inputs: {
                        "COUNT": {
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
                    type: "forward",
                    inputs: {
                        "DISTANCE": {
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
                    type: "back",
                    inputs: {
                        "DISTANCE": {
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
                    type: "left",
                    inputs: {
                        "DISTANCE": {
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
                    type: "right",
                    inputs: {
                        "DISTANCE": {
                            "shadow": {
                                type: "number",
                                fields: {
                                    "NUMBER": 0
                                }
                            }
                        }
                    }
                },
            ]
        },
        {
            kind: "category",
            name: "Patches",
            colour: "#795548", // Brown
            contents: [
                {
                    kind: "block",
                    type: "set_patch_color",
                    inputs: {
                        "VALUE": {
                            "shadow": {
                                type: "color",
                                fields: {
                                    "COLOR": "#000000"
                                }
                            }
                        }
                    }
                },
            ]
        },
        {
            kind: "category",
            name: "Links",
            colour: "#1565C0", // Blue
            contents: []
        },
        {
            kind: "category",
            name: "Colors",
            colour: "#dba70b", // Yellow
            contents: [
                {
                    kind: "block",
                    type: "color",
                },
            ]
        },
        {
            kind: "category",
            name: "Math",
            colour: "#c72216", // Red
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
            name: "Logic",
            colour: "#d6850d", // Orange
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
                    type: "equal",
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
                    type: "not_equal",
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
                    type: "less_than",
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
                    type: "less_than_or_equal_to",
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
                    type: "greater_than",
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
                    type: "greater_than_or_equal_to",
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
                }
            ]
        },
        {
            kind: "category",
            name: "Variables",
            colour: "#9C27B0", // Purple
            contents: [
                {
                    kind: "block",
                    type: "simple_local_declaration_statement",
                    inputs: {
                        "DECL": {
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
                    type: "lexical_variable_set",
                    inputs: {
                        "VALUE": {
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
                    type: "lexical_variable_get"
                }
            ]
        },
        {
            kind: "category",
            name: "Control",
            colour: "#00BCD4", // Cyan
            contents: [
                {
                    kind: "block",
                    type: "procedures_defnoreturn"
                }, 
                {
                    kind: "block",
                    type: "procedures_callnoreturn"
                }, 
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
                    inputs: {
                        "CONDITION": {
                            "shadow": {
                                type: "boolean"
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "ifelse",
                    inputs: {
                        "CONDITION": {
                            "shadow": {
                                type: "boolean"
                            }
                        }
                    }
                }
            ]
        },
        // DATA STRUCTURE CATEGORIES
        {
            kind: "category",
            name: "Strings",
            colour: "#673AB7", // Deep Purple
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
            colour: "#2196F3", // Blue
            contents: [
                {
                    kind: "block",
                    type: "agentset"
                }
            ]
        },
        {
            kind: 'category',
            name: 'Lists',
            colour: "#009688", // Teal
            contents: [
                {
                    kind: "block",
                    type: "one_of",
                },
                {
                    kind: 'block',
                    type: 'lists_create_with',
                },
                {
                    kind: 'block',
                    type: 'lists_repeat',
                    inputs: {
                        NUM: {
                            shadow: {
                                type: 'math_number',
                                fields: {
                                    NUM: 5,
                                },
                            },
                        },
                    },
                },
                {
                    kind: 'block',
                    type: 'lists_length',
                },
                {
                    kind: 'block',
                    type: 'lists_isEmpty',
                },
                {
                    kind: 'block',
                    type: 'lists_indexOf',
                    inputs: {
                        VALUE: {
                            block: {
                                type: 'variables_get',
                            },
                        },
                    },
                },
                {
                    kind: 'block',
                    type: 'lists_getIndex',
                    inputs: {
                        VALUE: {
                            block: {
                                type: 'variables_get',
                            },
                        },
                    },
                },
                {
                    kind: 'block',
                    type: 'lists_setIndex',
                    inputs: {
                        LIST: {
                            block: {
                                type: 'variables_get',
                            },
                        },
                    },
                },
                {
                    kind: 'block',
                    type: 'lists_getSublist',
                    inputs: {
                        LIST: {
                            block: {
                                type: 'variables_get',
                            },
                        },
                    },
                },
                {
                    kind: 'block',
                    type: 'lists_split',
                    inputs: {
                        DELIM: {
                            shadow: {
                                type: 'text',
                                fields: {
                                    TEXT: ',',
                                },
                            },
                        },
                    },
                },
                {
                    kind: 'block',
                    type: 'lists_sort',
                },
                {
                    kind: 'block',
                    type: 'lists_reverse',
                }
            ]
        }
    ]
};

export default toolbox;
