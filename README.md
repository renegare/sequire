# Sequire

require modules from the root of your application without the ../../{im lost notation}

## Installation

```
npm install sequire
```

## Usage

```
var src = require('sequire')
var mod = src('something/from/nearest/parent/folder/with/package.json');
```

### OR

This will return an absolute path to the module (?)

```
var src = require('sequire')
var modAbsolutePath = src('something/from/nearest/parent/folder/with/package.json', true);
```

## Thoughts ...

? Maybe it should return a relative path from calling file?
