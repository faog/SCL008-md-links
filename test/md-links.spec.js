const mdLinks = require("../src/md-links");

describe('mdLinks', () => {

  it('Debería retornar 2 links cuando se quiera leer el archivo prueba.md', async() => {    
    await expect(mdLinks.mdLinks('./prueba.md')).resolves.toEqual(
      [{href:'https://es.wikipedia.org/wiki/Markdown', text:'Markdown', file:'./prueba.md' },
      {href: 'https://nodejs.org/', text:'Node.js', file:'./prueba.md'}]);
  });
  
  it('Debería retornar error ENOENT, si se intenta leer un archivo que no existe (prueba2.md)', async()  => {
    await expect(mdLinks.mdLinks('./prueba2.md')).rejects.toEqual("ENOENT");
  });

  it('Debería retornar "Extensión no válida" para el archivo text.txt', async()  => {
    await expect(mdLinks.mdLinks('./text.txt')).rejects.toThrow("Extensión no válida");
  });

  it('Debería retornar 2 links para el archivo prueba.md, validando su status y statusText', async () => {
    await expect(mdLinks.mdLinks('./prueba.md',{validate:true})).resolves.toEqual(
    [{href:'https://es.wikipedia.org/wiki/Markdown', text:'Markdown', file:'./prueba.md',status:200,statusText:'OK' },
    {href: 'https://nodejs.org/', text:'Node.js', file:'./prueba.md', status:200, statusText:'OK'}]);
  });

  it('Debería retornar un error al chequear un link no válido', async()=>{
    await expect(mdLinks.validateLink([{href:'https://esfffffff.wikipedia.org/wiki/Markdown', 
    text:'Markdown', file:'./prueba.md'}])).resolves.toEqual([{href:'https://esfffffff.wikipedia.org/wiki/Markdown', 
    text:'Markdown', file:'./prueba.md', status:0, statusText:"ENOTFOUND" }]);
  });

  it('Debería retornar la estadística linksTotal:2 y linksUnique:2 para el archivo prueba.md',()=>{
    expect(mdLinks.statsLinks(
    [{href:'https://es.wikipedia.org/wiki/Markdown'},{href: 'https://nodejs.org/'}]))
    .toEqual({"linksTotal": 2, "linksUnique": 2});
  });

  it('Debería retornar la estadística linksTotal:2, linksUnique:2, linksBroken:0 y códigos de estado para el archivo prueba.md ',()=>{
    expect(mdLinks.statsLinks(
    [{href:'https://es.wikipedia.org/wiki/Markdown',status:200 },{href: 'https://nodejs.org/', status:200}],{validate:true}))
    .toEqual({linksTotal: 2, linksUnique: 2, linksBroken:0, informationResponses:0, successfulResponses:2, 
      redirectionMessages:0, clientErrorResponses:0,  serverErrorResponses:0});
  });

  it('Deberia retornar 3 links para los archivos en el directorio .\\carpeta_md', async()=>{
    await expect(mdLinks.mdLinks('.\\carpeta_md')).resolves.toEqual([
      [{href:'https://es.wikipedia.org/wiki/Markdown', text:'Markdown', file:'carpeta_md\\prueba1.md' }],
      [{href:'https://nodejs.org/', text:'Node.js', file:'carpeta_md\\prueba2.md' }],
      [{href:'https://nodejs.org/', text:'Node.js', file:'carpeta_md\\prueba3.md' }]]
    )
  })

  it('Debería retornar 3 links para los archivos del directorio .\\carpeta_md, validando su status y statusText', async () => {
    await expect(mdLinks.mdLinks('.\\carpeta_md',{validate:true})).resolves.toEqual([
      [{href:'https://es.wikipedia.org/wiki/Markdown', text:'Markdown', file:'carpeta_md\\prueba1.md', status:200, statusText:'OK'}],
      [{href:'https://nodejs.org/', text:'Node.js', file:'carpeta_md\\prueba2.md', status:200, statusText:'OK' }],
      [{href:'https://nodejs.org/', text:'Node.js', file:'carpeta_md\\prueba3.md', status:200, statusText:'OK' }]
    ]);
  })
  
  it('Debería retornar un error si el usuario no ingresa un directorio o archivo', async()  => {
    await expect(mdLinks.mdLinks()).rejects.toThrow("The \"path\" argument must be of type string. Received type undefined");
  });

  it ('Debería retornar los codigos de estado para los links ingresados',()=>{
    expect(mdLinks.responseStatusCodesHTTP(
      {linksTotal: 3, linksUnique: 3, linksBroken: 2},
      [{ href: 'https://essssss.wikipedia.org/wiki/Markdown', status: 404},
      {href: 'https://nodejs.org/next', status: 303},
      {href: 'https://nodejs.org/', status: 501}]
    )).toEqual({linksTotal: 3, linksUnique: 3, linksBroken: 2, informationResponses:0, successfulResponses:0, 
      redirectionMessages:1, clientErrorResponses:1,  serverErrorResponses:1})
  })
});

