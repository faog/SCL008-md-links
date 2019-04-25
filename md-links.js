/*Uso de librerias de node.js*/
//filesystem
const fs = require('fs');
//path
const nodepath = require('path');
//marked
const marked = require('marked');
//fetch
const fetch = require('fetch');
const fetchUrl = fetch.fetchUrl;

/*
1) Función extractLinksFromFile que permite extraer los links de un archivo .md
PASOS: 
- Se lee el contenido del archivo con nombre "path" y se guarda como String en la variable markdown
- El renderer que se crea en vez de convertir los links a html, va a ejecutar lo que sigue cada vez que encuentre un link
- Se ejecuta la conversión indicando que en vez del renderer que viene por omisión 
que convierte todo a HTML), se usará el renderer anteriormente creado que ingresó los links en el arreglo. 
Esto está dado por la opción {renderer:renderer}
*/
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
            let linkPromises = [];
            let status = [];
            links.forEach((element) => {
                linkPromises.push(validateLink(element.href));
            });
            Promise.all(linkPromises).then(resolve(links)).catch((error)=>{reject(error);});
        }
        catch(error){
            reject(error);
        }
        
    })
}
/*
2) Función validateLink que permite extraer los links de un archivo .md
PASOS: 

*/
const validateLink = (url)=>{ 
    return new Promise ((reject, resolve)=>{
        fetchUrl(url, function(error, meta, body){
            if(meta){
                if(meta.status == 200){
                    resolve(meta.status.toString());
                }else{
                    reject(error);
                }
            }
        })
    })
}

module.exports={
    extractLinksFromFile,
    validateLink    
}

