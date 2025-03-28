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
	contents: []
};


export default toolbox;
