import { Block, CodeGenerator } from "blockly";


export type ValueType =
	| "Boolean"
	| "Number"
	| "Color"
	| "String"
	| "List"
	| "Agentset";

export type CheckString = ValueType;

export type CheckValue = null | CheckString | CheckString[]

export type Image = {
	src: string;
	width: number;
	height: number;
	alt: string;
}


export type ArgumentType =
	| "input_value"
	| "input_statement"
	| "field_input"
	| "field_dropdown"
	| "field_checkbox"
	| "field_colour"
	| "field_number"
	| "field_angle"
	| "field_variable"
	| "field_image";

interface ArgumentBase<T extends ArgumentType> {
	type: T;
	check?: CheckValue;
	name?: string;
	alt?: Argument;
}


export type ValueInput = ArgumentBase<"input_value"> & {
	value?: string;
};

export type StatementInput = ArgumentBase<"input_statement">;

export type TextField = ArgumentBase<"field_input"> & {
	text?: string;
	spellcheck?: boolean;
};

export type DropdownFieldOption = [string | Image, string];

export type StaticDropdownFieldOptions = DropdownFieldOption[]

export type DynamicDropdownFieldOptions = () => DropdownFieldOption[];

export type DropdownFieldOptions = StaticDropdownFieldOptions | DynamicDropdownFieldOptions

export type DropdownField = ArgumentBase<"field_dropdown"> & {
	options: DropdownFieldOptions;
};

export type CheckboxField = ArgumentBase<"field_checkbox"> & {
	checked?: boolean;
};

export type NumberField = ArgumentBase<"field_number"> & {
	value?: number;
	min?: number;
	max?: number;
	precision?: number;
};

export type VariableField = ArgumentBase<"field_variable"> & {
	variable?: string;
	variableTypes?: Type[];
	defaultType?: Type;
};

export type ImageField = ArgumentBase<"field_image"> & Image & {
	flipRtl?: boolean;
};


export type Argument =
	| ValueInput
	| StatementInput
	| TextField
	| DropdownField
	| CheckboxField
	| NumberField
	| VariableField
	| ImageField;


export type BlockFunction = (block: Block, generator: CodeGenerator) => string | [string, number] | null;

export interface BlockDefinition {
	type: string;
	message0: string;
	args0?: Argument[];
	implicitAlign0?: "LEFT" | "CENTRE" | "RIGHT";
	// [key: `message${number}`]: string; //supports message0...messageN
	// [key: `args${number}`]: Field[]; // supports args0...argsN
	// [key: `implicitAlign${number}`]: "LEFT" | "CENTRE" | "RIGHT"; // supports implicitAlign0...implicitAlignN
	inputsInline?: boolean;
	nextStatement?: CheckValue;
	previousStatement?: CheckValue;
	output?: null | Type;
	tooltip?: string;
	helpUrl?: string;
	mutator?: string;
	// custom properties
	for: BlockFunction;
}
