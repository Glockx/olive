# olive 🫒

**olive** is a CLI tool to generate dummy images for testing, prototyping, or placeholder use.

## Features

- Generate solid color, gradient, or text-based images
- Supports PNG and JPEG formats
- Customizable size, color, font, and more
- Custom font file support
- Fast, concurrent image generation
- Verbose logging for progress tracking

## Installation

```sh
npm install -g olive-cli
```

Or run locally with:

```sh
npx olive-cli [options]
```

## Usage

```sh
olive-cli [options]
```

### Options

| Option                        | Description                                  | Default     |
| ----------------------------- | -------------------------------------------- | ----------- |
| `--count <number>`            | Number of images to generate                 | 1           |
| `--width <number>`            | Image width in pixels                        | 100         |
| `--height <number>`           | Image height in pixels                       | 100         |
| `--size <number>`             | Square image size (overrides width/height)   |             |
| `--type <string>`             | Image type: `solid`, `gradient`, `text`      | solid       |
| `--color <string>`            | Color for solid image (hex or name)          | #808080     |
| `--start-color <string>`      | Gradient start color                         | #ffffff     |
| `--end-color <string>`        | Gradient end color                           | #000000     |
| `--direction <string>`        | Gradient direction: `horizontal`, `vertical` | horizontal  |
| `--text <string>`             | Text content for text type                   | Dummy Image |
| `--font-file <string>`        | Path to custom font file (.ttf, .otf)        |             |
| `--font <string>`             | Font family for text                         | Arial       |
| `--font-size <number>`        | Font size for text                           | 20          |
| `--text-color <string>`       | Text color                                   | #000000     |
| `--background-color <string>` | Background color for text                    | #ffffff     |
| `--format <string>`           | Image format: `png`, `jpeg`                  | png         |
| `--quality <number>`          | JPEG quality (0-100)                         | 80          |
| `--output <string>`           | Output folder                                | .           |
| `--prefix <string>`           | File name prefix                             | dummy       |
| `--verbose`                   | Enable verbose output                        | false       |

## Examples

Generate 5 solid color PNGs of size 200x200:

```sh
olive-cli --count 5 --size 200 --color "#ff6600" --output ./images
```

Generate a vertical gradient JPEG:

```sh
olive-cli --type gradient --direction vertical --start-color "#fff" --end-color "#333" --format jpeg --output ./gradients
```

Generate a text image with custom font:

```sh
olive-cli --type text --text "Hello!" --font "Courier New" --font-size 20 --background-color "#222" --text-color "#fff"
```

Generate a text image with custom font file:

```sh
olive-cli --type text --text "Custom Font!" --font-file "./fonts/custom.ttf" --font "CustomFont" --font-size 24 --output ./custom
```

Generate a horizontal blue-to-green gradient, 400x100 pixels:

```sh
olive-cli --type gradient --width 400 --height 100 --start-color "#00f" --end-color "#0f0" --direction horizontal --output ./gradients
```

Generate a text image with emoji and larger font:

```sh
olive-cli --type text --text "🚀 Launch!" --font-size 20 --width 300 --height 300 --background-color "#fffbe6" --text-color "#222" --output ./emoji
```

## License

MIT
