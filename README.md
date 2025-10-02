# Editor de Redes Eléctricas

Proyecto desarrollado en **React** que permite editar y visualizar redes eléctricas de manera interactiva usando **Konva** y **Leaflet**. Este editor muestra nodos, conexiones y permite modificar posiciones y propiedades de los elementos de la red.

---

## 📌 Características

* Visualización de nodos y conexiones en un canvas interactivo.
* Diferentes tipos de nodos:

  * Poste
  * Transformador
  * Seccionador
  * Subestación
  * Usuario
* Popups con información detallada de cada nodo.
* Actualización dinámica de la red.
* Canvas y mapa sincronizados.
* Edición de posiciones y propiedades de nodos.

---

## 💻 Tecnologías

* React
* Konva
* Leaflet
* Axios
* CSS/HTML

---

## ⚙️ Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo
```

2. Instalar dependencias:

```bash
npm install
```

3. Ejecutar el proyecto:

```bash
npm start
```

El proyecto se abrirá en [http://localhost:3000](http://localhost:3000).

---

## 📚 Estructura del proyecto

```
src/
├─ Components/
│  ├─ Mapa.jsx           # Componente principal del mapa y editor
├─ service/
│  ├─ useDatos.js        # Hook para consumir datos de la red
├─ App.jsx               # Componente ráiz
└─ index.js              # Entrada principal de React
```

---

## 🛠 Uso

* Abrir el proyecto en el navegador.
* Visualizar la red eléctrica en el canvas.
* Seleccionar y mover nodos.
* Hacer clic en un nodo para ver detalles o editar propiedades.
* Agregar nuevas conexiones o eliminar nodos existentes.

---

## 📁 Datos

El proyecto consume datos desde un **hook personalizado** (`useDatos`) que puede conectarse a una API REST local o a datos hardcodeados:

```javascript
const { nodos, conexiones } = useDatos();
```

Se recomienda que cada nodo tenga al menos `id`, `lat`, `lon` y `type` para mostrarse correctamente.

---

## 📍 Notas

* Asegúrate de que los contenedores padres tengan altura definida, para que el canvas y el mapa rendericen correctamente.
* Los elementos de la red son interactivos y sincronizados entre mapa y canvas.

---

## 🔗 Demo

Si tenés un demo online, podés agregarlo aquí:

```
https://tu-demo.netlify.app
```

---

