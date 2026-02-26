/**
 * Widget ID registry
 * Manages mapping between variable names and their NetLogo Web widget IDs
 */

const widgetIds = new Map<string, number>();

export function registerWidgetId(variableName: string, id: number): void {
  widgetIds.set(variableName, id);
}

export function getWidgetId(variableName: string): number | undefined {
  return widgetIds.get(variableName);
}

export function hasWidgetId(variableName: string): boolean {
  return widgetIds.has(variableName);
}

export function clearAllWidgetIds(): void {
  widgetIds.clear();
}

export function getWidgetIds(): Map<string, number> {
  return new Map(widgetIds);
}
