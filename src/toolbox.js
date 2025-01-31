/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/*
This toolbox contains nearly every single built-in block that Blockly offers,
in addition to the custom block 'add_text' this sample app adds.
You probably don't need every single block, and should consider either rewriting
your toolbox from scratch, or carefully choosing whether you need each block
listed here.
*/
export const toolbox = {
  kind: 'categoryToolbox', // Keeps categories
  contents: [
    {
      kind: 'category',
      name: 'Turtles',
      categorystyle: 'netlogo_category',
      contents: [
        { kind: 'block', type: 'setup_block' },
        { kind: 'block', type: 'go_block' },
        { kind: 'block', type: 'ask_block' },
        { kind: 'block', type: 'if_block' },
      ],
    },
    {
      kind: 'category',
      name: 'Patches',
      categorystyle: 'netlogo_category',
      contents: [
        { kind: 'block', type: 'setup_block' },
      ],
    },
    {
      kind: 'category',
      name: 'Events',
      categorystyle: 'netlogo_category',
      contents: [
        { kind: 'block', type: 'setup_block' },
      ],
    },
    {
      kind: 'category',
      name: 'Controls',
      categorystyle: 'netlogo_category',
      contents: [
        { kind: 'block', type: 'setup_block' },
      ],
    },
    {
      kind: 'category',
      name: 'Maths',
      categorystyle: 'netlogo_category',
      contents: [
        { kind: 'block', type: 'setup_block' },
      ],
    },
    {
      kind: 'category',
      name: 'Variables',
      categorystyle: 'netlogo_category',
      contents: [
        { kind: 'block', type: 'setup_block' },
      ],
    },
  ],
};

// export const toolbox = {
//   kind: 'categoryToolbox',
//   contents: [
//     {
//       kind: 'category',
//       name: 'Turtles',
//       categorystyle: 'netlogo_category',
//       contents: [
//         {
//           kind: 'block',
//           type: 'setup_block',
//         },
//         {
//           kind: 'block',
//           type: 'go_block',
//         },
//         {
//           kind: 'block',
//           type: 'ask_block',
//         },
//         {
//           kind: 'block',
//           type: 'if_block',
//         },
//       ],
//     },
//   ],
// };

// ============================
// export const toolbox = {
//   'kind': 'flyoutToolbox',
//   'contents': [
//     {
//       'kind': 'block',
//       'type': 'object'
//     },
//     {
//       'kind': 'block',
//       'type': 'member'
//     },
//     {
//       'kind': 'block',
//       'type': 'math_number'
//     },
//     {
//       'kind': 'block',
//       'type': 'text'
//     },
//     {
//       'kind': 'block',
//       'type': 'logic_boolean'
//     },
//     {
//       'kind': 'block',
//       'type': 'logic_null'
//     },
//     {
//       'kind': 'block',
//       'type': 'lists_create_with'
//     },
//   ]
// }