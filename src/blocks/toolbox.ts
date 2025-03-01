interface Block {
    kind: 'block';
    type: string;
}

interface Category {
    kind: 'category';
    name: string;
    contents: Block[];
}

interface Toolbox {
    kind: 'categoryToolbox';
    contents: Category[];
}

export const toolbox: Toolbox = {
    kind: 'categoryToolbox',
    contents: [
        {
            kind: 'category',
            name: 'Observer',
            contents: [
                { kind: 'block', type: 'clear_all' },
                { kind: 'block', type: 'reset_ticks' },
                { kind: 'block', type: 'setup' },
                { kind: 'block', type: 'go' },
                { kind: 'block', type: 'to' }
            ],
        },
        {
            kind: 'category',
            name: 'Agent',
            contents: [
                { kind: 'block', type: 'create_breeds' },
                { kind: 'block', type: 'ask_agent_set' },
                { kind: 'block', type: 'die' }
            ],
        },
        {
            kind: 'category',
            name: 'Turtles',
            contents: [
                { kind: 'block', type: 'set_turtle_color' }
            ],
        },
        {
            kind: 'category',
            name: 'Patches',
            contents: [
                { kind: 'block', type: 'set_patch_color' },
                { kind: 'block', type: 'one_of' }
            ],
        },
        {
            kind: 'category',
            name: 'Control',
            contents: [
                { kind: 'block', type: 'if_block' },
                { kind: 'block', type: 'if_else_block' }
            ],
        },
        {
            kind: 'category',
            name: 'Operators',
            contents: [
                { kind: 'block', type: 'operator_equals' },
                { kind: 'block', type: 'operator_not_equals' },
                { kind: 'block', type: 'operator_greater_than' },
                { kind: 'block', type: 'operator_less_than' },
                { kind: 'block', type: 'operator_and' },
                { kind: 'block', type: 'operator_or' },
                { kind: 'block', type: 'operator_not' },
                { kind: 'block', type: 'operator_add' },
                { kind: 'block', type: 'operator_subtract' },
                { kind: 'block', type: 'operator_multiply' },
                { kind: 'block', type: 'operator_divide' },
                { kind: 'block', type: 'operator_random' }
            ],
        }
    ],
};