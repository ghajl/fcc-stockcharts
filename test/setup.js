const jsdom = require("jsdom");
const { JSDOM } = jsdom;

global.document = new JSDOM('<!doctype html><html><body></body></html>');
global.window = document.window;
window.jQuery = require("jquery")(window);
