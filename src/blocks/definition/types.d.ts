export type Type =
	| "Boolean"
	| "Number"
	| "Colour"
	| "String"
	| "Array";

export type CheckString = Type | string;

export type Check = null | CheckString | CheckString[]

export type Image = {
	src: string;
	width: number;
	height: number;
	alt: string;
}


export type InputType =
	| "input_value"
	| "input_statement";

export type Input = ArgumentBase<InputType>


export type FieldType =
	| "field_input"
	| "field_dropdown"
	| "field_checkbox"
	| "field_colour"
	| "field_number"
	| "field_angle"
	| "field_variable"
	| "field_image";

type FieldBase<T extends FieldType> = ArgumentBase<T>;

export type TextField = FieldBase<"field_input"> & {
	text?: string;
	spellcheck?: boolean;
};

export type DropdownField = FieldBase<"field_dropdown"> & {
	options: Array<[string | Image, string]>;
};

export type CheckboxField = FieldBase<"field_checkbox"> & {
	checked?: boolean;
};

// plugin field
// export type ColourField = FieldBase<"field_colour"> & {
// 	colour?: string;
// 	colourOptions?: string[];
// 	colourTitles?: string[];
// 	columns: number;
// };

export type NumberField = FieldBase<"field_number"> & {
	value?: number;
	min?: number;
	max?: number;
	precision?: number;
};

// plugin field
// export type AngleField = FieldBase<"field_angle"> & {
// 	value?: number;
// };

export type VariableField = FieldBase<"field_variable"> & {
	variable?: string;
	variableTypes?: Type[];
	defaultType?: Type;
};

export type ImageField = FieldBase<"field_image"> & Image & {
	flipRtl?: boolean;
};

export type Field =
	| TextField
	| DropdownField
	| CheckboxField
	// | ColourField // plugin field
	| NumberField
	// | AngleField // plugin field
	| VariableField
	| ImageField;


type ArgumentBase<T extends string> = {
	type: T;
	check?: Check;
	name?: string;
	alt?: Argument;
}

export type Argument = Input | Field;


export type BlockFunction = (block: Block, generator: Generator) => string | [string, number];

export interface BlockDefinition {
	type: string;
	message0: string;
	args0?: Argument[];
	implicitAlign0?: "LEFT" | "CENTRE" | "RIGHT";
	// [key: `message${number}`]: string; //supports message0...messageN
	// [key: `args${number}`]: Field[]; // supports args0...argsN
	// [key: `implicitAlign${number}`]: "LEFT" | "CENTRE" | "RIGHT"; // supports implicitAlign0...implicitAlignN
	inputsInline?: boolean;
	nextStatement?: Check;
	previousStatement?: Check;
	output?: null | Type;
	tooltip?: string;
	helpUrl?: string;
	mutator?: string;
	// custom properties
	for?: BlockDefinition;
}
