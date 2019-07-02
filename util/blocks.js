String.prototype.toInternalId = function () { return this.toLowerCase().replace(' ', '-'); }
String.prototype.toMinecraftId = function () { return this.toLowerCase().replace(' ', '_'); }

var ignoreStateBlock = { ignoreState: true };
var base = (name, link) => Object.assign({internalId: name.toInternalId(), link: link, text: name});
var basicBlockOddLink = (name, link) => Object.assign({spriteType: 'BlockSprite'}, base(name, link));
var basicBlock = (name) => basicBlockOddLink(name, name);
var basicItemOddLink = (name, link) => Object.assign({spriteType: 'ItemSprite', }, base(name, link));
var basicItem = (name) => basicItemOddLink(name, name);

var axisPropertiesBlock = (block) => Object.assign(block, {Properties: {axis: {x: '%-rot90', y: '%-top' }}});
var defaultPropertyTopBlock = (block) => Object.assign(block, {defaultProperty: '%-top'});
var facingAndMorePropertiesBlock = (block, moreProperties) => Object.assign(
    block,
    {Properties: Object.assign({facing: {north: '%', east: '%-rot90', south: '%-rot180', west: '%-rot270' }}, moreProperties)}
);
var facingPropertiesBlock = (block) => facingAndMorePropertiesBlock(block, {});
var ignorePropertiesBlock = (block) => Object.assign(block, {ignoreProperties:true});

var bed = (color) => defaultPropertyTopBlock(facingAndMorePropertiesBlock(basicBlockOddLink(color + ' Bed', 'Bed'), {part: {head: '%-head', foot: '%-foot'}}));
var carpet = (color) => basicBlockOddLink(color + ' Carpet', 'Carpet');
var door = (type) => Object.assign(basicItemOddLink(type + ' Door', 'Door'), {Properties: {half: {lower: "%-bottom", upper: "%-top"}}});
var fence = (wood) => ignorePropertiesBlock(basicBlockOddLink(wood + ' Fence', 'Fence'));
var fence_gate = (wood) => ignorePropertiesBlock(basicBlockOddLink(wood + ' Fence Gate', 'Fence Gate'));
var flower = (name) => ignorePropertiesBlock(basicBlockOddLink(name, 'Flower'));
var flowerPot = (text) => basicBlockOddLink(text, 'Flower Pot');
var log = (wood) => axisPropertiesBlock(basicBlockOddLink(wood + ' Log', 'Log'));
var planks = (wood) => basicBlockOddLink(wood + ' Planks', 'Planks');
var pressure_plate = (type) => ignorePropertiesBlock(basicBlockOddLink(type + ' Pressure Plate', 'Pressure Plate'));
var sign = (wood) => ignorePropertiesBlock(basicBlockOddLink(wood + ' Sign', 'Sign'));
var slab = (type) => Object.assign(basicBlockOddLink(type + ' Slab', 'Slab'), {Properties: {type: {double: 'Double %'}}});
var stairs = (type) => facingPropertiesBlock(basicBlockOddLink(type + ' Stairs', 'Stairs'));
var strippedWood = (wood) => basicBlockOddLink('Stripped ' + wood + ' Wood', 'Wood');
var trapdoor = (type) => ignorePropertiesBlock(basicBlockOddLink(type + ' Trapdoor', 'Trapdoor'));
var wall = (type) => ignorePropertiesBlock(basicBlockOddLink(type + ' Wall', 'Wall'));
var wool = (color) => basicBlockOddLink(color + ' Wool', 'Wool');
var wood = (wood) => basicBlockOddLink(wood + ' Wood', 'Wood');

var colorType = function(color) {
    var idPrefix = 'minecraft:' + color + '_',
        typeBlocks = ['Bed', 'Carpet', 'Wool'],
        retVal = {},
        i = 0,
        propName
    ;
    for (i; i < typeBlocks.length; i += 1) {
        propName = idPrefix + typeBlocks[i].toMinecraftId();
        retVal[propName] = eval(typeBlocks[i].toLowerCase() + '(\'' + color + '\')');
    }
    return retVal;
}

var woodType = function (woodName) {
    var idPrefix = 'minecraft:' + woodName.toMinecraftId() + '_',
        strippedWoodProp = 'minecraft:stripped_' + woodName.toMinecraftId() + '_wood',
        woodBlocks = ['door', 'fence', 'fence_gate', 'log', 'planks', 'pressure_plate', 'sign', 'stairs', 'trapdoor', 'wood'],
        i = 0,
        retVal = {},
        propName
    ;
    retVal[strippedWoodProp] = strippedWood(woodName);
    for (i ; i < woodBlocks.length; i += 1) {
        propName = idPrefix + woodBlocks[i];
        retVal[propName] = eval(woodBlocks[i] + '(\'' + woodName + '\')');
    }
    return retVal;
}

global.blockData = Object.assign(
    colorType('Blue'),
    colorType('Purple'),
    colorType('Red'),
    colorType('Yellow'),
    colorType('White'),
    woodType('Acacia'),
    woodType('Oak'),
    woodType('Spruce'),
    woodType('Dark Oak'),
    woodType('Birch'),
    {
    "minecraft:air": ignoreStateBlock,
    "minecraft:bell": ignorePropertiesBlock(basicBlock('Bell')),
    "minecraft:bookshelf": basicBlock('Bookshelf'),
    "minecraft:campfire": basicBlock('Campfire'),
    "minecraft:cartography_table": basicBlockOddLink('Cartography Table'),
    "minecraft:chest": facingPropertiesBlock(basicBlock('Chest')),
    "minecraft:cobblestone": basicBlock('Cobblestone'),
    "minecraft:cobblestone_stairs": stairs('Cobblestone'),
    "minecraft:cobblestone_wall": wall('Cobblestone'),
    "minecraft:crafting_table": basicBlock('Crafting Table'),
    "minecraft:dandelion": flower('Dandelion'),
    "minecraft:dirt": basicBlock('Dirt'),
    "minecraft:fletching_table": basicBlock('Fletching Table'),
    "minecraft:furnace": facingPropertiesBlock(basicBlock('Furnace')),
    "minecraft:glass_pane": Object.assign(basicBlock('Glass Pane'), {Properties: {east: {'true': '%-rot90', 'false': '%' }}}),
    "minecraft:grass": ignoreStateBlock,
    "minecraft:grass_block": defaultPropertyTopBlock(basicBlock('Grass Block')),
    "minecraft:grass_path": defaultPropertyTopBlock(basicBlock('Grass Path')),
    "minecraft:hay_block": axisPropertiesBlock(basicBlock('Hay Block')),
    "minecraft:jigsaw": ignoreStateBlock,
    "minecraft:poppy": flower('Poppy'),
    "minecraft:potted_dandelion": flowerPot('Potted Dandelion'),
    "minecraft:smoker": facingPropertiesBlock(basicBlock('Smoker')),
    "minecraft:smooth_stone_slab": slab('Smooth Stone'),
    "minecraft:structure_void": ignoreStateBlock,
    "minecraft:tall_grass": ignoreStateBlock, // TODO: Reconsider
    "minecraft:torch": { reference: "minecraft:wall_torch" },
    "minecraft:wall_torch": facingPropertiesBlock(basicBlock('Torch')),
    "minecraft:water": ignorePropertiesBlock(basicBlock('Water')),
});