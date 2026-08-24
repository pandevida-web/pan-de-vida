# PAN DE VIDA V6

Proyecto web listo para GitHub Pages.

## Estructura
- index.html
- styles.css
- app.js
- manifest.json
- sw.js
- icono.jpg
- concha-pan.glb
- audio/intro.mp3

## GitHub Pages
Sube TODO el contenido de esta carpeta a la raíz del repositorio y activa:
Settings → Pages → Deploy from a branch → main → /(root).

La página usa rutas relativas (`./...`) para funcionar correctamente dentro de un repositorio como:
https://pandevida-web.github.io/pan-de-vida/

## Modelo 3D
El visor usa <model-viewer> desde jsDelivr. El archivo `concha-pan.glb` se carga localmente desde el repositorio.
