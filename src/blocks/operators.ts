import { BlockDefinition } from "./definition/types";
import { createLogicalOperatorBlock, createComparisonOperatorBlock } from "./definition/utilities";

const greaterThan: BlockDefinition = createComparisonOperatorBlock("greater_than", ">");
const lessThan: BlockDefinition = createComparisonOperatorBlock("less_than", "<");
const equalTo: BlockDefinition = createComparisonOperatorBlock("equal_to", "==");
const notEqualTo: BlockDefinition = createComparisonOperatorBlock("not_equal_to", "!=");
const greaterThanOrEqualTo: BlockDefinition = createComparisonOperatorBlock("greater_than_or_equal_to", ">=");
const lessThanOrEqualTo: BlockDefinition = createComparisonOperatorBlock("less_than_or_equal_to", "<=");
const logicalAnd: BlockDefinition = createLogicalOperatorBlock("and");
const logicalOr: BlockDefinition = createLogicalOperatorBlock("or");
const logicalNot: BlockDefinition = createLogicalOperatorBlock("not", false);
const logicalXor: BlockDefinition = createLogicalOperatorBlock("xor");

const booleanBlocks: BlockDefinition[] = [
    greaterThan,
    lessThan,
    equalTo,
    notEqualTo,
    greaterThanOrEqualTo,
    lessThanOrEqualTo,
    logicalAnd,
    logicalOr,
    logicalNot,
    logicalXor,
];
export default booleanBlocks;
