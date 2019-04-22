#!/usr/bin/env node

const mdLinks = require("./md-links");

mdLinks.mdLinks(process.argv[2],false).then((links)=>{
  links.forEach(function (link) {
    console.log(link);
  });
});
/*
mdLinks("./some/example.md", { validate: true })
  .then(links => {
    // => [{ href, text, file, status, ok }]
  })
  .catch(console.error);

mdLinks("./some/dir")
  .then(links => {
    // => [{ href, text, file }]
  })
  .catch(console.error);
*/

