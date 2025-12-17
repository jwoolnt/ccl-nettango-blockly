import * as Blockly from "blockly";

/**
 * Inserts default NetLogo procedures into an empty workspace.
 * Adds a `setup` and a `go` procedure with basic positioning.
 */
export function createDefaultProcedures(workspace: Blockly.WorkspaceSvg) {
  const setupBlock = workspace.newBlock('procedures_defnoreturn');
  setupBlock.setFieldValue('setup', 'NAME');
  setupBlock.initSvg();
  setupBlock.render();
  setupBlock.moveBy(20, 20);

  const goBlock = workspace.newBlock('procedures_defnoreturn');
  goBlock.setFieldValue('go', 'NAME');
  goBlock.initSvg();
  goBlock.render();
  goBlock.moveBy(20, 150);
}
