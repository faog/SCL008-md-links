# faog-md-links

Extrae los links de tus directorios y/o archivos markdown (.md), valida su status y calcula estadística con estos.

## Diagrama de Flujo

## Instalación

```
npm install faog-md-links
```

## Guía de uso
```js
const md-links = require ( 'faog-md-links' ) ;   
```

**CLI (Command Line Interface - Interfaz de Línea de Comando)**

Puedes ejecutar esta librería de la siguiente forma:

* Leer archivos con extensión .md

`md-links <path-to-file.md>`

ejemplo:
```
$ md-links example.md
example.md http://algo.com/2/3/ Link a algo
example.md https://otra-cosa.net/algun-doc.html algún doc
```
* Leer un directorio

`md-links <path-to-file>`

ejemplo:
```
$ md-links ./some/example.md
./some/example.md http://algo.com/2/3/ Link a algo
./some/example.md https://otra-cosa.net/algun-doc.html algún doc
```

En ambos casos, se obtiene como resultado:

- `file`: archivo o ruta donde fue encontrado el link.
- `href`: link encontrado.
- `text`: descripción del link.

Options
 --validate
 --stats
 --validate --stats


## Documentación técnica


## Autor

Fabiola Orellana

8° Generación de Laboratoria