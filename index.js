#!/usr/bin/env node

const mdLinks = require("./md-links");

mdLinks.extractLinksFromFile(process.argv[2])
.then((links)=>{
  links.forEach(function (link) {
    console.log(`${link.file} ${link.href} ${link.text.substring(0,50)}`);
  }); 
  
})
.catch(console.error);
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

