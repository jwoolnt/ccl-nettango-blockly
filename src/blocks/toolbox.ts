// 
// Type definitions for Toolbox structure
// 
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
        // ============================================
        // SIMULATION CONTROL
        // ============================================
        {
            kind: "category",
            name: "Observer",
            colour: "#5E35B1", // Deep Purple
            contents: [
                {
                    kind: "block",
                    type: "clear_all"
                },
                {
                    kind: "block",
                    type: "reset_ticks"
                },
                {
                    kind: "block",
                    type: "tick"
                },
            ]
        },

        // ============================================
        // AGENTS
        // ============================================
        {
            kind: "category",
            name: "Turtles",
            colour: "#43A047", // Dark Green
            contents: [
                // Lifecycle
                {
                    kind: "block",
                    type: "create_breeds",
                },
                {
                    kind: "block",
                    type: "sprout_breed",
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
                    type: "die"
                },
                
                // Movement
                {
                    kind: "block",
                    type: "forward",
                    inputs: {
                        "DISTANCE": {
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
                    type: "back",
                    inputs: {
                        "DISTANCE": {
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
                    type: "left",
                    inputs: {
                        "DISTANCE": {
                            "shadow": {
                                type: "number",
                                fields: {
                                    "NUMBER": 90
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
                                    "NUMBER": 90
                                }
                            }
                        }
                    }
                },
                
                // Position
                {
                    kind: "block",
                    type: "setxy",
                    inputs: {
                        "X": {
                            "shadow": {
                                type: "random_xcor"
                            }
                        },
                        "Y": {
                            "shadow": {
                                type: "random_ycor"
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "random_xcor"
                },
                {
                    kind: "block",
                    type: "random_ycor"
                },
            ]
        },
        {
            kind: "category",
            name: "Patches",
            colour: "#6D4C41", // Brown
            contents: [
            ]
        },
        {
            kind: "category",
            name: "Links",
            colour: "#E64A19",
            contents: [
            ]
        },

        // ============================================
        // VISUAL PROPERTIES
        // ============================================
        {
            kind: "category",
            name: "Colors",
            colour: "#F9A825", // Yellow
            contents: [
                {
                    kind: "block",
                    type: "color",
                },
            ]
        },

        // ============================================
        // PROGRAMMING CONSTRUCTS
        // ============================================
        {
            kind: "category",
            name: "Control",
            colour: "#00ACC1", // Cyan
            contents: [
                // Flow Control
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
                },
                {
                    kind: "block",
                    type: "stop",
                },
                
                // Agent Commands
                {
                    kind: "block",
                    type: "ask_agent_set",
                    inputs: {
                        "AGENT_SET": {
                            "shadow": {
                                type: "agentset",
                                fields: {
                                    "AGENT_SET": "turtles"
                                }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "ask_agentset_with",
                    inputs: {
                        "AGENT_SET": {
                            "shadow": {
                                type: "agentset",
                                fields: {
                                    "AGENT_SET": "turtles"
                                }
                            }
                        }
                    }
                },
                
                // Procedures
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
                    type: "call_manual"
                },
                {
                    kind: "block",
                    type: "report"
                },
                
                // Output
                {
                    kind: "block",
                    type: "show"
                },
                {
                    kind: "block",
                    type: "user_message",
                },
                
                // Settings
                {
                    kind: "block",
                    type: "set_default_shape"
                },
            ]
        },
        {
            kind: "category",
            name: "Logic",
            colour: "#FB8C00", // Orange
            contents: [
                // Boolean Values
                {
                    kind: "block",
                    type: "boolean"
                },
                
                // Logical Operators
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
                
                // Comparison Operators
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
                },
            ]
        },
        {
            kind: "category",
            name: "Math",
            colour: "#E53935", // Red
            contents: [
                // Numbers
                {
                    kind: "block",
                    type: "number"
                },
                
                // Arithmetic Operators
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
                    type: "exponentiation",
                    inputs: {
                        "A": {
                            "shadow": {
                                type: "number",
                                fields: {
                                    "NUMBER": 2
                                }
                            }
                        },
                        "B": {
                            "shadow": {
                                type: "number",
                                fields: {
                                    "NUMBER": 2
                                }
                            }
                        }
                    }
                },
                
                // Math Functions
                {
                    kind: "block",
                    type: "round",
                    inputs: {
                        "N": {
                            "shadow": {
                                type: "number",
                                fields: {
                                    "NUMBER": 3.14
                                }
                            }
                        }
                    }
                },
                
                // Random Numbers
                {
                    kind: "block",
                    type: "random",
                    inputs: {
                        "N": {
                            "shadow": {
                                type: "number",
                                fields: {
                                    "NUMBER": 10
                                }
                            }
                        }
                    }
                },
                {
                    kind: "block",
                    type: "random_float",
                    inputs: {
                        "N": {
                            "shadow": {
                                type: "number",
                                fields: {
                                    "NUMBER": 1.0
                                }
                            }
                        }
                    }
                },
                
                // Counting
                {
                    kind: "block",
                    type: "count",
                    inputs: {
                        "AGENT_SET": {
                            "shadow": {
                                type: "agentset",
                                fields: {
                                    "AGENT_SET": "turtles"
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
            colour: "#8E24AA", // Purple
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
                    type: "lexical_variable_get"
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
            ]
        },

        // ============================================
        // DATA STRUCTURES
        // ============================================
        {
            kind: "category",
            name: "Strings",
            colour: "#5E35B1", // Deep Purple
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
            colour: "#1E88E5", // Blue
            contents: [
                // Basic Agentsets
                {
                    kind: "block",
                    type: "agentset"
                },
                {
                    kind: "block",
                    type: "nobody"
                },
                
                // Filtering
                {
                    kind: "block",
                    type: "with_manual",
                    inputs: {
                        "AGENT_SET": {
                            "shadow": {
                                type: "agentset",
                                fields: {
                                    "AGENT_SET": "turtles"
                                }
                            }
                        },
                        "CONDITION": {
                            "shadow": {
                                type: "equal",
                                fields: {
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
                        }
                    }
                },
                {
                    kind: "block",
                    type: "agentset_here"
                },
                
                // Selection
                {
                    kind: "block",
                    type: "one_of",
                },
                {
                    kind: "block",
                    type: "any",
                },
            ]
        },
        {
            kind: 'category',
            name: 'Lists',
            colour: "#00897B", // Teal
            contents: [
                // Creation
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
                
                // Information
                {
                    kind: 'block',
                    type: 'lists_length',
                },
                {
                    kind: 'block',
                    type: 'lists_isEmpty',
                },
                
                // Access
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
                
                // Manipulation
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
        },

        // ============================================
        // ADVANCED/SPECIAL
        // ============================================
        {
            kind: "category",
            name: "Advanced",
            colour: "#607D8B", // Blue Grey
            contents: [
                {
                    "kind": "block",
                    "type": "netlogo_web"
                }
            ]
        }
    ]
};

export default toolbox;