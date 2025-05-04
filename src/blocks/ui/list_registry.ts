
// src/ui/list_registry.ts
export interface NetLogoList {
    name: string;
    contents: any[];
}

// Dispatch list changes event
function dispatchListChange() {
    const event = new CustomEvent('listsChanged');
    window.dispatchEvent(event);
}

export class ListRegistry {
    private static lists: Record<string, any[]> = {};

    // Create a new list
    static createList(name: string) {
        if (!this.lists[name]) {
            this.lists[name] = [];
            dispatchListChange();
        }
    }

    // Get a list by name
    static getList(name: string): any[] | undefined {
        return this.lists[name];
    }

    // Add an element to a list
    static addToList(name: string, element: any) {
        if (this.lists[name]) {
            this.lists[name].push(element);
            dispatchListChange();
        }
    }

    // Delete an item at a specific index (1-based indexing like in NetLogo)
    static deleteItemAt(name: string, index: number) {
        if (this.lists[name] && index > 0 && index <= this.lists[name].length) {
            this.lists[name].splice(index - 1, 1);
            dispatchListChange();
        }
    }

    // Replace an item at a specific index
    static replaceItemAt(name: string, index: number, value: any) {
        if (this.lists[name] && index > 0 && index <= this.lists[name].length) {
            this.lists[name][index - 1] = value;
            dispatchListChange();
        }
    }

    // Insert an item at a specific index
    static insertItemAt(name: string, index: number, value: any) {
        if (this.lists[name] && index > 0 && index <= this.lists[name].length + 1) {
            this.lists[name].splice(index - 1, 0, value);
            dispatchListChange();
        }
    }

    // Get an item at a specific index
    static getItemAt(name: string, index: number): any {
        if (this.lists[name] && index > 0 && index <= this.lists[name].length) {
            return this.lists[name][index - 1];
        }
        return undefined;
    }

    // Clear a list
    static clearList(name: string) {
        if (this.lists[name]) {
            this.lists[name] = [];
            dispatchListChange();
        }
    }

    // Get all list names
    static getAllLists(): string[] {
        return Object.keys(this.lists);
    }

    // Delete a list
    static deleteList(name: string) {
        if (this.lists[name]) {
            delete this.lists[name];
            dispatchListChange();
        }
    }

    // Reset all lists
    static reset() {
        this.lists = {};
        dispatchListChange();
    }
}
