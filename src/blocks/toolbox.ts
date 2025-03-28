interface Block {
	kind: 'block';
	type: string;
	inputs?: Record<string, {
		"block": {
			type: string;
			fields?: Record<string, any>;
		}
	}>;
	fields?: Record<string, any>;
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
							"block": {
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
					type: "ask_agent_set" // TODO: add default block value
				},
				{
					kind: "block",
					type: "if_"
				},
				{
					kind: "block",
					type: "ifelse"
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
				type: "exponentiation",
				inputs: {
					"A": {
						"block": {
							type: "number",
							fields: {
								"NUMBER": 1
							}
						}
					},
					"B": {
						"block": {
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
						"block": {
							type: "number",
							fields: {
								"NUMBER": 1
							}
						}
					},
					"B": {
						"block": {
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
						"block": {
							type: "number",
							fields: {
								"NUMBER": 1
							}
						}
					},
					"B": {
						"block": {
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
						"block": {
							type: "number",
							fields: {
								"NUMBER": 0
							}
						}
					},
					"B": {
						"block": {
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
						"block": {
							type: "number",
							fields: {
								"NUMBER": 0
							}
						}
					},
					"B": {
						"block": {
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
		},
		{
			kind: "category",
			name: "Agentsets",
		},
		{
			kind: "category",
			name: "Lists",
		}
	]
};


export default toolbox;
