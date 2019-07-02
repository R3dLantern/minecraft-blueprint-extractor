# minecraft-blueprint-extractor
Node script to extract Minecraft structure block files and translate them into Gamepedia materials and blueprint editor code.
Specifically designed to supply structure data to the [New Village](https://minecraft.gamepedia.com/Minecraft_Wiki:Projects/Structure_Blueprints/New_Village) page.

## Installation
You can download a compiled executable for your operating system of choice from the [Releases](https://github.com/scarcloud/minecraft-blueprint-extractor/releases) page. There will be more executable for more operating systems. Based on your operating system, you can then assign a PATH variable to access it from anywhere.

## Usage
`minecraft-extract -f|--file <input file path> [-o|--output <output file path>] [-v|--verbose]`

The standard output file path is gonna be `./output/output.txt`.
If `-v|--verbose` is specified, the script will also generate the simplified data object as a JSON file to `.output/simplified-data.json`.

## Agenda
* Look up missing materials
* Extends binaries choice
* Add testing