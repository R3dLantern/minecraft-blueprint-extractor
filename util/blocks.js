String.prototype.toInternalId = function() {
    return this.toLowerCase().replace(' ', '-');
}

var facingProperties = {
    north: '%',
    east: '%-rot90',
    south: '%-rot180',
    west: '%-rot270'
};

var axisProperties = {
    x: '%-rot90',
    y: '%-top'
}

var blockSprite = {
    spriteType: 'BlockSprite'
};

var basicBlock = function (name) {
    return Object.assign(blockSprite, {
        internalId: name.toInternalId(),
        link: name,
        text: name
    });
}

var defaultPropertyTopBlockSprite = function (name) {
    return Object.assign(basicBlock(name), {defaultProperty: '%-top'});
}

var ignorePropertiesBlock = function (name) {
    return Object.assign(basicBlock(name), {ignoreProperties: true});
}

/**
 * @param {string} text
 */
var flowerPot = function (text) {
    return Object.assign(blockSprite, {
        internalId: text.toInternalId(),
        link: 'Flower Pot',
        text: text
    });
};

/**
 * @param {string} wood 
 */
var fence = function (wood) {
    return {
        spriteType: 'BlockSprite',
        internalId: wood.toInternalId() + '-fence',
        link: 'Fence',
        text: wood + ' Fence',
        ignoreProperties: true
    };
};

var slab = function (type) {
    return {
        spriteType: 'BlockSprite',
        internalId: type.toInternalId() + '-slab',
        link: 'Slab',
        text: type + ' Slab',
        Properties: {
            type: {
                double: 'Double %'
            }
        }   
    }
}

/**
 * @param {string} type
 */
var wall = function (type) {
    return {
        spriteType: 'BlockSprite',
        internalId: type.toLowerCase() + '-fence',
        link: 'Wall',
        text: type + ' Wall',
        ignoreProperties: true
    }
}

global.blockData = {
    "minecraft:air": {
        ignoreState: true
    },
    "minecraft:cartography_table": basicBlock('Cartography Table'),
    "minecraft:chest": {
        spriteType: 'BlockSprite',
        internalId: 'chest',
        link: 'Chest',
        text: 'Chest',
        Properties: { facing: facingProperties }
    },
    "minecraft:cobblestone": basicBlock('Cobblestone'),
    "minecraft:cobblestone_stairs": {
        spriteType: 'BlockSprite',
        internalId: 'cobblestone-stairs',
        link: 'Stairs',
        text: 'Cobblestone Stairs',
        Properties: { facing: facingProperties }
    },
    "minecraft:cobblestone_wall": wall('Cobblestone'),
    "minecraft:dandelion": {
        spriteType: 'BlockSprite',
        internalId: 'dandelion',
        link: 'Flower',
        text: 'Dandelion',
        ignorieProperties: true
    },
    "minecraft:dirt": basicBlock('Dirt'),
    "minecraft:fletching_table": basicBlock('Fletching Table'),
    "minecraft:glass_pane": {
        spriteType: 'BlockSprite',
        internalId: 'glass-pane',
        link: 'Glass Pane',
        text: 'Glass Pane',
        Properties: {
            east: {
                "true": '%-rot90',
                "false": '%'
            }
        }
    },
    "minecraft:grass": {
        ignoreState: true
    },
    "minecraft:grass_block": defaultPropertyTopBlockSprite('Grass Block'),
    "minecraft:grass_path": defaultPropertyTopBlockSprite('Grass Path'),
    "minecraft:hay_block": {
        spriteType: 'BlockSprite',
        internalId: 'hay-block',
        link: 'Hay Block',
        text: 'Hay Block',
        Properties: { axis: axisProperties }
    },
    "minecraft:jigsaw": {
        ignoreState: true
    },
    "minecraft:oak_door": {
        spriteType: 'ItemSprite',
        internalId: 'oak-door',
        link: 'Door',
        text: 'Oak Door',
        Properties: {
            half: {
                lower: "%-bottom",
                upper: "%-top"
            }
        }
    },
    "minecraft:oak_fence": fence('Oak'),
    "minecraft:oak_fence_gate": {
        spriteType: 'BlockSprite',
        internalId: 'oak-fence-gate',
        link: 'Fence Gate',
        text: 'Oak Fence Gate',
        ignoreProperties: true
    },
    "minecraft:oak_log": {
        spriteType: 'BlockSprite',
        internalId: 'oak-log',
        link: 'Log',
        text: 'Oak Log',
        Properties: { axis: axisProperties }
    },
    "minecraft:oak_planks": {
        spriteType: 'BlockSprite',
        internalId: 'oak-planks',
        link: 'Planks',
        text: 'Oak Planks'
    },
    "minecraft:oak_pressure_plate": {
        spriteType: 'BlockSprite',
        internalId: 'oak-pressure-plate',
        link: 'Pressure Plate',
        text: 'Oak Pressure Plate',
        ignoreProperties: true
    },
    "minecraft:oak_slab": slab('Oak'),
    "minecraft:oak_stairs": {
        spriteType: 'BlockSprite',
        internalId: 'oak-stairs',
        link: 'Stairs',
        text: 'Oak Stairs',
        Properties: { facing: facingProperties }
    },
    "minecraft:oak_trapdoor": {
        spriteType: 'BlockSprite',
        internalId: 'oak-trapdoor',
        link: 'Trapdoor',
        text: 'Oak Trapdoor',
        ignoreProperties: true
    },
    "minecraft:poppy": {
        spriteType: 'BlockSprite',
        internalId: 'poppy',
        link: 'Flower',
        text: 'Poppy',
        ignorieProperties: true
    },
    "minecraft:potted_dandelion": flowerPot('Potted Dandelion'),
    "minecraft:smoker": {
        spriteType: 'BlockSprite',
        internalId: 'smoker',
        link: 'Smoker',
        text: 'Smoker',
        Properties: { facing: facingProperties }
    },
    "minecraft:smooth_stone_slab": slab('Smooth Stone'),
    "minecraft:stripped_oak_wood": {
        spriteType: 'BlockSprite',
        internalId: 'stripped-oak-wood',
        link: 'Wood',
        text: 'Stripped Oak Wood'
    },
    "minecraft:structure_void": {
        ignoreState: true
    },
    "minecraft:tall_grass": {
        ignoreState: true // TODO: Reconsider
    },
    "minecraft:torch": {
        reference: "minecraft:wall_torch"
    },
    "minecraft:wall_torch": {
        spriteType: 'BlockSprite',
        internalId: 'torch',
        link: 'Torch',
        text: 'Torch',
        Properties: { facing: facingProperties }
    },
    "minecraft:water": ignorePropertiesBlock('Water'),
    "minecraft:white_wool": {
        spriteType: 'BlockSprite',
        internalId: 'white-wool',
        link: 'Wool',
        text: 'White Wool'
    },
    "minecraft:yellow_carpet": {
        spriteType: 'BlockSprite',
        internalId: 'yellow-carpet',
        link: 'Carpet',
        text: 'Yellow Carpet'
    },
    "minecraft:yellow_wool": {
        spriteType: 'BlockSprite',
        internalId: 'yellow-wool',
        link: 'Wool',
        text: 'Yellow Wool'
    }
};