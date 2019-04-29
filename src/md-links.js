/*Uso de librerias de node.js*/
const fs = require('fs');
const nodepath = require('path');
const marked = require('marked');
const fetch = require('node-fetch');
const fileHound = require('filehound');

/*Función mdLinks 
- Permite la conexión entre las funciones construidas
- Permite la interacción entre index.js y md-links.js*/
const mdLinks = (path,options) => {
    if(options && options.validate){
        return new Promise((resolve,reject)=>{
            extractMDFromDirectory(path)
                .then((paths)=>{
                    Promise.all(paths.map((pathInFolder)=>{                    
                        return extractLinksFromFile(pathInFolder);                    
                    })).then((linksInFolder)=>{
                        Promise.all(linksInFolder.map((linkInFolder)=>{                        
                            return validateLink(linkInFolder);
                        })).then((validateLinks)=>{
                            resolve(validateLinks);
                        })
                    });                    
                    }).catch(()=>{
                        extractLinksFromFile(path)
                        .then((links)=>{
                            resolve(validateLink(links)); 
                })
            })
        })
    }
    else{
        return new Promise((resolve, reject)=>{
            try{
                extractMDFromDirectory(path)
                .then(res=>{
                    resolve(Promise.all(res.map(file=>{
                        return extractLinksFromFile(file); 
                    })))
                })
                .catch(()=>{                   
                    resolve(extractLinksFromFile(path));
                })
            }catch(err){
                reject(err);
            }           
        })
    }
}

/*
1) Función extractLinksFromFile que permite extraer los links de un archivo .md:
- Se lee el contenido del archivo con nombre "path" y se guarda como String en la variable markdown
- Se valida que la extensión del archivo sea .md
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
                    reject(err.code);
                }
                else{
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
                }
            })  
        }
        catch(error){
            reject(error);
        }        
    })
}

/*
2) Función validateLink que permite agregar el status a los links encontrados en un archivo:
- Se retorna una Promise.all() donde al arreglo de links se le aplica un map, para que posteriormente
a cada elemento encontrado se le agregue el status y textstatus.
- Se crea una nueva promesa, que al usar fetch puedo ir agregando a cada link su status y textStatus
*/

const validateLink = (links)=>{
    return Promise.all(links.map(linkToValidate=>{
        return new Promise((resolve)=>{
            fetch(linkToValidate.href)
                .then(res=>{
                    linkToValidate.status = res.status;
                    linkToValidate.statusText = res.statusText;
                    resolve(linkToValidate);
                })
                .catch((err)=> {
                    linkToValidate.status=0;
                    linkToValidate.statusText=err.code;
                    resolve(linkToValidate);
                })                    
        });
    }))
}

/*
3)Función statsLinks que permite realizar el calculo de estadística de un archivo:
**************** 3.1) CASO --stats*******************
- Sus parámetros son el arreglo de links, y la opción --validate
- Usando map(), se obtiene el href del arreglo links, guardando esta información en el arreglo hrefLink 
- Para calcular los links total, se usa length, guardando esta información en el objeto responseStats
- Para calcular los links unicos, se usa el metodo Set, que permite sacar los elementos sin repetirlos para guardarlos 
en el arreglo hrefSet.
- Para calcular los links unicos, se usa size(propiedad de Set), guardando esta información en el objeto responseStats
- se retorna el objeto responseStats
**************** 3.2) CASO --stats --validate*******************
- Si el usuario ingresa la opción --validate, podra obtener los links rotos encontrados.
- Se usa filter para los links que devuelvan un status igual a 0 o mayor e igual a 400.
- Se retorna el objeto responseStats con linksTotal, linksUnique y linksBroken
- Además, se implementa la cantidad de links por respuesta HTTP.
*/

const statsLinks = (links, options)=>{
    let hrefLink = [];
    let responseStats = {};
    hrefLink = links.map(link=>{
        return link.href;
    });
    responseStats.linksTotal=hrefLink.length;
    let hrefSet= new Set(hrefLink);
    responseStats.linksUnique=hrefSet.size;
    if(options && options.validate){
        responseStats.linksBroken = links.filter(link=>{            
            return link.status===0 || link.status>=400;
        }).length;
        responseStatusCodesHTTP(responseStats, links);
        
    }
    return responseStats;
}

/*4)Función extractMDFromDirectory que permite obtener los archivos .md de un directorio*/
const extractMDFromDirectory=(path)=>{
    return fileHound.create()
    .paths(path)
    .ext('md')
    .find();
}

const responseStatusCodesHTTP =(responseStats, links) =>{
    responseStats.informationResponses = links.filter(link=>{
        return link.status>=100 && link.status<=199;
    }).length;
    responseStats.successfulResponses = links.filter(link=>{
        return link.status>=200 && link.status<=299;
    }).length;
    responseStats.redirectionMessages = links.filter(link=>{
        return link.status>=300 && link.status<=399;
    }).length;
    responseStats.clientErrorResponses = links.filter(link=>{
        return link.status>=400 && link.status<=499;
    }).length;
    responseStats.serverErrorResponses = links.filter(link=>{
        return link.status>=500 && link.status<=599;
    }).length;
    return responseStats;
}


module.exports={
    mdLinks,
    validateLink, 
    statsLinks,
    responseStatusCodesHTTP   
}