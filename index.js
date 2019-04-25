#!/usr/bin/env node

const mdLinks = require("./md-links");

mdLinks.extractLinksFromFile(process.argv[2])
  .then((res)=>{
    res.forEach(function (link) {
    /*Impresion de los links de acuerdo al formato solicitado, ademas que el texto no es superior a 
    50 carácteres*/
    console.log(`${link.file} ${link.href} ${link.text.substring(0,50)}  ${link.status}`);
    }); 
  })
  .catch(console.error);



let url = "https://www.google.com";
mdLinks.validateLink(url)
  .then(res => {    
    console.log(res);
  })
  .catch(error => {
    console.log(error);
  });



// mdLinks.validateLink(links)
//   .then((res)=>{
//     console.log(res);
//     mdLinks.extractLinksFromFile(res)
//       .then(res => {
//         console.log(res)
//       })
//       .catch(err => {
//         console.log(err);
//    });
//    mdLinks.extractLinksFromFile(res);
//  })
//  .then((res)=>{  
//  })
//  .catch((err)=>{
//    console.log(err);
//  })
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

