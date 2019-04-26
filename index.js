#!/usr/bin/env node

const mdLinks = require("./src/md-links");

if(process.argv[3]==="--validate"){
  mdLinks.mdLinks(process.argv[2],{validate:true})
  .then((links) => {
    links.forEach(function (link) {   
      console.log(`${link.file} ${link.href} ${link.status} ${link.statusText} ${link.text.substring(0,50)}`);
    }); 
  })
  .catch(console.error);
}
else {
  mdLinks.mdLinks(process.argv[2])
  .then((links) => {
    links.forEach(function (link) {   
      console.log(`${link.file} ${link.href} ${link.text.substring(0,50)}`);
    }); 
  })
  .catch(console.error);
}

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

