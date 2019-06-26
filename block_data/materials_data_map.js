global.materialsDataMap = {
    "minecraft:air": { ignoreState: true },
    "minecraft:cobblestone": {
        spriteType: 'BlockSprite',
        internalId: 'cobblestone',
        link: 'Cobblestone',
        text: 'Cobblestone'
    },
    "minecraft:cobblestone_wall": {
        spriteType: 'BlockSprite',
        internalId: 'cobblestone-wall',
        link: 'Wall',
        text: 'Cobblestone Wall',
        ignoreProperties: true
    },
    "minecraft:dandelion": {
        spriteType: 'BlockSprite',
        internalId: 'dandelion',
        link: 'Flower',
        text: 'Dandelion',
        ignorieProperties: true
    },
    "minecraft:dirt": {
        spriteType: 'BlockSprite',
        internalId: 'dirt',
        link: 'Dirt',
        text: 'Dirt'
    },
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
    "minecraft:grass_block": {
        spriteType: 'BlockSprite',
        internalId: 'grass-block',
        link: 'Grass Block',
        text: 'Grass Block',
        Properties: {
            snowy: {
                "false": '%-top'
            }
        }
    },
    "minecraft:hay_block": {
        spriteType: 'BlockSprite',
        internalId: 'hay-block',
        link: 'Hay_Block',
        text: 'Hay Block',
        Properties: {
            axis: {
                x: '%',
                y: '%-top'
            }
        }
    },
    "minecraft:jigsaw": { ignoreState: true },
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
    "minecraft:oak_fence": {
        spriteType: 'BlockSprite',
        internalId: 'oak-fence',
        link: 'Fence',
        text: 'Oak Fence',
        ignoreProperties: true
    },
    "minecraft:oak_log": {
        spriteType: 'BlockSprite',
        internalId: 'oak-log',
        link: 'Log',
        text: 'Oak Log',
        Properties: {
            axis: {
                x: '%-rot90',
                y: '%-top'
            }
        }
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
    "minecraft:oak_stairs": {
        spriteType: 'BlockSprite',
        internalId: 'oak-stairs',
        link: 'Stairs',
        text: 'Oak Stairs',
        Properties: {
            facing: {
                north: '%',
                east: '%-rot90',
                south: '%-rot180',
                west: '%-rot270'
            }
        }
    },
    "minecraft:potted_dandelion": {
        reference: "minecraft:dandelion"
    },
    "minecraft:smoker": {
        spriteType: 'BlockSprite',
        internalId: 'smoker',
        link: 'Smoker',
        text: 'Smoker',
        Properties: {
            facing: {
                north: '%',
                east: '%-rot90',
                south: '%-rot180',
                west: '%-rot270'
            }
        }
    },
    "minecraft:smooth_stone_slab": {
        spriteType: 'BlockSprite',
        internalId: 'smooth-stone-slab',
        link: 'Slab',
        text: 'Smooth Stone Slab',
        Properties: {
            type: {
                double: 'Double %'
            }
        }
    },
    "minecraft:stripped_oak_wood": {
        spriteType: 'BlockSprite',
        internalId: 'stripped-oak-wood',
        link: 'Wood',
        text: 'Stripped Oak Wood'
    },
    "minecraft:torch": {
        reference: "minecraft:wall_torch"
    },
    "minecraft:wall_torch": {
        spriteType: 'BlockSprite',
        internalId: 'torch',
        link: 'Torch',
        text: 'Torch',
        Properties: {
            facing: {
                north: '%',
                east: '%-rot90',
                south: '%-rot180',
                west: '%-rot270'
            }
        }
    }
};