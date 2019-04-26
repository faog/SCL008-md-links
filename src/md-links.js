/*Uso de librerias de node.js*/
const fs = require('fs');
const nodepath = require('path');
const marked = require('marked');
const fetch = require('node-fetch');

/*Función mdLinks 
- Permite la conexión entre las funciones contruidas
- Permite la interacción entre index.js y md-links.js*/

const mdLinks = (path,option) => {
    if(option && option.validate){
        return new Promise((resolve,reject)=>{
            extractLinksFromFile(path).then((links)=>{
                resolve(validateLink(links));
            });
        })
    }
    else{
        return extractLinksFromFile(path);
    }
}

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
            fs.readFile(path,'utf-8',(err, content)=>{
                if(err){
                    reject(err);
                }
                let links=[];
                const renderer = new marked.Renderer();
                renderer.link = function(href, title, text){
                    links.push({
                        href:href,
                        text: text,
                        file: path
                    })
                }
                marked(content,{renderer:renderer});
                resolve(links);
            })  
        }
        catch(error){
            reject(error);
        }
        
    })
}

/*
2) Función validateLink que permite agregar el status a los links encontrados en un archivo
PASOS: 
- Se retorna una Promise.all() donde al arreglo de links se le aplica un map, para que posteriormente
a cada elemento encontrado se le agregue el status y textstatus.
- Se crea una nueva promesa, que al usar fetch puedo ir agregando a cada link su status y textStatus
- Con esto, puedo resolver la promesa (resolve) o generar un error (reject)
*/

const validateLink = (links)=>{
    return Promise.all(links.map(link=>{
        return new Promise((resolve,reject)=>{
            fetch(link.href)
                .then(res=>{
                    link.status = res.status;
                    link.statusText = res.statusText;
                    resolve(link);
                })
                .catch((err)=>                    
                    reject(err))
        });
    }))
}

module.exports={
    mdLinks
}