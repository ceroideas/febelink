# Febelink Web

## Tabla de Contenidos

- [Descripción del Proyecto](#descripción-del-proyecto)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Comandos Útiles](#comandos-útiles)
- [Pruebas](#pruebas)
- [Despliegue](#despliegue)
- [Licencia](#licencia)

## Descripción del Proyecto

La plataforma web de Febelink es una aplicación web robusta desarrollada utilizando Angular 17. Esta plataforma permite a los usuarios interactuar con los servicios de Febelink de manera eficiente y segura. El proyecto está diseñado para ser escalable y mantenible, facilitando futuras expansiones y mejoras.

## Tecnologías Utilizadas

- [Angular 17](https://angular.io/)
- [TypeScript](https://www.typescriptlang.org/)
- [RxJS](https://rxjs.dev/)
- [Angular CLI](https://cli.angular.io/)
- [Node.js](https://nodejs.org/)
- [NPM](https://www.npmjs.com/)

## Requisitos Previos

Antes de comenzar con la instalación, asegúrese de tener instaladas las siguientes herramientas:

- Node.js (v16.0.0 o superior)
- NPM (v7.0.0 o superior)
- Angular CLI (v17.0.0 o superior)

Puede verificar las versiones instaladas ejecutando los siguientes comandos:

```bash
node -v
npm -v
ng version
```

## Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/febelink/febelink-web.git
cd febelink-web
```

2. Instalar las dependencias del proyecto:

```bash
npm install
```

## Comandos Útiles

- `ng serve`: Inicia un servidor de desarrollo. La aplicación estará disponible en `http://localhost:4200/`.
- `ng build`: Compila la aplicación en modo producción.
- `ng test`: Ejecuta las pruebas unitarias utilizando Karma.
- `ng lint`: Analiza el código fuente para asegurar que sigue las convenciones de estilo.

## Pruebas

Para ejecutar las pruebas unitarias, use el siguiente comando:

```bash
ng test
```

Esto ejecutará las pruebas configuradas en el proyecto y mostrará los resultados en la terminal y en un navegador.

## Despliegue

Para compilar la aplicación para producción, ejecute:

```bash
ng build --prod
```

Esto generará una carpeta `dist/` con los archivos optimizados para desplegar en un servidor web.

## Licencia

Este proyecto es propietario y todos los derechos están reservados por Febelink. No se permite la distribución, modificación o uso no autorizado del código contenido en este repositorio.
