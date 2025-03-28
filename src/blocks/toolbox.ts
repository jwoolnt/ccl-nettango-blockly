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
		},
		{
			kind: "category",
			name: "Links",
		},
		{
			kind: "category",
			name: "Colors",
		},
		{
			kind: "category",
			name: "Logic",
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
				{
					kind: "category",
					name: "Variables"
				},
				{
					kind: "category",
					name: "Control Flow",
					contents: [{
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
					}]
				}
			]
		},
		{
			kind: "category",
			name: "Math",
			contents: [{
				kind: "block",
				type: "number"
			}, {
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
			}, {
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
			}, {
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
			}, {
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
			}, {
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
			}, {
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
			}, {
				kind: "block",
				type: "random"
			}]
		},
		{
			kind: "category",
			name: "Strings",
			contents: [{
				kind: "block",
				type: "string"
			}]
		},
		{
			kind: "category",
			name: "Agentsets",
			contents: [{
				kind: "block",
				type: "agentset"
			}]
		},
		{
			kind: "category",
			name: "Lists",
		}
	]
};


export default toolbox;
