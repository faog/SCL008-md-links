const mdLinks = require("../src/md-links");

describe('mdLinks', () => {

  it('Debería retornar 2 links para el archivo prueba.md', async() => {    
    await expect(mdLinks.mdLinks('./prueba.md')).resolves.toEqual(
      [{href:'https://es.wikipedia.org/wiki/Markdown', text:'Markdown', file:'./prueba.md' },
      {href: 'https://nodejs.org/', text:'Node.js', file:'./prueba.md'}]);
  });
  /*
  it('Debería retornar error para el archivo prueba2.md', async()  => {
    await expect(mdLinks.mdLinks('./prueba2.md')).rejects.toThrow("ENOENT: no such file or directory, open './prueba2.md'");
  });
  */
  it('Debería retornar "Extension no válida" para el archivo text.txt', async()  => {
    await expect(mdLinks.mdLinks('./text.txt')).rejects.toThrow("Extensión no válida");
  });

  it('Debería retornar 2 links para el archivo prueba.md validando su status y statusText', async () => {
    await expect(mdLinks.mdLinks('./prueba.md',{validate:true})).resolves.toEqual(
    [{href:'https://es.wikipedia.org/wiki/Markdown', text:'Markdown', file:'./prueba.md',status:200,statusText:'OK' },
    {href: 'https://nodejs.org/', text:'Node.js', file:'./prueba.md',status:200,statusText:'OK'}]);
  });

  it('Debería retornar un error al chequear un link no válido', async()=>{
    await expect(mdLinks.mdLinks([{href:'https://esfffffff.wikipedia.org/wiki/Markdown', 
    text:'Markdown', file:'./prueba.md'}])).rejects.toThrow("The \"path\" argument must be of type string. Received type object");
  });
  
});

