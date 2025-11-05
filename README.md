# Aula Virtual - Sistema de Gestión de Tareas

Sistema educativo web que permite a profesores crear tareas y a estudiantes entregarlas, con integración completa a Google Sheets para almacenamiento y seguimiento.

## 🚀 Características

### Para Profesores
- ✅ Crear y gestionar tareas
- ✅ Subir materiales de apoyo
- ✅ Visualizar entregas en tiempo real
- ✅ Sistema de calificaciones
- ✅ Estadísticas y reportes

### Para Estudiantes
- ✅ Ver tareas asignadas
- ✅ Entregar archivos o enlaces
- ✅ Seguimiento del progreso
- ✅ Notificaciones de fechas límite

### Integración Google Sheets
- ✅ Almacenamiento automático de todas las tareas
- ✅ Registro de entregas con timestamps
- ✅ Exportación de datos para análisis
- ✅ Backup automático en la nube

## 🛠️ Tecnologías

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla), Bootstrap 5
- **Backend:** Node.js, Express.js
- **Almacenamiento:** Google Sheets API, Google Drive API
- **Subida de archivos:** Multer
- **Autenticación:** JWT, Google OAuth

## 🌐 ¡Subir a Internet!

**¿Quieres que tu Aula Virtual esté disponible 24/7 en internet?**

📖 **Lee el archivo `COMO-SUBIR-A-INTERNET.md`** para instrucciones paso a paso súper fáciles.

🚀 **En 10 minutos tendrás tu aplicación funcionando en internet GRATIS**

---

## 📦 Instalación Local

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd aula-virtual-tareas
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar Google Sheets API**
   - Crear un proyecto en Google Cloud Console
   - Habilitar Google Sheets API y Google Drive API
   - Crear credenciales de cuenta de servicio
   - Descargar el archivo JSON de credenciales

4. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Editar `.env` con tus credenciales:
   ```
   PORT=5000
   GOOGLE_SHEETS_ID=tu_id_de_google_sheets
   GOOGLE_CLIENT_EMAIL=tu_email_de_servicio@proyecto.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\ntu_clave_privada\n-----END PRIVATE KEY-----\n"
   JWT_SECRET=tu_jwt_secret_seguro
   ```

5. **Crear la hoja de cálculo**
   - Crear una nueva Google Sheet
   - Compartir con el email de la cuenta de servicio (editor)
   - Copiar el ID de la URL y agregarlo a `.env`

6. **Ejecutar la aplicación**
   ```bash
   # Desarrollo
   npm run dev
   
   # Producción
   npm start
   ```

## 🎯 Uso

### Acceso a la Aplicación
- Abrir navegador en `http://localhost:5000`
- Seleccionar vista "Profesor" o "Estudiante"

### Como Profesor
1. Hacer clic en "Profesor" en la navegación
2. Completar el formulario de nueva tarea
3. Las tareas se guardan automáticamente en Google Sheets
4. Visualizar entregas y estadísticas en tiempo real

### Como Estudiante
1. Hacer clic en "Estudiante" en la navegación
2. Ingresar nombre en el perfil
3. Ver tareas disponibles
4. Entregar archivos o enlaces
5. Las entregas se registran automáticamente

## 📊 Estructura de Google Sheets

### Hoja "Tareas"
| ID | Título | Descripción | Materia | Fecha Límite | Fecha Creación | Estado |
|----|--------|-------------|---------|--------------|----------------|--------|

### Hoja "Entregas"
| ID Entrega | ID Tarea | Estudiante | Fecha Entrega | Tipo | Contenido | Comentarios | Calificación |
|------------|----------|------------|---------------|------|-----------|-------------|--------------|

## 🔧 API Endpoints

### Tareas
- `POST /api/tareas` - Crear nueva tarea
- `GET /api/tareas` - Obtener todas las tareas

### Entregas
- `POST /api/entregas` - Registrar entrega
- `GET /api/entregas/:tareaId` - Obtener entregas de una tarea

### Estadísticas
- `GET /api/estadisticas` - Obtener estadísticas generales

## 📁 Estructura del Proyecto

```
aula-virtual-tareas/
├── public/
│   ├── index.html      # Interfaz principal
│   ├── styles.css      # Estilos personalizados
│   └── app.js          # Lógica del frontend
├── uploads/            # Archivos subidos
├── server.js           # Servidor Express
├── google-sheets.js    # Servicio de Google Sheets
├── package.json        # Dependencias
├── .env               # Variables de entorno
└── README.md          # Documentación
```

## 🚀 Próximas Características

- [ ] Sistema de notificaciones por email
- [ ] Calendario integrado
- [ ] Chat en tiempo real
- [ ] Modo offline
- [ ] App móvil
- [ ] Integración con LMS existentes

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas:
- Crear un issue en GitHub
- Email: soporte@aulavirtual.com

---

## 🌟 Demo y Capturas

### Interfaz Principal
![Interfaz Principal](https://via.placeholder.com/800x400/4CAF50/white?text=Aula+Virtual+-+Interfaz+Principal)

### Sistema de Calificaciones
![Sistema de Calificaciones](https://via.placeholder.com/800x400/2196F3/white?text=Sistema+de+Calificaciones)

### Gestión de Tareas
![Gestión de Tareas](https://via.placeholder.com/800x400/FF9800/white?text=Gestión+de+Tareas)

## 🚀 Deploy

### Opciones de Despliegue
- **Heroku**: Para deploy gratuito
- **Vercel**: Para proyectos Node.js
- **Railway**: Alternativa moderna
- **VPS**: Para control completo

### Variables de Entorno Requeridas
```
PORT=3000
GOOGLE_SHEETS_ID=tu_id_aqui
GOOGLE_CLIENT_EMAIL=tu_email_servicio
GOOGLE_PRIVATE_KEY=tu_clave_privada
JWT_SECRET=tu_jwt_secret
NODE_ENV=production
```

## 🤝 Contribuidores

<a href="https://github.com/TU-USUARIO/aula-virtual-tareas/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=TU-USUARIO/aula-virtual-tareas" />
</a>

## ⭐ Dale una Estrella

Si este proyecto te fue útil, ¡dale una estrella! ⭐

---

**Desarrollado con ❤️ para la educación digital**