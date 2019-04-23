/*Uso de librerias de node.js*/
const fs = require('fs');
const nodepath = require('path');
const marked = require('marked');

/*
1) Función extractLinksFromFile que permite extraer los links de un archivo .md
*/
const extractLinksFromFile = (path)=>{
    /*Creación de una nueva promesa, con parametros resolve y reject*/
    return new Promise((resolve,reject)=>{
        try{
            /*Condición que permite solo leer archivos con extensión .md*/
            if(nodepath.extname(path)!=".md"){
                throw(new Error("Extensión no válida"));
            }
            /*Creación de arreglo, para almacenar los links encontrados en el archivo*/
            let links=[];
            /*Se lee el contenido del archivo con nombre "path" y se guarda
            como String en la variable markdown*/
            let markdown = fs.readFileSync(path).toString(); 
            /*Se crea un nuevo "renderer" sin opciones*/      
            const renderer = new marked.Renderer();
            /*El renderer que acabamos de crear, en vez de convertir los links a html, 
            va a ejecutar lo que sigue cada vez que encuentre un link*/
            renderer.link = function(href, title, text) {
                /*Si encuentra un link, lo guarda en el arreglo links*/
                links.push({
                    href: href,
                    text: text,                  
                    file:path
                });
            };
            /*Se ejecuta la conversión indicando que en vez del renderer que viene por omisión 
            (que convierte todo a HTML), se usará el renderer anteriormente creado que ingresó los
            links en el arreglo. Esto está dado por la opción {renderer:renderer}*/
            marked(markdown,{renderer:renderer});
            /*Si la promesa se resuelve, esta preparada para ser consumida desde mdLinks (.then)*/ 
            resolve(links);
        }
        catch(error){
            /*Si la promesa falla, esta preparada para ser consumida desde mdLinks (.catch)*/
            reject(error);
        }
        
    })
}

module.exports={
    extractLinksFromFile
}