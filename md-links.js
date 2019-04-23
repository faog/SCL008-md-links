const fs = require('fs');
const nodepath = require('path');
const marked = require('marked');

const extractLinksFromFile = (path)=>{
    return new Promise((resolve,reject)=>{
        try{
            if(nodepath.extname(path)!=".md"){
                throw(new Error("Extensión no válida"));
            }
            let links=[];
            let markdown = fs.readFileSync(path).toString();          
            const renderer = new marked.Renderer();
            renderer.link = function(href, title, text) {
                links.push({
                    href: href,
                    text: text,                  
                    file:path
                });
            };
            marked(markdown,{renderer:renderer});
            resolve(links);
        }
        catch(error){
            reject(error);
        }
        
    })
}

module.exports={
    extractLinksFromFile
}




