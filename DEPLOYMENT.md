# 🚀 Guía de Despliegue - Aula Virtual

## Opción 1: Render (Recomendado - Gratuito)

### Paso 1: Preparar el Repositorio
1. Sube tu código a GitHub (si no lo has hecho)
2. Asegúrate de que el archivo `.env` NO esté en el repositorio (debe estar en `.gitignore`)

### Paso 2: Crear Cuenta en Render
1. Ve a [render.com](https://render.com)
2. Regístrate con tu cuenta de GitHub
3. Conecta tu repositorio

### Paso 3: Configurar el Servicio
1. Haz clic en "New +" → "Web Service"
2. Conecta tu repositorio de GitHub
3. Configuración:
   - **Name:** `aula-virtual-tareas`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

### Paso 4: Variables de Entorno
En la sección "Environment Variables", agrega:

```
NODE_ENV=production
GOOGLE_SHEETS_ID=1wiXxTnQnn1WVycbDROl2XR7MzGQiUJCxCQ6UMl8UmiQ
GOOGLE_CLIENT_EMAIL=id-aula-virtual-bot@aulavirtual-475917.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC/RntbC9pCtK6G
xgYn62h638rSDUfUZvkDzziaBRYmlh4pAQJ44cZpfPg85kFNoIvdrksHpBA2BtP9
HjDJEKc6L6RqyTrQ0+Z9iPZ8m4oLl1hpzGx+ZZWFEiuthON1tHlaFKvU0XFmwxj4
4NyLxSF36ahnk2ad++Un72Uw2wy9+CuSrgaN8MPrYEskqnmd4UJw8m7feqbLqr/b
HTlH9VPhK9cPwPUe+aGjlHJsihk/itPu9AXtv0GE2vpwEi0AmFhCnaya+qSlOAS6
kT40VJKHoxn5Q9Mh9SPADG39lP1HmjU/g//23Ttf3epsCYficl1goAZlGYm9ADC3
oAoGwjFtAgMBAAECggEATsnmGxlVRP/vGhXsyDnIVkDj50VQLrZh4YdUreDlgGx6
rPI9BfUeSSqQiGliQesdYeme/109zjtezBdJCjGBaM7iH5iXURjQCyrFOYvKP78O
TLpHgIMwpVlYQ4gHN99o00nLhATn/OflW/Mn9az0fdPyKgQGE5KEkMAkQw0gAQnG
cHU3C5cdJL5avMMDT6xhGUgThc4Ui22OBOAgttCFjGtgBfpVzcWauwC1me2bGuRW
mikKUaFGAiRkcripxI+mslbNS7TByOOUD1xKN8sLXtGiJm1AFDbYRNNDk/uDGhYi
lecpIynKd0IeNH+lgkFNNV8j/kbqHahPa/HgRZ2dIwKBgQD8L9oHL8+7BmEmbx3r
z7QdR+T3T6cZzEL2FdQB8l2vaU07MdR8eivVUs0k5VhHJnzALzn/t1AvqGdVBWWD
VYvNpgMtJ+9ZLKhVrp38vsm/5c3Ak4csYbWQJ0YHrozM9EnSDATzS1QPSWZTICIF
gPKJdj221iBRJF4dGjOxHjFZ4wKBgQDCKtuM/ow5bOmkBxUAEdwiLmAs6FSwE1Bt
WXF3VgkrlCdNQ1/2em4BQ2Eo6G/MA7bB1ZHNU63Cz6aKeDEHBtrzu0f+ckyYYv0U
s3EE8mrgpkCholIGFaOpM8tXWzi7VPxLeWOMWNDVoVYY4G8nqrSjqgJ7IRM/lG7N
C1fj6UhobwKBgEx7psAvO+0YzjX91TFDWPjYaRSoT6F/VX+Utyuv+cHNSeL+BdeK
peiYqCbcd518irEuoYRwcB1EEbKzZEokk7XW93emeOyuoo752mhg5IcShwg0tfY7
2/jQMGj8Ay/Vlt3hT08KNYA9Xo8vW6IXrXcLKUReRIbXZMOmwq6g3Y7JAoGAMFPq
gZV54XEyVhlNKM9JM1jHp2XMbmbgRddVXpaTgb1GavyyDe87IiVbMYtpCCaEfoph
1/FT9oEoup5f1ZfnN3MN4E8isWsyAs0G/Gw6HeBDhfeY4trP+XViz0NtQ3NLuJ1m
IbCZihK2E0sJX54lh/bw1yTMXa7cRTzli1ytIRECgYBSVHlz70wN+1jbpB0gyOcM
Yz1sBzIAlzKIDqGSHr8/LjilQcDcWRQYG3ARUefe54Q9Bk7mH8V3EbQHKJIL1P7s
qs+ybdtDhCg/qGzcvnmEsZVT0SB6K3LPqUUYELQOdh0xnFOHlpNQcYi6zhDNJU8c
gX5psC5ReaLHfAxH3cQ9Ng==
-----END PRIVATE KEY-----
JWT_SECRET=mi_jwt_secret_super_seguro_2024_produccion
```

### Paso 5: Desplegar
1. Haz clic en "Create Web Service"
2. Render automáticamente construirá y desplegará tu aplicación
3. Te dará una URL como: `https://aula-virtual-tareas.onrender.com`

---

## Opción 2: Railway (Alternativa)

### Paso 1: Crear Cuenta
1. Ve a [railway.app](https://railway.app)
2. Regístrate con GitHub

### Paso 2: Desplegar
1. Haz clic en "Deploy from GitHub repo"
2. Selecciona tu repositorio
3. Railway detectará automáticamente que es una app Node.js

### Paso 3: Variables de Entorno
Agrega las mismas variables que en Render

---

## Opción 3: Vercel (Solo Frontend)

Si quieres usar Vercel, necesitarás separar el frontend del backend.

---

## 📋 Checklist Pre-Despliegue

- [ ] Código subido a GitHub
- [ ] `.env` en `.gitignore`
- [ ] `package.json` configurado correctamente
- [ ] Variables de entorno preparadas
- [ ] Google Sheets API funcionando
- [ ] Archivos de uploads en `.gitignore`

---

## 🔧 Configuraciones Adicionales

### Para Producción:
1. Cambiar `NODE_ENV=production`
2. Usar un `JWT_SECRET` más seguro
3. Configurar CORS para tu dominio específico
4. Considerar usar una base de datos real en lugar de Google Sheets

### Monitoreo:
- Render y Railway proporcionan logs automáticos
- Puedes ver el estado de tu aplicación en sus dashboards

---

## 🚨 Importante

- **Archivos subidos:** En el despliegue gratuito, los archivos subidos se borran cada vez que se reinicia el servicio
- **Límites:** Los planes gratuitos tienen límites de uso mensual
- **Dominio personalizado:** Disponible en planes de pago

---

## 🎉 ¡Listo!

Una vez desplegado, tu aplicación estará disponible 24/7 en internet y cualquier persona podrá acceder con la URL que te proporcione el servicio.

**Usuarios de prueba:**
- Profesora: `Virginia Torrez` / `12345`
- Estudiante: `Juan Pérez` / `12345`