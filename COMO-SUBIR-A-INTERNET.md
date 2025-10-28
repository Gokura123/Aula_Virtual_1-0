# 🌐 CÓMO SUBIR TU AULA VIRTUAL A INTERNET

## 🎯 Opción Más Fácil: Render (100% Gratuito)

### PASO 1: Subir a GitHub
1. Ve a [github.com](https://github.com) y crea una cuenta (si no tienes)
2. Haz clic en "New repository"
3. Nombre: `aula-virtual-tareas`
4. Marca "Public" y haz clic en "Create repository"
5. Sigue las instrucciones para subir tu código

### PASO 2: Crear cuenta en Render
1. Ve a [render.com](https://render.com)
2. Haz clic en "Get Started for Free"
3. Regístrate con tu cuenta de GitHub

### PASO 3: Conectar tu proyecto
1. En Render, haz clic en "New +"
2. Selecciona "Web Service"
3. Conecta tu repositorio `aula-virtual-tareas`
4. Haz clic en "Connect"

### PASO 4: Configurar el servicio
Llena estos campos:
- **Name:** `aula-virtual-tareas`
- **Environment:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Plan:** `Free`

### PASO 5: Variables de entorno (MUY IMPORTANTE)
En la sección "Environment Variables", agrega estas variables:

**NODE_ENV**
```
production
```

**GOOGLE_SHEETS_ID**
```
1wiXxTnQnn1WVycbDROl2XR7MzGQiUJCxCQ6UMl8UmiQ
```

**GOOGLE_CLIENT_EMAIL**
```
id-aula-virtual-bot@aulavirtual-475917.iam.gserviceaccount.com
```

**GOOGLE_PRIVATE_KEY** (copia TODO el texto, incluyendo las líneas BEGIN y END)
```
-----BEGIN PRIVATE KEY-----
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
```

**JWT_SECRET**
```
mi_jwt_secret_super_seguro_2024_produccion
```

### PASO 6: ¡Desplegar!
1. Haz clic en "Create Web Service"
2. Espera 5-10 minutos mientras Render construye tu aplicación
3. ¡Listo! Te dará una URL como: `https://aula-virtual-tareas.onrender.com`

---

## 🎉 ¡Tu aplicación ya está en internet!

### 👥 Usuarios para probar:
**Profesora:**
- Usuario: `Virginia Torrez`
- Contraseña: `12345`

**Estudiante:**
- Usuario: `Juan Pérez`
- Contraseña: `12345`

---

## 📱 Compartir con otros

Una vez desplegada, puedes compartir la URL con:
- ✅ Estudiantes
- ✅ Otros profesores
- ✅ Padres de familia
- ✅ Administradores

---

## ⚠️ Importante saber

### ✅ Lo que SÍ funciona:
- Crear y gestionar tareas
- Subir archivos (temporalmente)
- Calificaciones en Google Sheets
- Gestión de estudiantes y cursos
- Acceso desde cualquier dispositivo

### ⚠️ Limitaciones del plan gratuito:
- Los archivos subidos se borran cada 24-48 horas
- La aplicación "duerme" después de 15 minutos sin uso
- Límite de 750 horas por mes (suficiente para uso escolar)

### 💡 Para uso intensivo:
- Considera el plan de pago ($7/mes) para:
  - Archivos permanentes
  - Sin límites de tiempo
  - Dominio personalizado

---

## 🔧 Si algo no funciona

1. **Revisa los logs** en el dashboard de Render
2. **Verifica las variables de entorno** (son case-sensitive)
3. **Asegúrate** de que Google Sheets esté accesible
4. **Contacta** si necesitas ayuda

---

## 🚀 ¡Felicidades!

Has subido exitosamente tu Aula Virtual a internet. Ahora estudiantes de todo el mundo pueden acceder a tu plataforma educativa.

**¡Tu aplicación está lista para cambiar la educación! 🎓**