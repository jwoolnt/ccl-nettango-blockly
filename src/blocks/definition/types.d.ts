import { Block, CodeGenerator } from "blockly";


export type ValueType =
	| "Boolean"
	| "Number"
	| "Color"
	| "String"
	| "List"
	| "Agent"
	| "Agentset"
	| "Array";

export type CheckValue = null | ValueType | ValueType[] | Array | string | string[];

export type CheckStatement = null | string | string[];

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
	variableTypes?: ValueType[];
	defaultType?: ValueType;
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
	message1?: string;
	message2?: string;
	message3?: string;
	args0?: Argument[];
	args1?: Argument[];
	args2?: Argument[];
	args3?: Argument[];
	implicitAlign0?: "LEFT" | "CENTRE" | "RIGHT";
	// [key: `message${number}`]: string; //supports message0...messageN
	// [key: `args${number}`]: Field[]; // supports args0...argsN
	// [key: `implicitAlign${number}`]: "LEFT" | "CENTRE" | "RIGHT"; // supports implicitAlign0...implicitAlignN
	inputsInline?: boolean;
	nextStatement?: CheckStatement;
	previousStatement?: CheckStatement;
	output?: null | ValueType;
	tooltip?: string;
	helpUrl?: string;
	color?: number;
	mutator?: string;
	extensions?: string[] | string;
	check?: CheckValue | CheckValue[];
	style?: string;
	// custom properties
	for: BlockFunction;
}
