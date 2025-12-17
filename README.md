# NetTango (Blockly)

A block-based programming environment for NetLogo Web, built with Google [Blockly](https://developers.google.com/blockly) framework.

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

### Installation

1. **Clone the repository**
   ```bash
   git clone
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

## 📋 Roadmap

### Planned Features
- [ ]

## 📖 Documentation

### API Reference
- [Blockly Documentation](https://developers.google.com/blockly)
- [NetLogo Programming Guide](https://ccl.northwestern.edu/netlogo/docs/programming.html)