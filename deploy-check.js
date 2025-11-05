#!/usr/bin/env node

/**
 * Script para verificar que la aplicación esté lista para el despliegue
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Verificando configuración para despliegue...\n');

// Verificar archivos esenciales
const requiredFiles = [
    'package.json',
    'server.js',
    'google-sheets.js',
    'public/index.html',
    'public/app.js',
    '.gitignore'
];

let allFilesExist = true;

console.log('📁 Verificando archivos esenciales:');
requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} - FALTA`);
        allFilesExist = false;
    }
});

// Verificar package.json
console.log('\n📦 Verificando package.json:');
try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    if (packageJson.scripts && packageJson.scripts.start) {
        console.log('✅ Script "start" configurado');
    } else {
        console.log('❌ Script "start" faltante');
        allFilesExist = false;
    }
    
    if (packageJson.dependencies) {
        console.log('✅ Dependencias definidas');
    } else {
        console.log('❌ Dependencias faltantes');
        allFilesExist = false;
    }
} catch (error) {
    console.log('❌ Error leyendo package.json');
    allFilesExist = false;
}

// Verificar .env (no debe existir en producción)
console.log('\n🔐 Verificando configuración de seguridad:');
if (fs.existsSync('.env')) {
    console.log('⚠️  .env existe - Asegúrate de que esté en .gitignore');
    
    // Verificar .gitignore
    if (fs.existsSync('.gitignore')) {
        const gitignore = fs.readFileSync('.gitignore', 'utf8');
        if (gitignore.includes('.env')) {
            console.log('✅ .env está en .gitignore');
        } else {
            console.log('❌ .env NO está en .gitignore - PELIGRO DE SEGURIDAD');
            allFilesExist = false;
        }
    }
} else {
    console.log('✅ .env no existe (correcto para producción)');
}

// Verificar uploads
console.log('\n📤 Verificando configuración de uploads:');
if (fs.existsSync('.gitignore')) {
    const gitignore = fs.readFileSync('.gitignore', 'utf8');
    if (gitignore.includes('uploads/*')) {
        console.log('✅ uploads/* está en .gitignore');
    } else {
        console.log('⚠️  uploads/* no está en .gitignore');
    }
}

// Verificar server.js para PORT
console.log('\n🌐 Verificando configuración del servidor:');
try {
    const serverJs = fs.readFileSync('server.js', 'utf8');
    if (serverJs.includes('process.env.PORT')) {
        console.log('✅ Puerto configurado desde variable de entorno');
    } else {
        console.log('❌ Puerto no configurado para producción');
        allFilesExist = false;
    }
} catch (error) {
    console.log('❌ Error leyendo server.js');
    allFilesExist = false;
}

// Resultado final
console.log('\n' + '='.repeat(50));
if (allFilesExist) {
    console.log('🎉 ¡Aplicación lista para despliegue!');
    console.log('\n📋 Próximos pasos:');
    console.log('1. Sube el código a GitHub');
    console.log('2. Ve a render.com o railway.app');
    console.log('3. Conecta tu repositorio');
    console.log('4. Configura las variables de entorno');
    console.log('5. ¡Despliega!');
    console.log('\n📖 Lee DEPLOYMENT.md para instrucciones detalladas');
} else {
    console.log('❌ Hay problemas que resolver antes del despliegue');
    console.log('Revisa los errores marcados arriba');
}
console.log('='.repeat(50));