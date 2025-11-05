# 🚀 Instrucciones para Subir a GitHub

## Paso 1: Crear Repositorio en GitHub
1. Ve a [GitHub.com](https://github.com)
2. Haz clic en el botón **"New"** o **"+"** → **"New repository"**
3. Configura el repositorio:
   - **Repository name**: `aula-virtual-tareas`
   - **Description**: `Sistema de gestión de tareas educativo con integración a Google Sheets`
   - **Visibility**: Public o Private (según prefieras)
   - **NO marques** "Add a README file" (ya tenemos uno)
   - **NO marques** "Add .gitignore" (ya tenemos uno)
   - **NO marques** "Choose a license" (ya tenemos uno)
4. Haz clic en **"Create repository"**

## Paso 2: Conectar Repositorio Local con GitHub
Después de crear el repositorio, GitHub te mostrará comandos. Usa estos:

```bash
git remote add origin https://github.com/TU_USUARIO/aula-virtual-tareas.git
git branch -M main
git push -u origin main
```

**Reemplaza `TU_USUARIO` con tu nombre de usuario de GitHub**

## Paso 3: Comandos Listos para Ejecutar
Una vez que tengas la URL de tu repositorio, ejecuta:

```bash
# Agregar el repositorio remoto
git remote add origin https://github.com/TU_USUARIO/aula-virtual-tareas.git

# Cambiar a rama main (estándar actual)
git branch -M main

# Subir código a GitHub
git push -u origin main
```

## ✅ Estado Actual del Repositorio Local
- ✅ Git inicializado
- ✅ Archivos agregados al staging
- ✅ Commit inicial creado: `28f75f3`
- ✅ .gitignore configurado (excluye .env y node_modules)
- ✅ Listo para push a GitHub

## 📋 Archivos Incluidos en el Commit
- **Backend**: server.js, google-sheets.js, package.json
- **Frontend**: public/ (HTML, CSS, JS)
- **Configuración**: .env.example, .gitignore, package-lock.json
- **Documentación**: README.md, INFORME-ERRORES.md, DEPLOYMENT.md
- **Utilidades**: setup.js, deploy-check.js

## 🔒 Archivos Excluidos (Seguridad)
- ❌ `.env` (contiene credenciales de Google Sheets)
- ❌ `node_modules/` (dependencias)
- ❌ Archivos temporales y logs

## 🎯 Próximos Pasos Después del Push
1. Configurar GitHub Pages (si quieres demo público)
2. Configurar GitHub Actions para CI/CD
3. Agregar badges al README
4. Configurar issues y projects para gestión

## 📞 Si Necesitas Ayuda
- Verifica que tengas Git instalado: `git --version`
- Verifica que tengas cuenta de GitHub activa
- Asegúrate de tener permisos para crear repositorios