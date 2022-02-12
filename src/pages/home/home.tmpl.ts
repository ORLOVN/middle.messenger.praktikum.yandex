const Handlebars = require('handlebars');
const tmpl = Handlebars.compile(`

welcome!

{{{button}}}

`);
export {tmpl as default};
