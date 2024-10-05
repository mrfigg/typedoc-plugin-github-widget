# typedoc-plugin-github-widget

A plugin for TypeDoc that adds a Github widget to the header.

## Example

A basic example is available at [https://mrfigg.github.io/typedoc-plugin-github-widget](https://mrfigg.github.io/typedoc-plugin-github-widget).

## Installation

```sh
$ npm install -D typedoc-plugin-github-widget
```

## Options

The following options are added to TypeDoc when the plugin is installed:

| Option                 | Type   | Default     | Description                                                                                                   |
| ---------------------- | ------ | ----------- | ------------------------------------------------------------------------------------------------------------- |
| **githubWidgetUrl**    | string | `undefined` | The URL of the Github repository. If not specified, it will be inferred from the project's package.json file. |
| **githubWidgetTarget** | string | `"_blank"`  | The target attribute for the Github widget link.                                                              |
