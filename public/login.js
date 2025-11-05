// Variables globales para login
let currentUserType = 'profesor';
let currentStudentAction = 'login';

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Event listeners para cambio de tipo de usuario
    document.querySelectorAll('input[name="userType"]').forEach(radio => {
        radio.addEventListener('change', cambiarTipoUsuario);
    });
    
    // Event listeners para cambio de acción estudiante
    document.querySelectorAll('input[name="estudianteAction"]').forEach(radio => {
        radio.addEventListener('change', cambiarAccionEstudiante);
    });
    
    // Event listeners para formularios
    document.getElementById('formLoginProfesor').addEventListener('submit', loginProfesor);
    document.getElementById('formLoginEstudiante').addEventListener('submit', loginEstudiante);
    document.getElementById('formRegistroEstudiante').addEventListener('submit', registroEstudiante);
    
    // Cargar cursos disponibles para el registro de estudiantes
    cargarCursosDisponibles();
});

// Función para cambiar tipo de usuario
function cambiarTipoUsuario(e) {
    currentUserType = e.target.value;
    
    const profesorLogin = document.getElementById('profesorLogin');
    const estudianteLogin = document.getElementById('estudianteLogin');
    
    if (currentUserType === 'profesor') {
        profesorLogin.style.display = 'block';
        estudianteLogin.style.display = 'none';
    } else {
        profesorLogin.style.display = 'none';
        estudianteLogin.style.display = 'block';
    }
}

// Función para cambiar acción de estudiante
function cambiarAccionEstudiante(e) {
    currentStudentAction = e.target.value;
    
    const loginForm = document.getElementById('estudianteLoginForm');
    const registerForm = document.getElementById('estudianteRegisterForm');
    
    if (currentStudentAction === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        
        // Recargar cursos cuando se muestra el formulario de registro
        cargarCursosDisponibles();
    }
}

// Función para toggle de contraseña
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Función para login de profesor
async function loginProfesor(e) {
    e.preventDefault();
    
    const usuario = document.getElementById('usuarioProfesor').value.trim();
    const password = document.getElementById('passwordProfesor').value;
    
    // Validar credenciales del profesor
    if (usuario === 'Virginia Torrez' && password === '12345') {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tipo: 'profesor',
                    usuario: usuario,
                    password: password
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Guardar datos de sesión
                localStorage.setItem('userSession', JSON.stringify({
                    tipo: 'profesor',
                    nombre: usuario,
                    token: result.token
                }));
                
                mostrarAlerta('¡Bienvenida Profesora ' + usuario + '!', 'success');
                
                // Redirigir después de 1 segundo
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
            } else {
                mostrarAlerta('Error al iniciar sesión', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            mostrarAlerta('Error de conexión', 'error');
        }
    } else {
        mostrarAlerta('Usuario o contraseña incorrectos', 'error');
    }
}

// Función para login de estudiante
async function loginEstudiante(e) {
    e.preventDefault();
    
    const usuario = document.getElementById('usuarioEstudiante').value.trim();
    const password = document.getElementById('passwordEstudiante').value;
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tipo: 'estudiante',
                usuario: usuario,
                password: password
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Guardar datos de sesión
            localStorage.setItem('userSession', JSON.stringify({
                tipo: 'estudiante',
                nombre: result.usuario.nombre,
                usuario: result.usuario.usuario,
                curso: result.usuario.curso,
                token: result.token
            }));
            
            mostrarAlerta('¡Bienvenido ' + result.usuario.nombre + '!', 'success');
            
            // Redirigir después de 1 segundo
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        } else {
            mostrarAlerta(result.message || 'Usuario o contraseña incorrectos', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error de conexión', 'error');
    }
}

// Función para registro de estudiante
async function registroEstudiante(e) {
    e.preventDefault();
    
    const nombreCompleto = document.getElementById('nombreCompleto').value.trim();
    const usuario = document.getElementById('usuarioRegistro').value.trim();
    const curso = document.getElementById('cursoEstudiante').value;
    const password = document.getElementById('passwordRegistro').value;
    const confirmarPassword = document.getElementById('confirmarPassword').value;
    
    // Validaciones
    if (password !== confirmarPassword) {
        mostrarAlerta('Las contraseñas no coinciden', 'error');
        return;
    }
    
    if (password.length < 4) {
        mostrarAlerta('La contraseña debe tener al menos 4 caracteres', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: nombreCompleto,
                usuario: usuario,
                curso: curso,
                password: password
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            let mensaje = '¡Registro exitoso! Ahora puedes iniciar sesión';
            if (result.savedToSheets) {
                mensaje += ' (Guardado en Google Sheets ✅)';
            }
            mostrarAlerta(mensaje, 'success');
            
            // Cambiar a formulario de login
            document.getElementById('loginAction').checked = true;
            cambiarAccionEstudiante({ target: { value: 'login' } });
            
            // Limpiar formulario
            document.getElementById('formRegistroEstudiante').reset();
        } else {
            mostrarAlerta(result.message || 'Error al registrar usuario', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error de conexión', 'error');
    }
}

// Función para mostrar alertas
function mostrarAlerta(mensaje, tipo) {
    // Remover alertas existentes
    const alertasExistentes = document.querySelectorAll('.alert-floating');
    alertasExistentes.forEach(alerta => alerta.remove());
    
    // Crear nueva alerta
    const alerta = document.createElement('div');
    alerta.className = `alert alert-${tipo === 'success' ? 'success' : 'danger'}-custom alert-floating position-fixed`;
    alerta.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alerta.innerHTML = `
        <i class="fas fa-${tipo === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2"></i>
        ${mensaje}
        <button type="button" class="btn-close float-end" onclick="this.parentElement.remove()"></button>
    `;
    
    document.body.appendChild(alerta);
    
    // Auto-remover después de 4 segundos
    setTimeout(() => {
        if (alerta.parentNode) {
            alerta.remove();
        }
    }, 4000);
}

// Verificar si ya hay una sesión activa al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const session = localStorage.getItem('userSession');
    if (session) {
        try {
            const userData = JSON.parse(session);
            
            // Verificar que la sesión sea válida
            if (userData.tipo && userData.nombre) {
                mostrarAlerta(`Ya tienes una sesión activa como ${userData.tipo}. Redirigiendo...`, 'info');
                
                // Redirigir después de mostrar el mensaje
                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);
            } else {
                // Sesión inválida, limpiar
                console.log('Sesión inválida encontrada, limpiando...');
                localStorage.removeItem('userSession');
            }
        } catch (error) {
            console.error('Error al verificar sesión existente:', error);
            localStorage.removeItem('userSession');
        }
    }
});

// Función para limpiar completamente la sesión
function limpiarSesionCompleta() {
    localStorage.removeItem('userSession');
    localStorage.removeItem('entregas');
    localStorage.removeItem('nombreEstudiante');
    
    mostrarAlerta('Sesión limpiada completamente', 'success');
    
    // Recargar la página para mostrar el login limpio
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

// Función para cargar cursos disponibles dinámicamente
async function cargarCursosDisponibles() {
    const selectCurso = document.getElementById('cursoEstudiante');
    
    if (!selectCurso) {
        console.error('No se encontró el elemento select de cursos');
        return;
    }
    
    try {
        // Mostrar estado de carga
        selectCurso.innerHTML = '<option value="">Cargando cursos...</option>';
        
        const response = await fetch('/api/cursos');
        const result = await response.json();
        
        if (result.success && result.cursos) {
            // Limpiar y agregar placeholder
            selectCurso.innerHTML = '<option value="">Seleccionar curso</option>';
            
            // Agregar cursos dinámicamente
            if (result.cursos.length > 0) {
                result.cursos.forEach(curso => {
                    const option = document.createElement('option');
                    option.value = curso;
                    option.textContent = curso;
                    selectCurso.appendChild(option);
                });
                
                console.log(`✅ Cursos cargados dinámicamente: ${result.cursos.join(', ')}`);
            } else {
                // Si no hay cursos disponibles, agregar los cursos por defecto como fallback
                console.log('No hay cursos en el sistema, usando cursos por defecto');
                agregarCursosDefecto(selectCurso);
            }
        } else {
            console.warn('No se pudieron cargar los cursos, usando cursos por defecto');
            agregarCursosDefecto(selectCurso);
        }
    } catch (error) {
        console.error('Error al cargar cursos disponibles:', error);
        console.log('Usando cursos por defecto debido al error');
        agregarCursosDefecto(selectCurso);
    }
}

// Función auxiliar para agregar cursos por defecto
function agregarCursosDefecto(selectElement) {
    selectElement.innerHTML = '<option value="">Seleccionar curso</option>';
    const cursosDefecto = ['1A', '1B', '2A', '2B', '3A', '3B'];
    
    cursosDefecto.forEach(curso => {
        const option = document.createElement('option');
        option.value = curso;
        option.textContent = curso;
        selectElement.appendChild(option);
    });
    
    console.log('✅ Cursos por defecto cargados como fallback');
}