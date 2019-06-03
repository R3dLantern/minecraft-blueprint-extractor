global.materialsDataMap = {
    "minecraft:air": { ignoreState: true },
    "minecraft:jigsaw": { ignoreState: true },
    "minecraft:oak_fence": {
        spriteType: 'BlockSprite',
        internalId: 'oak-fence',
        link: 'Fence',
        text: 'Oak Fence',
        ignoreProperties: true
    },
    "minecraft:stripped_oak_wood": {
        spriteType: 'BlockSprite',
        internalId: 'stripped-oak-wood',
        link: 'Wood',
        text: 'Stripped Oak Wood'
    },
    "minecraft:wall_torch": {
        spriteType: 'BlockSprite',
        internalId: 'torch',
        link: 'Torch',
        text: 'Torch',
        Properties: {
            facing: {
                north: '',
                east: '-rot90',
                south: '-rot180',
                west: '-rot270'
            }
        }
    }
};