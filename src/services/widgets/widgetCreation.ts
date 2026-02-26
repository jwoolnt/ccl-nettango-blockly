/**
 * Widget creation logic for NetLogo Web
 * Handles creation of sliders and switches for variable control
 */

import { createHiddenSlider, createHiddenSwitch } from "../netlogoAPI";
import { registerWidgetId, hasWidgetId } from "./widgetManager";
import type { VariableControl } from "../../data/context";

/**
 * Create slider and switch widgets for all enabled variable controls
 * variableControls - Map of variable names to their control configurations
 * variableValues - Map of variable names to their current values
 */
export async function createSliderWidgets(
  variableControls: Map<string, VariableControl>,
  variableValues: Map<string, any>
): Promise<void> {
  let slotIndex = 0;

  for (const [variableName, control] of variableControls.entries()) {
    if (control.type === 'slider' && !hasWidgetId(variableName)) {
      const value = variableValues.get(variableName) ?? 0;
      try {
        const id = await createHiddenSlider(
          variableName,
          value as number,
          control.min!,
          control.max!,
          control.step!,
          slotIndex
        );
        registerWidgetId(variableName, id);
        slotIndex++;
      } catch (e) {
        console.warn(`Failed to create slider for '${variableName}':`, e);
      }
    } else if (control.type === 'switch' && !hasWidgetId(variableName)) {
      const value = variableValues.get(variableName) ?? false;
      try {
        const id = await createHiddenSwitch(
          variableName,
          Boolean(value),
          slotIndex
        );
        registerWidgetId(variableName, id);
        slotIndex++;
      } catch (e) {
        console.warn(`Failed to create switch for '${variableName}':`, e);
      }
    }
  }
}
