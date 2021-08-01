const fs = require('fs')
const sharp = require('sharp')
const mkdirp = require('mkdirp')
const path = require('path')
const pngToIco = require('png-to-ico')

module.exports = function image(ox) {

    const default_output = {
        output: 'output',
        inner_width: 50,
        inner_height: 50,
        width: 100,
        height: 100,
        format: 'png',
        background: { r: 255, g: 255, b: 255, alpha: 1 },
    }

    const default_config = {
        overwrite: true,
        input: 'input.png',
        format: 'jpg',
        background: { r: 255, g: 255, b: 255, alpha: 1 },
        output: [
            default_output
        ],
    }

    let options = ox.options 

    for(const [key, value] of Object.entries(default_config)) {
        if(options[key] === undefined) {
            options[key] = value
        } 
    }

    const { overwrite, input, format, background } = options

    async function setupImage(attributes) {

        for(const [key, value] of Object.entries(default_output)) {
            if(attributes[key] === undefined) {
                attributes[key] = value
            } 
        }

        const filename = `${attributes.output}.${attributes.format}`

        let pathname = attributes.output.split('/')
        pathname.pop()
        pathname = pathname.join('/')

        if(overwrite || !fs.existsSync(pathname)) {

            let message = overwrite ? `Overwrite was set. Regenerating images...` : `${pathname} didn't exist, we are creating it for you.`
            ox._log(message)

            mkdirp.sync(pathname)

            // Create a new image with the implied config
            const shell = await sharp({
                    create: {
                        width: attributes.width,
                        height: attributes.height,
                        channels: 4,
                        background: attributes.background 
                    }
                })
                .png()
                .toBuffer()

            // Resize the original image
            const resized = await sharp(input) 
                .resize(attributes.inner_width, attributes.inner_height)
                .png()
                .toBuffer()

            // Join the two images 
            const final = await sharp(shell)
                .composite([
                    {
                        input: resized
                    }
                ])
                .png()
                .toFile(filename)

            ox._log(`Created ${filename}`)
        }
    }

    options.output.forEach(setupImage)

}
