# How to use this container
This container takes in a bunch of images and formats them using sharp.js. for the container to find your files, map a volume (-v) to `/app/images` in the container. 

## Images folder structure
the images folder you have should have the following
``` 
mainDirectory
| -- in
```
the `in` folder is the images you want to format. 

during the formatting process, the container will automatically create an `out` file in the same images directory with the output of the optimization process.

## Default Settings
by default the image width is set to 1800px and the quality is set to 65%. If you would like to change these, use the environment variables by setting `IMG_WIDTH` and `IMG_QUALITY` in your `docker run` command. 


### Examples

basic command
`docker run --rm -v $(pwd)/images:/app/images iamasek/image-optimizer`

command with width set
`docker run --rm -v -e IMG_WIDTH=2400 $(pwd)/images:/app/images iamasaek/image-optimizer`

command with quality set
`docker run --rm -v -e IMG_QUALITY=55 $(pwd)/images:/app/images iamasaek/image-optimizer`