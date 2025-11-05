# 🚀 Comandos para Subir a GitHub

## Prerrequisitos
1. Instalar Git: https://git-scm.com/download/windows
2. Crear cuenta en GitHub: https://github.com
3. Crear nuevo repositorio en GitHub (sin README inicial)

## Configuración Inicial (Solo la primera vez)
```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu-email@ejemplo.com"
```

## Comandos para Subir el Proyecto
```bash
# 1. Abrir terminal en la carpeta del proyecto
cd C:\Users\PC\Desktop\Boris\pruevas

# 2. Inicializar Git
git init

# 3. Agregar todos los archivos
git add .

# 4. Verificar qué archivos se van a subir (opcional)
git status

# 5. Hacer el primer commit
git commit -m "🎓 Initial commit: Aula Virtual - Sistema completo de gestión de tareas"

# 6. Conectar con tu repositorio de GitHub
# REEMPLAZA "TU-USUARIO" con tu nombre de usuario de GitHub
git remote add origin https://github.com/TU-USUARIO/aula-virtual-tareas.git

# 7. Subir el código
git push -u origin main
```

## Comandos para Actualizaciones Futuras
```bash
# Cuando hagas cambios al proyecto:
git add .
git commit -m "Descripción de los cambios"
git push
```

## Verificar que Todo Esté Bien
```bash
# Ver el estado del repositorio
git status

# Ver el historial de commits
git log --oneline

# Ver archivos que Git está ignorando
git ls-files --others --ignored --exclude-standard
```

## ⚠️ IMPORTANTE
- El archivo .env NO se subirá (está en .gitignore)
- Los usuarios deberán crear su propio .env usando .env.example
- Las credenciales de Google Sheets permanecen seguras