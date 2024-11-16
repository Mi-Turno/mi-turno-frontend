# Mi Turno Frontend

## Descripción General

El frontend de **Mi Turno** está compuesto por dos partes principales:

1. **Dashboards para negocios**:  
   Diseñados para los propietarios de negocios, los dashboards permiten gestionar todas las operaciones relacionadas con su establecimiento, incluyendo el manejo de servicios, horarios, profesionales, turnos y clientes, con vistas intuitivas y herramientas que optimizan la administración diaria.

2. **Interfaz para clientes**:  
   Una interfaz amigable que permite a los clientes buscar negocios, reservar turnos y cancelarlos de manera rápida y sencilla. También ofrece una experiencia personalizada para que los usuarios puedan gestionar sus turnos actuales y acceder a la información relevante de los servicios.

---

## Principios Fundamentales

El sistema sigue los siguientes principios clave para garantizar una experiencia fluida y eficiente:

- **Gestión de Profesionales**: Permite a los negocios agregar, modificar y desactivar profesionales asociados a sus servicios.  
- **Gestión de Servicios**: Los negocios pueden definir y personalizar los servicios que ofrecen.  
- **Gestión de Horarios**: Control total sobre los horarios de atención de cada profesional, con la posibilidad de configurar turnos específicos.  
- **Gestión de Turnos**: Herramientas para reservar, cancelar y reorganizar turnos tanto para los clientes como para los negocios.  
- **Gestión de Clientes**: Funcionalidades para que los negocios puedan rastrear y atender a sus clientes de manera efectiva.  
- **Vistas en Tabla**: Tablas dinámicas para visualizar información como turnos, servicios y profesionales de forma clara y organizada.  
- **Buscador de Negocios**: Función para que los clientes puedan encontrar negocios registrados en el sistema y ver los servicios disponibles.

---

## Tecnologías Utilizadas

El proyecto está construido con las siguientes tecnologías:

- **HTML**: Estructura de la interfaz de usuario.  
- **CSS**: Diseño y estilos para una experiencia visual atractiva.  
- **Angular**: Framework para la creación de aplicaciones web dinámicas y escalables.  
- **TypeScript**: Lenguaje de programación tipado que facilita el desarrollo y mantenimiento del proyecto.  
- **API**: Consume las API REST de [mi-turno-backend](https://github.com/organizacion/mi-turno-backend) para conectarse con el servidor y la base de datos.

---

## Estructura del Proyecto

# Estructura del proyecto

```plaintext
mi-turno-frontend/
├── .angular/
├── .vscode/
├── node_modules/
├── public/
├── src/
│   ├── app/
│   │   ├── auth/
│   │   ├── guard/
│   │   ├── service/
│   ├── core/
│   │   ├── interfaces/
│   │   ├── services/
│   ├── pages/
│   │   ├── dashboardAdmin/
│   │   ├── dashboardCliente/
│   │   ├── dashboardLocal/
│   │   ├── inicioSesion/
│   │   ├── landing-page/
│   │   ├── pedirTurno/
│   ├── shared/
│   │   ├── components/
│   │   ├── models/
├── app.component.css
├── app.component.html
├── app.component.spec.ts
├── app.component.ts
├── app.config.ts
├── app.routes.ts
├── index.html
├── main.ts
├── styles.css
---
```

## Configuración e Instalación

### Requisitos Previos

Para ejecutar este proyecto, necesitas instalar las siguientes herramientas:

- **Node.js**: Recomendado la última versión estable.  
- **Angular CLI**: Para administrar y ejecutar aplicaciones Angular.  
- **Git**: Para clonar el repositorio.  
- **Navegador Web**: Compatible con aplicaciones modernas (Chrome, Firefox, Edge, etc.).  
- Archivo `.env` de configuración para las variables de entorno.

### Pasos para Instalar y Ejecutar

1. Clona este repositorio desde GitHub:  
   ```bash
   git clone https://github.com/mi-turno/mi-turno-frontend.git
2. Accede al directorio del proyecto:
   cd mi-tunro-frontend
3. Instala las dependencias necesarios:
   npm install
4. Inicia el servidor de desarrollo
   ng serve
5. Accede a la aplicación desde tu navegador:
   La aplciación se encuentra en http://localhost:4200.
#### Nota: Asegúrate de que el backend esté corriendo simultáneamente para que la aplicación funcione correctamente. Consulta el README del backend para más detalles sobre cómo ejecutarlo.

---

## Cómo Usarlo

1. Una vez que el proyecto esté corriendo, accede a [http://localhost:4200](http://localhost:4200).
2. La aplicación se divide en dos secciones principales:
   - **Para negocios**: Usa las credenciales de administrador para acceder a los dashboards y gestionar el negocio.
   - **Para clientes**: Busca negocios disponibles, reserva turnos y gestiona tus citas fácilmente.
3. Recuerda que el backend debe estar activo para que la comunicación entre el frontend y el servidor funcione correctamente.

