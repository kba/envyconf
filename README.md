# envyconf

> Environment variable zero-config configuration in Node.js and Browser

## Motivation

Configuration is tedious. Worrying about file locations, data formats and
reacting to change is complex in Node. It gets even harder when developing code
shared between Node and Browser.

envyconf is a simplistic approach:

* Use only environment variables for configuration. Browser-side, use `window`,
  in Node use `process.env`.
* To avoid naming conflicts, use a unique prefix for variable names.  Export a
* single method that can optionally pass defaults to be set unless already
  specified.
* Receive all key-value pairs with the unique prefix, sans the prefix.

## Example

In the browser, `envyConf` is available in `window` after loading the script.
In Node.JS/Webpack, it can be loaded as a CommonJS or es6 module.

```js
const {envyConf} = require('envyconf')
// or
import {envyConf} from 'envyconf'
```

```js

```

Running this in Node.JS:
```sh
MYAPP_BAR='metasyntax' node -e "console.log(envyConf('MYAPP', {FOO: '42'}))"
# {FOO: 42, BAR: 'metasyntax'}
````

The same in Browser:

```js
window.MYAPP_BAR='metasyntax'
console.log(envyConf('MYAPP', {FOO: '42'}))
// {FOO: 42, BAR: 'metasyntax'}
```

