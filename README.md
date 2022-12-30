<p align="center">
    <img alt="refinecss-logo" src="https://user-images.githubusercontent.com/64678612/209990236-5c1b0a9b-165e-4236-8270-d1cf0d60a662.png"/>
    <b align="center">Refine CSS - post build unused css remover</b>
    <p align="center" style="align: center;">
        <a href="https://github.com/appzic/refinecss/blob/main/.github/workflows/main.yml">
            <img alt="GitHub Workflow Status" src="https://img.shields.io/github/actions/workflow/status/appzic/refinecss/main.yml">
        </a>
        <a href="https://www.npmjs.com/package/refinecss">
            <img alt="npm" src="https://img.shields.io/npm/v/refinecss">
        </a>
        <a href="https://www.npmjs.com/package/refinecss">
            <img alt="npm" src="https://img.shields.io/npm/dw/refinecss">
        </a>
        <a href="https://github.com/appzic/refinecss/blob/main/LICENSE">
            <img alt="GitHub" src="https://img.shields.io/github/license/appzic/refinecss">
        </a>
    </p>
</p>

## 📖 Table of Contents

- [📖 Table of Contents](#-table-of-contents)
- [🚀 Getting Started](#-getting-started)
  - [Installation](#installation)
  - [Remove unused css](#remove-unused-css)
- [💻 Command-line](#-command-line)
- [🙏 Contributing](#-contributing)
- [❤️ Contributors](#️-contributors)
- [🛡️ License](#️-license)

## 🚀 Getting Started

### Installation

We recommend installing RefineCSS as a dev dependency

```bash
npm i -D refinecss
```

### Remove unused css

After your final build, you can run the following command to remove unused CSS

```
refinecss <build directory>
```

Defalut build directory is `./dir`

After removing unused CSS, the results are displayed on the console.

![refinecss results](https://user-images.githubusercontent.com/64678612/210082324-b7768f87-8154-47a7-914f-6b87b20122ca.png)

## 💻 Command-line

```
Post build unused css remover
Usage: refinecss <directory of final build> [options]

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]

Examples:
  refinecss ./out  with the directory of final build.
                   (default build directory: ./dist)
```

## 🙏 Contributing

If you want to open an issue, create a Pull Request, or simply want to know how you can run it on your local machine, please read the [Contributing Guide](https://github.com/appzic/refinecss/blob/main/CONTRIBUTING.md).

## ❤️ Contributors

<a href="https://github.com/appzic/refinecss/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=appzic/refinecss" />
</a>

## 🛡️ License

refinecss is [MIT](https://github.com/appzic/refinecss/blob/main/LICENSE) licensed.
