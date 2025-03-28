interface Block {
	kind: 'block';
	type: string;
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
					type: "create_breeds"
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
					type: "ask_agent_set"
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
			name: "Data",
			contents: [{
				kind: "category",
				name: "Operators",
			},
			{
				kind: "category",
				name: "Math",
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
			}]
		},
		{
			kind: "category",
			name: "Other",
			contents: [{
				kind: "category",
				name: "Plotting",
			},
			{
				kind: "category",
				name: "Input/Output",
			},
			{
				kind: "category",
				name: "Behaviour Space",
			},
			{
				kind: "category",
				name: "System",
			},
			{
				kind: "category",
				name: "File",
			},
			{
				kind: "category",
				name: "Hubnet",
			}]
		}
	]
};


export default toolbox;
