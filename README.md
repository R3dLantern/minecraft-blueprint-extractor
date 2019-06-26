# minecraft-blueprint-extractor
Node script to extract Minecraft structure block files and translate them into Gamepedia materials and blueprint editor code.
Specifically designed to supply structure data to the [New Village](https://minecraft.gamepedia.com/Minecraft_Wiki:Projects/Structure_Blueprints/New_Village) page.

## Prerequisites
* [Node.js](https://nodejs.org/en/) 10.6.0 or later
* Node Package Manager (usually installed along with Node.js)
* Command line interface (UNIX shell, Windows cmd / PowerShell, etc.)

## Installation
1. Download or fetch this git repository
2. Open your Command line interface (CLI) of choice
3. In the CLI, move to the repository folder
4. Execute `npm install`

## Usage
`node index -f|--file <input file path> [-v|--verbose] [-o|--output <output file path>]`

The standard output file path is gonna be `./output/output.txt`.
If `-v|--verbose` is specified, the script will also generate the simplified data object as a JSON file to `.output/simplified-data.json`.

## Agenda
* Extend materials data map
* Compile binaries for easier download and use
* Add testing