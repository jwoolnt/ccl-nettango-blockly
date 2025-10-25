# NetTango (Blockly)

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Blockly](https://img.shields.io/badge/Blockly-11.2-green.svg)](https://developers.google.com/blockly)
[![Vite](https://img.shields.io/badge/Vite-6.2-purple.svg)](https://vitejs.dev/)

A modern, web-based visual programming environment for NetLogo, built with Blockly and TypeScript. This project is a complete re-write of [NetTango](https://github.com/NetLogo/NetTango) using Google's [Blockly](https://developers.google.com/blockly) framework.

## 🌟 Features

### Visual Programming Interface
- **Drag-and-Drop Blocks**: Intuitive block-based programming interface
- **Real-time Code Generation**: Live preview of generated NetLogo code
- **Syntax Highlighting**: Clean, readable code output
- **Workspace Management**: Save, load, and share your projects

### NetLogo Integration
- **Complete NetLogo Support**: All major NetLogo primitives and constructs
- **Procedure Definitions**: Create custom procedures with parameters
- **Agent Operations**: Turtle, patch, and link operations
- **Mathematical Operations**: Full math block library
- **Logic & Control**: Conditional statements, loops, and control flow

### Advanced Features
- **Lexical Variables**: Proper variable scoping and management
- **Dynamic Block Loading**: Domain-specific block sets
- **Custom Themes**: Beautiful, modern UI with customizable colors
- **File Operations**: Import/export workspace files
- **Responsive Design**: Works on desktop and tablet devices

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ccl-nettango.git
   cd ccl-nettango
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173` to start programming!

### Building for Production

```bash
npm run build
npm run preview
```

## 📚 Usage Guide

### Creating Your First Program

1. **Start with the Observer**: Use observer blocks like `clear-all` and `reset-ticks`
2. **Create Agents**: Use turtle blocks like `create-breed` to spawn agents
3. **Add Movement**: Use movement blocks like `forward`, `left`, `right`
4. **Define Procedures**: Create custom procedures using the Control blocks
5. **Add Logic**: Use conditional blocks like `if` and `ifelse`

### Block Categories

#### 🎯 **Observer Blocks**
- `clear-all` - Clear all agents and reset the world
- `reset-ticks` - Reset the tick counter
- `tick` - Advance the simulation by one tick

#### 🐢 **Turtle Blocks**
- `create-breed` - Create turtles of a specific breed
- `hatch` - Create offspring from existing turtles
- `forward/back` - Move turtles forward or backward
- `left/right` - Turn turtles left or right
- `setxy` - Set turtle position to specific coordinates
- `die` - Remove turtles from the simulation

#### 🧮 **Math Blocks**
- Basic arithmetic: `+`, `-`, `*`, `/`, `^`
- Random numbers: `random`, `random-float`
- Comparison: `=`, `!=`, `<`, `<=`, `>`, `>=`
- Rounding: `round`

#### 🔗 **Logic & Control**
- Boolean operations: `and`, `or`, `not`, `xor`
- Conditional statements: `if`, `ifelse`
- Procedure definitions: `to` procedures
- Variable operations: `let`, `set`, `get`

#### 📊 **Data Structures**
- **Lists**: Create, manipulate, and query lists
- **Agentsets**: Work with collections of agents
- **Variables**: Global and local variable management

### Procedure Programming

NetTango supports NetLogo's procedure system:

```netlogo
to setup
  clear-all
  create-turtles 100
  reset-ticks
end

to go
  ask turtles [
    forward 1
    right random 360
  ]
  tick
end
```

## 🏗️ Architecture

### Project Structure

```
ccl-nettango/
├── src/
│   ├── blocks/           # Block definitions and utilities
│   │   ├── types.ts      # TypeScript type definitions
│   │   ├── toolbox.ts    # Block toolbox configuration
│   │   ├── logic.ts      # Logic and control blocks
│   │   ├── turtles.ts    # Turtle-related blocks
│   │   ├── math.ts       # Mathematical operation blocks
│   │   └── utilities.ts  # Block creation utilities
│   ├── services/         # Core services
│   │   ├── generator.ts  # NetLogo code generation
│   │   └── serializer.ts # Workspace serialization
│   ├── data/            # Data management
│   │   └── context.ts   # Variable and agent context
│   ├── main.ts          # Application entry point
│   └── sidebar.ts       # Sidebar functionality
├── assets/              # Static assets
├── index.html           # Main HTML file
└── index.css           # Global styles
```

### Key Components

#### Block System
- **BlockDefinition**: TypeScript interfaces for block configuration
- **Code Generation**: Each block has a `for` function that generates NetLogo code
- **Toolbox**: Organized block categories for easy access

#### Code Generator
- **NetLogo Generator**: Converts block structures to NetLogo syntax
- **Procedure Support**: Handles procedure definitions and calls
- **Variable Management**: Proper variable scoping and naming

#### Workspace Management
- **Serialization**: Save and load workspace configurations
- **File Operations**: Import/export project files
- **State Management**: Maintain workspace state across sessions

## 🛠️ Development

### Adding New Blocks

1. **Define the Block** in the appropriate category file (e.g., `turtles.ts`)
2. **Add to Toolbox** in `toolbox.ts`
3. **Implement Code Generation** with a `for` function
4. **Export** from the blocks index

Example:
```typescript
const newBlock: BlockDefinition = createStatementBlock("new_block", {
    message0: "new command %1",
    args0: [{
        type: "input_value",
        name: "PARAM",
        check: "Number"
    }],
    colour: "#FF6B6B",
    for: (block, generator) => {
        const param = generator.valueToCode(block, "PARAM", Order.NONE);
        return `new-command ${param}`;
    }
});
```

### Custom Themes

The application supports custom Blockly themes defined in `main.ts`:

```typescript
const customTheme = Blockly.Theme.defineTheme('customTheme', {
    name: 'customTheme',
    blockStyles: {
        procedure_blocks: {
            colourPrimary: '#673AB7' // Purple for procedures
        },
        // ... other block styles
    }
});
```

### Domain-Specific Blocks

The system supports loading domain-specific block sets:

```typescript
// In blocks/domain.ts
export function updateWorkspaceForDomain(workspace, domain, callback) {
    // Load domain-specific blocks
}
```

```bash
# Run development server
npm run dev

# Build and preview
npm run build
npm run preview
```

## 📋 Roadmap

### Planned Features
- [ ] **Enhanced Procedure Support**: Return value procedures (`to-report`)
- [ ] **Advanced Loops**: `repeat`, `while`, `foreach` blocks
- [ ] **File I/O**: Import/export data files
- [ ] **Custom Block Creation**: User-defined block creation interface
- [ ] **Collaboration**: Real-time collaborative editing
- [ ] **Mobile Support**: Touch-optimized interface
- [ ] **Accessibility**: Screen reader and keyboard navigation support

### Known Issues
- Return value procedures are currently commented out
- Some advanced NetLogo primitives need implementation
- Mobile responsiveness could be improved

## 📖 Documentation

### API Reference
- [Blockly Documentation](https://developers.google.com/blockly)
- [NetLogo Programming Guide](https://ccl.northwestern.edu/netlogo/docs/programming.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
---

**Happy Programming with NetTango! 🎉**