#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎓 Configurando Aula Virtual...\n');

// Verificar si Node.js está instalado
try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' });
    console.log(`✅ Node.js detectado: ${nodeVersion.trim()}`);
} catch (error) {
    console.error('❌ Node.js no está instalado. Por favor instálalo desde https://nodejs.org/');
    process.exit(1);
}

// Verificar si npm está instalado
try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' });
    console.log(`✅ npm detectado: ${npmVersion.trim()}`);
} catch (error) {
    console.error('❌ npm no está disponible.');
    process.exit(1);
}

// Crear archivo .env si no existe
if (!fs.existsSync('.env')) {
    console.log('📝 Creando archivo .env...');
    fs.copyFileSync('.env.example', '.env');
    console.log('✅ Archivo .env creado. ¡IMPORTANTE: Configura tus credenciales de Google Sheets!');
} else {
    console.log('⚠️  El archivo .env ya existe.');
}

// Crear carpeta uploads si no existe
if (!fs.existsSync('uploads')) {
    console.log('📁 Creando carpeta uploads...');
    fs.mkdirSync('uploads');
    fs.writeFileSync('uploads/.gitkeep', '');
    console.log('✅ Carpeta uploads creada.');
}

// Instalar dependencias
console.log('\n📦 Instalando dependencias...');
try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencias instaladas correctamente.');
} catch (error) {
    console.error('❌ Error al instalar dependencias:', error.message);
    process.exit(1);
}

console.log('\n🎉 ¡Configuración completada!');
console.log('\n📋 Próximos pasos:');
console.log('1. Configura tus credenciales de Google Sheets en el archivo .env');
console.log('2. Ejecuta: npm run dev');
console.log('3. Abre tu navegador en: http://localhost:3000');
console.log('\n📖 Lee el README.md para instrucciones detalladas.');