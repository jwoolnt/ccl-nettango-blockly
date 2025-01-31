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
  "kind": "categoryToolbox",
  "contents": [
    {
      "kind": "category",
      "name": "NetLogo",
      "colour": "#5CA65C",
      "contents": [
        { "kind": "block", "type": "setup_block" },
        { "kind": "block", "type": "go_block" },
        { "kind": "block", "type": "ask_block" },
        { "kind": "block", "type": "if_block" },
        { "kind": "block", "type": "move_block" }
      ]
    },
    {
      "kind": "category",
      "name": "Logic",
      "colour": "#5C81A6",
      "contents": [
        { "kind": "block", "type": "controls_if" },
        { "kind": "block", "type": "logic_compare" },
        { "kind": "block", "type": "logic_operation" },
        { "kind": "block", "type": "logic_negate" },
        { "kind": "block", "type": "logic_boolean" }
      ]
    },
    {
      "kind": "category",
      "name": "Loops",
      "colour": "#5CA68D",
      "contents": [
        { "kind": "block", "type": "controls_repeat_ext" },
        { "kind": "block", "type": "controls_whileUntil" },
        { "kind": "block", "type": "controls_for" }
      ]
    },
    {
      "kind": "category",
      "name": "Math",
      "colour": "#5C68A6",
      "contents": [
        { "kind": "block", "type": "math_number" },
        { "kind": "block", "type": "math_arithmetic" },
        { "kind": "block", "type": "math_single" },
        { "kind": "block", "type": "math_trig" },
        { "kind": "block", "type": "math_round" }
      ]
    },
    {
      "kind": "category",
      "name": "Text",
      "colour": "#A65C81",
      "contents": [
        { "kind": "block", "type": "text" },
        { "kind": "block", "type": "text_length" },
        { "kind": "block", "type": "text_join" }
      ]
    },
    {
      "kind": "category",
      "name": "Variables",
      "custom": "VARIABLE",
      "colour": "#A65C5C"
    },
  ]
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