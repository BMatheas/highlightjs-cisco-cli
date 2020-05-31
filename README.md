# cisco-cli - a language grammar for highlight.js

## Usage

Simply include the Highlight.js library in your webpage or Node app, then load this module.

### Static website or simple usage

Simply load the module after loading Highlight.js.  You'll use the minified version found in the `dist` directory.  This module is just a CDN build of the language, so it will register itself as the Javascript is loaded.

```html
<script type="text/javascript" src="/path/to/highlight.min.js"></script>
<script type="text/javascript" charset="UTF-8"
  src="/path/to/highlightjs-cisco-cli/dist/cisco.min.js"></script>
<script type="text/javascript">
  hljs.initHighlightingOnLoad();
</script>
```

### With Node or another build system

If you're using Node / Webpack / Rollup / Browserify, etc, simply require the language module, then register it with Highlight.js.

```javascript
var hljs = require('highlightjs');
var hljsCiscoCli = require('highlightjs-cisco-cli');

hljs.registerLanguage("cisco", hljsCiscoCli);
hljs.initHighlightingOnLoad();
```


## License

Highlight.js is released under the MIT License. See [LICENSE][1] file for details.

### Author

Branislav MATEÁŠ <xmatea00@stud.fit.vutbr.cz>

### Maintainer

Josh Goebel <hello@joshgoebel.com>


## Links

- The official site for the Highlight.js library is <https://highlightjs.org/>.
- The Highlight.js GitHub project: <https://github.com/highlightjs/highlight.js>.
- Learn more about cisco cli: <https://networking.ringofsaturn.com/Cisco/ciscocommandguide.php>.

[1]: https://github.com/BMatheas/highlightjs-cisco-cli/blob/master/LICENSE
