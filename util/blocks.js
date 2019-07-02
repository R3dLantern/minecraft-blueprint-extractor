String.prototype.toInternalId = () => this.toLowerCase().replace(' ', '-');

var ignoreStateBlock = { ignoreState: true };
var base = (name, link) => new {internalId: name.toInternalId(), link: link, text: name};
var basicBlockOddLink = (name, link) => Object.assign({spriteType: 'BlockSprite'}, base(name, link));
var basicBlock = (name) => basicBlockOddLink(name, name);
var basicItemOddLink = (name, link) => Object.assign({spriteType: 'ItemSprite', }, base(name, link));
var basicItem = (name) => basicItemOddLink(name, name);

var axisPropertiesBlock = (block) => Object.assign(block, {Properties: {axis: {x: '%-rot90', y: '%-top' }}});
var defaultPropertyTopBlock = (block) => Object.assign(block, {defaultProperty: '%-top'});
var facingPropertiesBlock = (block) => Object.assign(block, {Properties: {facing: {north: '%', east: '%-rot90', south: '%-rot180', west: '%-rot270' }}});
var ignorePropertiesBlock = (block) => Object.assign(block, {ignoreProperties:true});

var carpet = (color) => basicBlockOddLink(color + ' Carpet', 'Carpet');
var door = (type) => Object.assign(basicItemOddLink(type + ' Door', 'Door'), {Properties: {half: {lower: "%-bottom", upper: "%-top"}}});
var fence = (wood) => ignorePropertiesBlock(basicBlockOddLink(wood + ' Fence', 'Fence'));
var fenceGate = (wood) => ignorePropertiesBlock(basicBlockOddLink(wood + ' Fence Gate', 'Fence Gate'));
var flower = (name) => ignorePropertiesBlock(basicBlockOddLink(name, 'Flower'));
var flowerPot = (text) => basicBlockOddLink(text, 'Flower Pot');
var log = (wood) => axisPropertiesBlock(basicBlockOddLink(wood + ' Log', 'Log'));
var planks = (wood) => basicBlockOddLink(wood + ' Planks', 'Planks');
var pressurePlate = (type) => ignorePropertiesBlock(basicBlockOddLink(type + ' Pressure Plate', 'Pressure Plate'));
var slab = (type) => Object.assign(basicBlockOddLink(type + ' Slab', 'Slab'), {Properties: {type: {double: 'Double %'}}});
var stairs = (type) => facingPropertiesBlock(basicBlockOddLink(type + ' Stairs', 'Stairs'));
var strippedWood = (wood) => basicBlockOddLink('Stripped ' + wood + ' Wood', 'Wood');
var trapdoor = (type) => ignorePropertiesBlock(basicBlockOddLink(type + ' Trapdoor', 'Trapdoor'));
var wall = (type) => ignorePropertiesBlock(basicBlockOddLink(type + ' Wall', 'Wall'));
var wool = (color) => basicBlockOddLink(color + ' Wool', 'Wool');

global.blockData = {
    "minecraft:air": ignoreStateBlock,
    "minecraft:cartography_table": basicBlockOddLink('Cartography Table'),
    "minecraft:chest": facingPropertiesBlock(basicBlock('Chest')),
    "minecraft:cobblestone": basicBlock('Cobblestone'),
    "minecraft:cobblestone_stairs": stairs('Cobblestone'),
    "minecraft:cobblestone_wall": wall('Cobblestone'),
    "minecraft:dandelion": flower('Dandelion'),
    "minecraft:dirt": basicBlock('Dirt'),
    "minecraft:fletching_table": basicBlock('Fletching Table'),
    "minecraft:glass_pane": Object.assign(basicBlock('Glass Pane'), {Properties: {east: {'true': '%-rot90', 'false': '%' }}}),
    "minecraft:grass": ignoreStateBlock,
    "minecraft:grass_block": defaultPropertyTopBlock(basicBlock('Grass Block')),
    "minecraft:grass_path": defaultPropertyTopBlock(basicBlock('Grass Path')),
    "minecraft:hay_block": axisPropertiesBlock(basicBlock('Hay Block')),
    "minecraft:jigsaw": ignoreStateBlock,
    "minecraft:oak_door": door('Oak'),
    "minecraft:oak_fence": fence('Oak'),
    "minecraft:oak_fence_gate": fenceGate('Oak'),
    "minecraft:oak_log": log('Oak'),
    "minecraft:oak_planks": planks('Oak'),
    "minecraft:oak_pressure_plate": pressurePlate('Oak'),
    "minecraft:oak_slab": slab('Oak'),
    "minecraft:oak_stairs": stairs('Oak'),
    "minecraft:oak_trapdoor": trapdoor('Oak'),
    "minecraft:poppy": flower('Poppy'),
    "minecraft:potted_dandelion": flowerPot('Potted Dandelion'),
    "minecraft:smoker": facingPropertiesBlock(basicBlock('Smoker')),
    "minecraft:smooth_stone_slab": slab('Smooth Stone'),
    "minecraft:stripped_oak_wood": strippedWood('Oak'),
    "minecraft:structure_void": ignoreStateBlock,
    "minecraft:tall_grass": ignoreStateBlock, // TODO: Reconsider
    "minecraft:torch": { reference: "minecraft:wall_torch" },
    "minecraft:wall_torch": facingPropertiesBlock(basicBlock('Torch')),
    "minecraft:water": ignorePropertiesBlock(basicBlock('Water')),
    "minecraft:white_wool": wool('White'),
    "minecraft:yellow_carpet": carpet('Yellow'),
    "minecraft:yellow_wool": wool('Yellow')
};