# ox-task-image

ox-task-image is a task for the ox task runner using sharp to make and resize images.

The example below will resize input.png to 50x50 and place it in the center of a new png named 'output' with the dimensions 200x100.

``` js
ox._add(image)

ox.image({
    options: {
        input: './src/images/input.png',
        output: [
            {
                output: './build/output',
                format: 'png',
                inner_width: 50,
                inner_height: 50,
                width: 200,
                height: 100,
                background: { r: 255, g: 255, b: 255, alpha: 0 },
            }
        ]
    }
})
```