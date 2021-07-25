const fs = require('fs')
const sharp = require('sharp')
const pngToIco = require('png-to-ico')

module.exports = function image(args) {

    const defaults = {
        overwrite: true,
        input: 'input.png',
        format: 'jpg',
        background: { r: 255, g: 255, b: 255, alpha: 1 },
        output: [
            {
                output: 'output',
                width: 100,
                height: 100,
                format: 'png',
                background: { r: 255, g: 255, b: 255, alpha: 1 },
            }
        ],
    }

    let options = args.options 

    for(const [key, value] of Object.entries(defaults)) {
        if(options[key] === undefined) {
            options[key] = value
        } 
    }

    const { overwrite, input, format, background } = options

    options.output.forEach(attributes => {
        const { width, height } = attributes
        const bg = attributes.background ? attributes.background : background 
        const extension = attributes.format ? attributes.format : format
        const filename = `${attributes.output}.${extension}`

        if(overwrite || !fs.existsSync(filename)) {
            
            sharp({
                create: {
                    width,
                    height,
                    channels: 4,
                    background: bg
                }
            })
            .png()
            .toBuffer()
            .then(result => {

                const size = (width > height) ? height : width
                sharp(input)
                    .resize(size)
                    .png()
                    .toBuffer()
                    .then(resized => {
                        sharp(result)
                            .composite([
                                {
                                    input: resized
                                }
                            ])
                            .png()
                            .toFile(filename)
                            .then(data => {
                                args._log(`Created ${filename}`)
                            })
                    })
            })
        }
    })
}
