// Variables globales
let tareasActuales = [];
let usuarioActual = null;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    const autenticado = verificarAutenticacion();
    
    if (autenticado) {
        // Event listeners
        const formTarea = document.getElementById('formTarea');
        if (formTarea) {
            formTarea.addEventListener('submit', crearTarea);
        }
        
        // Cargar cursos para calificaciones después de un delay
        setTimeout(() => {
            if (usuarioActual && usuarioActual.tipo === 'profesor') {
                console.log('👩‍🏫 Cargando cursos para calificaciones...');
                cargarCursosCalificaciones();
            }
        }, 3000);
    }
});

// Función para verificar autenticación
function verificarAutenticacion() {
    console.log('Verificando autenticación...');
    const session = localStorage.getItem('userSession');
    
    if (!session) {
        console.log('No hay sesión, redirigiendo al login');
        limpiarSesion();
        window.location.href = '/login';
        return false;
    }
    
    try {
        usuarioActual = JSON.parse(session);
        console.log('Usuario encontrado:', usuarioActual);
        
        // Verificar que la sesión tenga los datos necesarios
        if (!usuarioActual.tipo || !usuarioActual.nombre) {
            console.log('Sesión inválida, limpiando...');
            limpiarSesion();
            window.location.href = '/login';
            return false;
        }
        
        configurarInterfazUsuario();
        return true;
    } catch (error) {
        console.error('Error al parsear sesión:', error);
        limpiarSesion();
        window.location.href = '/login';
        return false;
    }
}

// Función para limpiar completamente la sesión
function limpiarSesion() {
    localStorage.removeItem('userSession');
    localStorage.removeItem('entregas');
    localStorage.removeItem('nombreEstudiante');
    usuarioActual = null;
}

// Función para configurar la interfaz según el usuario
function configurarInterfazUsuario() {
    console.log('Configurando interfaz para:', usuarioActual);
    const navbar = document.querySelector('.navbar-nav');
    
    if (!navbar) {
        console.error('No se encontró el elemento navbar-nav');
        return;
    }
    
    // Limpiar botones existentes
    navbar.innerHTML = '';
    
    if (usuarioActual.tipo === 'profesor') {
        // Interfaz para profesor
        navbar.innerHTML = `
            <span class="navbar-text me-3">
                <i class="fas fa-chalkboard-teacher me-2"></i>
                Bienvenida, ${usuarioActual.nombre}
            </span>
            
            <!-- Botones principales -->
            <button class="btn btn-outline-light me-2" onclick="mostrarVistaProfesor()">
                <i class="fas fa-tasks"></i><span class="d-none d-md-inline ms-1">Tareas</span>
            </button>
            <button class="btn btn-outline-light me-2" onclick="mostrarVistaEstudiante()">
                <i class="fas fa-eye"></i><span class="d-none d-lg-inline ms-1">Vista Estudiante</span>
            </button>
            <button class="btn btn-outline-success me-2" onclick="mostrarGestionEstudiantes()">
                <i class="fas fa-users"></i><span class="d-none d-md-inline ms-1">Estudiantes</span>
            </button>
            <button class="btn btn-outline-primary me-2" onclick="mostrarCalificaciones()">
                <i class="fas fa-star"></i><span class="d-none d-md-inline ms-1">Calificaciones</span>
            </button>
            
            <!-- Menú de Herramientas -->
            <div class="dropdown me-2">
                <button class="btn btn-outline-info dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <i class="fas fa-tools"></i><span class="d-none d-lg-inline ms-1">Herramientas</span>
                </button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#" onclick="mostrarDiagnostico()">
                        <i class="fas fa-cog me-2"></i>Diagnóstico
                    </a></li>
                    <li><a class="dropdown-item" href="#" onclick="simplificarIDsEstudiantes()">
                        <i class="fas fa-sort-numeric-down me-2"></i>Simplificar IDs
                    </a></li>
                    <li><a class="dropdown-item" href="#" onclick="regenerarCalificaciones()">
                        <i class="fas fa-sync me-2"></i>Regenerar Calificaciones
                    </a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" onclick="limpiarCalificaciones()">
                        <i class="fas fa-broom me-2"></i>Limpiar Calificaciones
                    </a></li>
                </ul>
            </div>
            
            <!-- Menú de Pruebas -->
            <div class="dropdown me-2">
                <button class="btn btn-outline-warning dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <i class="fas fa-flask"></i><span class="d-none d-lg-inline ms-1">Pruebas</span>
                </button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#" onclick="probarCalificaciones()">
                        <i class="fas fa-test-tube me-2"></i>Probar Calificaciones
                    </a></li>
                    <li><a class="dropdown-item" href="#" onclick="probarVistaProfesor()">
                        <i class="fas fa-bug me-2"></i>Probar Vista
                    </a></li>
                    <li><a class="dropdown-item" href="#" onclick="probarEliminacionCompleta()">
                        <i class="fas fa-flask me-2"></i>Probar Eliminación
                    </a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" onclick="mostrarInfoEliminacion()">
                        <i class="fas fa-info-circle me-2"></i>Info Eliminación
                    </a></li>
                </ul>
            </div>
            
            <button class="btn btn-outline-light" onclick="cerrarSesion()">
                <i class="fas fa-sign-out-alt"></i><span class="d-none d-md-inline ms-1">Cerrar Sesión</span>
            </button>
        `;
        
        // Mostrar solo vista profesor
        document.getElementById('vistaProfesor').style.display = 'block';
        document.getElementById('vistaEstudiante').style.display = 'none';
        
        // Cargar datos del profesor
        cargarTareas();
        cargarEntregas();
        cargarCursos();
        cargarCursosGestion();
        cargarCursosCalificaciones();
        
    } else if (usuarioActual.tipo === 'estudiante') {
        // Interfaz para estudiante
        navbar.innerHTML = `
            <span class="navbar-text me-3">
                <i class="fas fa-user-graduate me-2"></i>
                ${usuarioActual.nombre} - Curso ${usuarioActual.curso}
            </span>
            <button class="btn btn-outline-light me-2" onclick="mostrarVistaEstudiante()">
                <i class="fas fa-clipboard-list"></i> Mis Tareas
            </button>
            <button class="btn btn-outline-light me-2" onclick="mostrarVistaProfesor()">
                <i class="fas fa-eye"></i> Vista Profesor
            </button>
            <button class="btn btn-outline-light" onclick="cerrarSesion()">
                <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
            </button>
        `;
        
        // Mostrar solo vista estudiante
        document.getElementById('vistaProfesor').style.display = 'none';
        document.getElementById('vistaEstudiante').style.display = 'block';
        
        // Cargar datos del estudiante
        cargarTareasEstudiante();
        
        // Actualizar perfil del estudiante
        const nombreEstudianteInput = document.getElementById('nombreEstudiante');
        if (nombreEstudianteInput) {
            nombreEstudianteInput.value = usuarioActual.nombre;
            nombreEstudianteInput.disabled = true;
        }
        
        // Actualizar información del curso en el header
        const cursoInfo = document.getElementById('cursoInfo');
        if (cursoInfo) {
            cursoInfo.textContent = `Mostrando tareas del curso ${usuarioActual.curso}`;
        }
    }
}

// Función para cerrar sesión
function cerrarSesion() {
    console.log('Cerrando sesión...');
    limpiarSesion();
    mostrarAlerta('Sesión cerrada correctamente', 'success');
    setTimeout(() => {
        window.location.href = '/login';
    }, 1000);
}

// Funciones de navegación
function mostrarVistaProfesor() {
    console.log('🎯 Cambiando a vista profesor');
    try {
        const vistaProfesor = document.getElementById('vistaProfesor');
        const vistaEstudiante = document.getElementById('vistaEstudiante');
        
        console.log('📋 Elementos encontrados:', {
            vistaProfesor: !!vistaProfesor,
            vistaEstudiante: !!vistaEstudiante
        });
        
        if (!vistaProfesor) {
            console.error('❌ Elemento vistaProfesor no encontrado');
            mostrarAlerta('Error: Vista de profesor no encontrada', 'error');
            return;
        }
        
        if (!vistaEstudiante) {
            console.error('❌ Elemento vistaEstudiante no encontrado');
            mostrarAlerta('Error: Vista de estudiante no encontrada', 'error');
            return;
        }
        
        // Cambiar vistas
        vistaProfesor.style.display = 'block';
        vistaEstudiante.style.display = 'none';
        
        console.log('✅ Vistas cambiadas correctamente');
        console.log('📚 Cargando tareas...');
        console.log('👤 Usuario actual:', usuarioActual);
        
        // Verificar que el usuario sea profesor
        if (!usuarioActual || usuarioActual.tipo !== 'profesor') {
            console.error('❌ Usuario no es profesor o no está autenticado');
            mostrarAlerta('Error: Debes estar logueado como profesor', 'error');
            return;
        }
        
        // Cargar datos
        cargarTareas();
        
        // Scroll hacia arriba para mostrar la vista
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        console.log('🎉 Vista profesor mostrada exitosamente');
    } catch (error) {
        console.error('❌ Error al mostrar vista profesor:', error);
        mostrarAlerta('Error al cambiar a vista profesor', 'error');
    }
}

function mostrarVistaEstudiante() {
    console.log('Cambiando a vista estudiante');
    try {
        document.getElementById('vistaProfesor').style.display = 'none';
        document.getElementById('vistaEstudiante').style.display = 'block';
        cargarTareasEstudiante();
    } catch (error) {
        console.error('Error al mostrar vista estudiante:', error);
    }
}

// Función para crear tarea (Profesor)
async function crearTarea(e) {
    e.preventDefault();
    
    const titulo = document.getElementById('tituloTarea').value;
    const descripcion = document.getElementById('descripcionTarea').value;
    const materia = document.getElementById('materiaTarea').value;
    const fechaLimite = document.getElementById('fechaLimite').value;
    
    try {
        const response = await fetch('/api/tareas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                titulo,
                descripcion,
                materia,
                fechaLimite
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            mostrarAlerta('Tarea creada exitosamente', 'success');
            document.getElementById('formTarea').reset();
            cargarTareas();
        } else {
            mostrarAlerta('Error al crear la tarea', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error de conexión', 'error');
    }
}

// Función para cargar tareas (Profesor)
async function cargarTareas() {
    console.log('Cargando tareas...');
    try {
        const cursoSeleccionado = document.getElementById('filtroCursoTareas')?.value || 'todos';
        const url = cursoSeleccionado === 'todos' ? '/api/tareas' : `/api/tareas?curso=${encodeURIComponent(cursoSeleccionado)}`;
        
        const response = await fetch(url);
        console.log('Respuesta recibida:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Datos recibidos:', result);
        
        if (result.success) {
            tareasActuales = result.tareas;
            console.log('Tareas cargadas:', tareasActuales.length);
            mostrarTareasProfesor(result.tareas);
            actualizarEstadisticas(result.tareas);
            actualizarFiltroTareas();
        } else {
            console.error('Error al cargar tareas:', result.message);
            mostrarAlerta('Error al cargar tareas', 'error');
        }
        
    } catch (error) {
        console.error('Error al cargar tareas:', error);
        mostrarAlerta('Error de conexión al cargar tareas', 'error');
    }
}

// Función para mostrar tareas en vista profesor
function mostrarTareasProfesor(tareas) {
    console.log('📋 Mostrando tareas del profesor:', tareas);
    const container = document.getElementById('listaTareasProfesor');
    
    if (!container) {
        console.error('❌ Elemento listaTareasProfesor no encontrado');
        mostrarAlerta('Error: Contenedor de tareas no encontrado', 'error');
        return;
    }
    
    console.log('✅ Contenedor de tareas encontrado');
    
    // Validar que tareas sea un array
    if (!tareas || !Array.isArray(tareas)) {
        console.error('Tareas no es un array válido:', tareas);
        container.innerHTML = '<p class="text-muted">Error al cargar tareas.</p>';
        return;
    }
    
    if (tareas.length === 0) {
        container.innerHTML = '<p class="text-muted">No hay tareas creadas aún.</p>';
        return;
    }
    
    const html = tareas.map(tarea => {
        // Validar propiedades de la tarea
        const titulo = tarea.titulo || 'Sin título';
        const descripcion = tarea.descripcion || 'Sin descripción';
        const curso = tarea.materia || 'general';
        const fechaLimite = tarea.fechaLimite || new Date().toISOString();
        const fechaCreacion = tarea.fechaCreacion || new Date().toISOString();
        const entregas = tarea.entregas || [];
        
        return `
            <div class="tarea-item">
                <div class="tarea-titulo">${titulo}</div>
                <div class="tarea-descripcion">${descripcion}</div>
                <div class="tarea-meta">
                    <span class="badge-materia">${obtenerNombreMateria(curso)}</span>
                    <span class="fecha-limite ${obtenerClaseFecha(fechaLimite)}">
                        <i class="fas fa-clock me-1"></i>
                        Vence: ${formatearFecha(fechaLimite)}
                    </span>
                </div>
                <div class="mt-2">
                    <small class="text-muted">
                        Entregas: ${entregas.length} | 
                        Creada: ${formatearFecha(fechaCreacion)}
                    </small>
                </div>
                <div class="mt-3 d-flex gap-2">
                    <button class="btn btn-sm btn-outline-primary" onclick="editarTarea(${tarea.id})">
                        <i class="fas fa-edit me-1"></i>Editar
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="eliminarTarea(${tarea.id})">
                        <i class="fas fa-trash me-1"></i>Eliminar
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = html;
}

// Función para cargar tareas (Estudiante)
async function cargarTareasEstudiante() {
    console.log('Cargando tareas para estudiante...');
    try {
        // Construir URL con filtro de curso para estudiantes
        let url = '/api/tareas';
        if (usuarioActual && usuarioActual.tipo === 'estudiante' && usuarioActual.curso) {
            url += `?curso=${encodeURIComponent(usuarioActual.curso)}`;
            console.log('Solicitando tareas para curso:', usuarioActual.curso);
        }
        
        const response = await fetch(url);
        console.log('Respuesta recibida (estudiante):', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Datos recibidos (estudiante):', result);
        
        if (result.success) {
            tareasActuales = result.tareas;
            console.log(`Tareas cargadas para curso ${usuarioActual.curso}:`, result.tareas.length);
            mostrarTareasEstudiante(result.tareas);
            
            // Mostrar mensaje informativo si no hay tareas
            if (result.tareas.length === 0) {
                mostrarAlerta(`No hay tareas disponibles para el curso ${usuarioActual.curso}`, 'info');
            }
        } else {
            console.error('Error al cargar tareas:', result.message);
            mostrarAlerta('Error al cargar tareas', 'error');
        }
        
    } catch (error) {
        console.error('Error al cargar tareas:', error);
        mostrarAlerta('Error de conexión al cargar tareas', 'error');
    }
}

// Función para filtrar tareas por curso del estudiante
function filtrarTareasPorCurso(todasLasTareas) {
    if (!usuarioActual || usuarioActual.tipo !== 'estudiante') {
        return todasLasTareas;
    }
    
    const cursoEstudiante = usuarioActual.curso;
    console.log('Filtrando tareas para curso:', cursoEstudiante);
    
    const tareasFiltradas = todasLasTareas.filter(tarea => {
        // Verificar si la tarea es para el curso del estudiante
        const cursoTarea = tarea.materia || tarea.curso;
        const esDelCurso = cursoTarea === cursoEstudiante;
        
        if (esDelCurso) {
            console.log(`Tarea "${tarea.titulo}" es para curso ${cursoTarea}`);
        }
        
        return esDelCurso;
    });
    
    console.log(`Total de tareas: ${todasLasTareas.length}, Tareas para ${cursoEstudiante}: ${tareasFiltradas.length}`);
    return tareasFiltradas;
}

// Función para mostrar tareas en vista estudiante
function mostrarTareasEstudiante(tareas) {
    const container = document.getElementById('listaTareasEstudiante');
    
    // Validar que tareas sea un array
    if (!tareas || !Array.isArray(tareas)) {
        console.error('Tareas no es un array válido:', tareas);
        container.innerHTML = '<p class="text-muted">Error al cargar tareas.</p>';
        return;
    }
    
    if (tareas.length === 0) {
        const cursoActual = usuarioActual ? usuarioActual.curso : 'tu curso';
        container.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-clipboard-list fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">No hay tareas disponibles</h5>
                <p class="text-muted">No se encontraron tareas para el curso <strong>${cursoActual}</strong></p>
                <small class="text-muted">Las tareas aparecerán aquí cuando tu profesor las publique</small>
            </div>
        `;
        return;
    }
    
    const html = tareas.map(tarea => {
        // Validar propiedades de la tarea
        const id = tarea.id || 0;
        const titulo = tarea.titulo || 'Sin título';
        const descripcion = tarea.descripcion || 'Sin descripción';
        const curso = tarea.materia || 'general';
        const fechaLimite = tarea.fechaLimite || new Date().toISOString();
        
        const yaEntregada = verificarEntrega(id);
        const estadoClase = yaEntregada ? 'estado-entregado' : 
                           estaVencida(fechaLimite) ? 'estado-vencido' : 'estado-pendiente';
        
        return `
            <div class="tarea-item ${estadoClase}">
                <div class="tarea-titulo">${titulo}</div>
                <div class="tarea-descripcion">${descripcion}</div>
                <div class="tarea-meta">
                    <span class="badge-materia">${obtenerNombreMateria(curso)}</span>
                    <span class="fecha-limite ${obtenerClaseFecha(fechaLimite)}">
                        <i class="fas fa-clock me-1"></i>
                        Vence: ${formatearFecha(fechaLimite)}
                    </span>
                </div>
                <div class="mt-3">
                    ${yaEntregada ? 
                        '<span class="badge bg-success"><i class="fas fa-check me-1"></i>Entregada</span>' :
                        `<button class="btn btn-entregar btn-sm" onclick="abrirModalEntrega(${id})">
                            <i class="fas fa-paper-plane me-1"></i>Entregar Tarea
                        </button>`
                    }
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = html;
}

// Función para abrir modal de entrega
function abrirModalEntrega(tareaId) {
    if (!usuarioActual || usuarioActual.tipo !== 'estudiante') {
        mostrarAlerta('Solo los estudiantes pueden entregar tareas', 'error');
        return;
    }
    
    document.getElementById('tareaIdEntrega').value = tareaId;
    const modal = new bootstrap.Modal(document.getElementById('modalEntrega'));
    modal.show();
}

// Función para cambiar tipo de entrega
function cambiarTipoEntrega() {
    const tipo = document.getElementById('tipoEntrega').value;
    const divArchivo = document.getElementById('divArchivo');
    const divEnlace = document.getElementById('divEnlace');
    
    if (tipo === 'archivo') {
        divArchivo.style.display = 'block';
        divEnlace.style.display = 'none';
    } else {
        divArchivo.style.display = 'none';
        divEnlace.style.display = 'block';
    }
}

// Función para enviar entrega
async function enviarEntrega() {
    const tareaId = document.getElementById('tareaIdEntrega').value;
    const tipo = document.getElementById('tipoEntrega').value;
    const comentarios = document.getElementById('comentariosEntrega').value;
    
    const formData = new FormData();
    formData.append('tareaId', tareaId);
    formData.append('estudianteNombre', usuarioActual.nombre);
    formData.append('comentarios', comentarios);
    
    if (tipo === 'archivo') {
        const archivo = document.getElementById('archivoEntrega').files[0];
        if (!archivo) {
            mostrarAlerta('Por favor, selecciona un archivo', 'error');
            return;
        }
        formData.append('archivo', archivo);
    } else {
        const enlace = document.getElementById('enlaceEntrega').value;
        if (!enlace) {
            mostrarAlerta('Por favor, ingresa un enlace válido', 'error');
            return;
        }
        formData.append('enlace', enlace);
    }
    
    try {
        const response = await fetch('/api/entregas', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            mostrarAlerta('Entrega realizada exitosamente', 'success');
            
            // Guardar entrega localmente (temporal)
            const entregasGuardadas = JSON.parse(localStorage.getItem('entregas') || '[]');
            entregasGuardadas.push({
                tareaId: parseInt(tareaId),
                estudiante: usuarioActual.nombre,
                fecha: new Date().toISOString()
            });
            localStorage.setItem('entregas', JSON.stringify(entregasGuardadas));
            
            // Cerrar modal y actualizar vista
            bootstrap.Modal.getInstance(document.getElementById('modalEntrega')).hide();
            cargarTareasEstudiante();
            
            // Limpiar formulario
            document.getElementById('formEntrega').reset();
            cambiarTipoEntrega();
        } else {
            mostrarAlerta('Error al procesar la entrega', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error de conexión', 'error');
    }
}

// Función para guardar perfil del estudiante (ya no es necesaria con autenticación)
function guardarPerfil() {
    mostrarAlerta('El perfil se gestiona automáticamente con tu cuenta', 'info');
}

// Funciones auxiliares
function obtenerNombreMateria(materia) {
    const cursos = {
        '1A': '1A',
        '1B': '1B',
        '2A': '2A',
        '2B': '2B',
        '3A': '3A',
        '3B': '3B'
    };
    return cursos[materia] || materia;
}

function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function obtenerClaseFecha(fechaLimite) {
    const ahora = new Date();
    const limite = new Date(fechaLimite);
    const diferencia = limite - ahora;
    const dias = diferencia / (1000 * 60 * 60 * 24);
    
    if (dias < 0) return 'vencido';
    if (dias < 2) return 'proxima';
    return 'lejana';
}

function estaVencida(fechaLimite) {
    return new Date(fechaLimite) < new Date();
}

function verificarEntrega(tareaId) {
    const entregas = JSON.parse(localStorage.getItem('entregas') || '[]');
    return entregas.some(entrega => 
        entrega.tareaId === tareaId && 
        entrega.estudiante === (usuarioActual ? usuarioActual.nombre : '')
    );
}

function mostrarAlerta(mensaje, tipo) {
    // Crear elemento de alerta
    const alerta = document.createElement('div');
    alerta.className = `alert alert-${tipo === 'success' ? 'success' : 'danger'} alert-dismissible fade show position-fixed`;
    alerta.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alerta.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alerta);
    
    // Auto-remover después de 3 segundos
    setTimeout(() => {
        if (alerta.parentNode) {
            alerta.remove();
        }
    }, 3000);
}

// Función para actualizar estadísticas del profesor
function actualizarEstadisticas(tareas) {
    const tareasActivas = tareas.filter(t => t.estado === 'Activa' || !t.estado).length;
    const totalTareas = tareas.length;
    
    // Actualizar números en la interfaz
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length >= 2) {
        statNumbers[0].textContent = tareasActivas;
        statNumbers[1].textContent = '0'; // Entregas pendientes (por implementar)
    }
}

// Función para editar tarea
function editarTarea(tareaId) {
    const tarea = tareasActuales.find(t => t.id === tareaId);
    if (!tarea) {
        mostrarAlerta('Tarea no encontrada', 'error');
        return;
    }
    
    // Llenar el formulario con los datos actuales
    document.getElementById('tareaIdEditar').value = tarea.id;
    document.getElementById('tituloTareaEditar').value = tarea.titulo;
    document.getElementById('descripcionTareaEditar').value = tarea.descripcion;
    document.getElementById('materiaTareaEditar').value = tarea.materia;
    
    // Convertir fecha para el input datetime-local
    if (tarea.fechaLimite) {
        const fecha = new Date(tarea.fechaLimite);
        const fechaLocal = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000);
        document.getElementById('fechaLimiteEditar').value = fechaLocal.toISOString().slice(0, 16);
    }
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('modalEditarTarea'));
    modal.show();
}

// Función para guardar edición de tarea
async function guardarEdicionTarea() {
    const tareaId = document.getElementById('tareaIdEditar').value;
    const titulo = document.getElementById('tituloTareaEditar').value;
    const descripcion = document.getElementById('descripcionTareaEditar').value;
    const materia = document.getElementById('materiaTareaEditar').value;
    const fechaLimite = document.getElementById('fechaLimiteEditar').value;
    
    try {
        const response = await fetch(`/api/tareas/${tareaId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                titulo,
                descripcion,
                materia,
                fechaLimite
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            mostrarAlerta('Tarea actualizada exitosamente', 'success');
            
            // Cerrar modal
            bootstrap.Modal.getInstance(document.getElementById('modalEditarTarea')).hide();
            
            // Recargar tareas
            cargarTareas();
        } else {
            mostrarAlerta(result.message || 'Error al actualizar la tarea', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error de conexión', 'error');
    }
}

// Función para eliminar tarea
async function eliminarTarea(tareaId) {
    const tarea = tareasActuales.find(t => t.id === tareaId);
    if (!tarea) {
        mostrarAlerta('Tarea no encontrada', 'error');
        return;
    }
    
    // Confirmar eliminación con información detallada
    const confirmMessage = `¿Estás segura de que deseas eliminar la tarea "${tarea.titulo}"?\n\n` +
                          `Curso: ${tarea.materia}\n` +
                          `Fecha límite: ${tarea.fechaLimite}\n\n` +
                          `⚠️ ATENCIÓN: Esta acción eliminará:\n` +
                          `• La tarea del sistema\n` +
                          `• La tarea de Google Sheets\n` +
                          `• La columna de calificaciones del curso ${tarea.materia}\n` +
                          `• Todas las calificaciones asociadas\n\n` +
                          `Esta acción NO se puede deshacer.`;
    
    if (!confirm(confirmMessage)) {
        return;
    }
    
    try {
        console.log(`🗑️ Eliminando tarea: ${tarea.titulo} (ID: ${tareaId})`);
        mostrarAlerta('Eliminando tarea...', 'info');
        
        const response = await fetch(`/api/tareas/${tareaId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        console.log('Resultado de eliminación:', result);
        
        if (result.success) {
            let mensaje = `✅ ${result.message}`;
            
            // Agregar información adicional si está disponible
            if (result.sheetsResult && result.sheetsResult.success) {
                mensaje += '\n📊 Eliminada de Google Sheets y calificaciones';
            }
            
            mostrarAlerta(mensaje, 'success');
            
            // Recargar tareas y entregas
            cargarTareas();
            cargarEntregas();
            
            // Si hay calificaciones abiertas, recargarlas también
            const cursoSeleccionado = document.getElementById('filtroCursoCalificaciones')?.value;
            if (cursoSeleccionado) {
                setTimeout(() => {
                    cargarCalificaciones();
                }, 1500);
            }
        } else {
            mostrarAlerta(`❌ ${result.message}`, 'error');
        }
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
        mostrarAlerta('❌ Error de conexión al eliminar tarea', 'error');
    }
}

// Función para cargar entregas (Profesor)
async function cargarEntregas() {
    try {
        const cursoSeleccionado = document.getElementById('filtroCursoEntregas')?.value || 'todos';
        const tareaId = document.getElementById('filtroTareaEntregas')?.value || '';
        
        let url = '/api/entregas';
        const params = [];
        
        if (cursoSeleccionado !== 'todos') {
            params.push(`curso=${encodeURIComponent(cursoSeleccionado)}`);
        }
        if (tareaId) {
            params.push(`tareaId=${tareaId}`);
        }
        
        if (params.length > 0) {
            url += `?${params.join('&')}`;
        }
        
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.success) {
            mostrarEntregasProfesor(result.entregas);
            actualizarFiltroTareas();
        } else {
            console.error('Error al cargar entregas:', result.message);
        }
    } catch (error) {
        console.error('Error al cargar entregas:', error);
    }
}

// Función para actualizar el filtro de tareas
// Función para filtrar entregas cuando cambia el curso
function filtrarEntregasPorCurso() {
    // Resetear el filtro de tareas cuando cambia el curso
    const filtroTareas = document.getElementById('filtroTareaEntregas');
    if (filtroTareas) {
        filtroTareas.value = '';
    }
    
    // Actualizar filtro de tareas y cargar entregas
    actualizarFiltroTareas();
    cargarEntregas();
}

function actualizarFiltroTareas() {
    const filtro = document.getElementById('filtroTareaEntregas');
    if (!filtro || !tareasActuales) return;
    
    const cursoSeleccionado = document.getElementById('filtroCursoEntregas')?.value || 'todos';
    
    // Limpiar opciones existentes (excepto "Todas las tareas")
    filtro.innerHTML = '<option value="">Todas las tareas</option>';
    
    // Filtrar tareas por curso si es necesario
    let tareasFiltradas = tareasActuales;
    if (cursoSeleccionado !== 'todos') {
        tareasFiltradas = tareasActuales.filter(tarea => tarea.materia === cursoSeleccionado);
    }
    
    // Agregar opciones de tareas
    tareasFiltradas.forEach(tarea => {
        const option = document.createElement('option');
        option.value = tarea.id;
        option.textContent = `${tarea.titulo} (${obtenerNombreMateria(tarea.materia)})`;
        filtro.appendChild(option);
    });
}

// Función para mostrar entregas en vista profesor
function mostrarEntregasProfesor(entregas) {
    const container = document.getElementById('listaEntregasProfesor');
    
    if (!entregas || entregas.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">No hay entregas disponibles</h5>
                <p class="text-muted">Las entregas de los estudiantes aparecerán aquí</p>
            </div>
        `;
        return;
    }
    
    const html = entregas.map(entrega => {
        const fechaEntrega = formatearFecha(entrega.fechaEntrega);
        const tarea = tareasActuales.find(t => t.id === entrega.tareaId);
        const tituloTarea = tarea ? tarea.titulo : `Tarea ID: ${entrega.tareaId}`;
        
        return `
            <div class="entrega-item mb-3 p-3 border rounded">
                <div class="row align-items-center">
                    <div class="col-md-6">
                        <h6 class="mb-1">
                            <i class="fas fa-user me-2"></i>${entrega.estudianteNombre}
                        </h6>
                        <small class="text-muted">
                            <i class="fas fa-book me-1"></i>${tituloTarea}
                        </small>
                    </div>
                    <div class="col-md-3">
                        <small class="text-muted">
                            <i class="fas fa-clock me-1"></i>${fechaEntrega}
                        </small>
                        <br>
                        <span class="badge ${entrega.tipo === 'archivo' ? 'bg-primary' : 'bg-info'}">
                            <i class="fas fa-${entrega.tipo === 'archivo' ? 'file' : 'link'} me-1"></i>
                            ${entrega.tipo === 'archivo' ? 'Archivo' : 'Enlace'}
                        </span>
                    </div>
                    <div class="col-md-3 text-end">
                        <div class="mb-2">
                            ${entrega.tipo === 'archivo' ? 
                                `<button class="btn btn-sm btn-success me-1" onclick="descargarArchivo('${entrega.contenido}')">
                                    <i class="fas fa-download me-1"></i>Descargar
                                </button>
                                <button class="btn btn-sm btn-outline-primary" onclick="verArchivo('${entrega.contenido}')">
                                    <i class="fas fa-eye me-1"></i>Ver
                                </button>` :
                                `<a href="${entrega.contenido}" target="_blank" class="btn btn-sm btn-info">
                                    <i class="fas fa-external-link-alt me-1"></i>Abrir Enlace
                                </a>`
                            }
                        </div>
                        <div>
                            <button class="btn btn-sm btn-warning" onclick="calificarDesdeEntrega('${entrega.estudianteNombre}', ${entrega.tareaId}, '${tituloTarea}')">
                                <i class="fas fa-star me-1"></i>Calificar
                            </button>
                        </div>
                    </div>
                </div>
                ${entrega.comentarios ? 
                    `<div class="mt-2">
                        <small class="text-muted">
                            <i class="fas fa-comment me-1"></i>
                            <strong>Comentario:</strong> ${entrega.comentarios}
                        </small>
                    </div>` : ''
                }
            </div>
        `;
    }).join('');
    
    container.innerHTML = html;
}

// Función para descargar archivo
function descargarArchivo(filename) {
    const link = document.createElement('a');
    link.href = `/api/descargar/${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    mostrarAlerta('Descarga iniciada', 'success');
}

// Función para ver archivo en nueva ventana
function verArchivo(filename) {
    const url = `/uploads/${filename}`;
    window.open(url, '_blank');
}

// Función para calificar desde entrega
function calificarDesdeEntrega(estudianteNombre, tareaId, tituloTarea) {
    console.log('Calificando desde entrega:', { estudianteNombre, tareaId, tituloTarea });
    
    // Buscar la tarea para obtener la materia
    const tarea = tareasActuales.find(t => t.id === tareaId);
    if (!tarea) {
        mostrarAlerta('Error: No se pudo encontrar la información de la tarea', 'error');
        return;
    }
    
    // Abrir modal de calificación
    abrirModalCalificacion(estudianteNombre, tarea.titulo, tarea.materia, '');
}

// Función para verificar estado de Google Sheets
async function verificarEstadoGoogleSheets() {
    try {
        const response = await fetch('/api/status/sheets');
        const result = await response.json();
        
        if (result.success) {
            console.log('📊 Estado de Google Sheets:', result.status);
            
            const status = result.status;
            let mensaje = `🔗 Google Sheets: ${status.connected ? 'CONECTADO ✅' : 'DESCONECTADO ❌'}\n`;
            mensaje += `📄 ID de Hoja: ${status.sheetsId}\n`;
            mensaje += `📧 Email: ${status.clientEmail}\n`;
            mensaje += `📚 Tareas en cache: ${status.tareasCache}\n`;
            mensaje += `👥 Estudiantes en cache: ${status.estudiantesCache}\n`;
            
            if (status.testResults) {
                mensaje += `\n🧪 Prueba de conexión:\n`;
                if (status.testResults.error) {
                    mensaje += `❌ Error: ${status.testResults.error}`;
                } else {
                    mensaje += `📚 Tareas desde Sheets: ${status.testResults.tareasFromSheets}\n`;
                    mensaje += `👥 Estudiantes desde Sheets: ${status.testResults.estudiantesFromSheets}`;
                }
            }
            
            alert(mensaje);
        } else {
            alert('❌ Error al verificar estado: ' + result.error);
        }
    } catch (error) {
        console.error('Error al verificar estado:', error);
        alert('❌ Error de conexión al verificar estado');
    }
}

// Función para mostrar información de diagnóstico
function mostrarDiagnostico() {
    verificarEstadoGoogleSheets();
}

// Función para forzar logout (útil para debugging)
function forzarLogout() {
    console.log('Forzando logout...');
    limpiarSesion();
    window.location.href = '/login';
}

// Función para verificar datos de sesión (debugging)
function verificarDatosSesion() {
    const session = localStorage.getItem('userSession');
    console.log('Datos de sesión actuales:', session);
    if (session) {
        try {
            const datos = JSON.parse(session);
            console.log('Datos parseados:', datos);
        } catch (error) {
            console.error('Error al parsear sesión:', error);
        }
    }
}

// Función de prueba para verificar el flujo de autenticación
// Función para mostrar gestión de estudiantes
function mostrarGestionEstudiantes() {
    console.log('Mostrando gestión de estudiantes');
    
    // Scroll hacia la sección de estudiantes
    const seccionEstudiantes = document.querySelector('.card:has(#listaEstudiantes)');
    if (seccionEstudiantes) {
        seccionEstudiantes.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Cargar estudiantes y cursos
    cargarCursos();
    cargarEstudiantes();
}

// Función para cargar cursos disponibles
async function cargarCursos() {
    try {
        const response = await fetch('/api/cursos');
        const result = await response.json();
        
        if (result.success) {
            // Cargar cursos para filtro de estudiantes
            const selectEstudiantes = document.getElementById('filtroCursoEstudiantes');
            if (selectEstudiantes) {
                selectEstudiantes.innerHTML = '<option value="todos">Todos los cursos</option>';
                result.cursos.forEach(curso => {
                    const option = document.createElement('option');
                    option.value = curso;
                    option.textContent = curso;
                    selectEstudiantes.appendChild(option);
                });
            }
            
            // Cargar cursos para filtro de tareas
            const selectTareas = document.getElementById('filtroCursoTareas');
            if (selectTareas) {
                selectTareas.innerHTML = '<option value="todos">Todos los cursos</option>';
                result.cursos.forEach(curso => {
                    const option = document.createElement('option');
                    option.value = curso;
                    option.textContent = curso;
                    selectTareas.appendChild(option);
                });
            }
            
            // Cargar cursos para filtro de entregas
            const selectEntregas = document.getElementById('filtroCursoEntregas');
            if (selectEntregas) {
                selectEntregas.innerHTML = '<option value="todos">Todos los cursos</option>';
                result.cursos.forEach(curso => {
                    const option = document.createElement('option');
                    option.value = curso;
                    option.textContent = curso;
                    selectEntregas.appendChild(option);
                });
            }
            
            // Cargar cursos para formulario de creación de tareas
            const selectMateriaTarea = document.getElementById('materiaTarea');
            if (selectMateriaTarea) {
                const valorActual = selectMateriaTarea.value; // Preservar selección actual
                selectMateriaTarea.innerHTML = '<option value="">Seleccionar curso</option>';
                
                result.cursos.forEach(curso => {
                    const option = document.createElement('option');
                    option.value = curso;
                    option.textContent = curso;
                    selectMateriaTarea.appendChild(option);
                });
                
                // Si no hay cursos dinámicos, agregar cursos por defecto como fallback
                if (result.cursos.length === 0) {
                    const cursosDefecto = ['1A', '1B', '2A', '2B', '3A', '3B'];
                    cursosDefecto.forEach(curso => {
                        const option = document.createElement('option');
                        option.value = curso;
                        option.textContent = curso;
                        selectMateriaTarea.appendChild(option);
                    });
                }
                
                // Restaurar selección si era válida
                if (valorActual && [...selectMateriaTarea.options].some(opt => opt.value === valorActual)) {
                    selectMateriaTarea.value = valorActual;
                }
            }
            
            // Cargar cursos para formulario de edición de tareas
            const selectMateriaTareaEditar = document.getElementById('materiaTareaEditar');
            if (selectMateriaTareaEditar) {
                const valorActual = selectMateriaTareaEditar.value; // Preservar selección actual
                selectMateriaTareaEditar.innerHTML = '<option value="">Seleccionar curso</option>';
                
                result.cursos.forEach(curso => {
                    const option = document.createElement('option');
                    option.value = curso;
                    option.textContent = curso;
                    selectMateriaTareaEditar.appendChild(option);
                });
                
                // Si no hay cursos dinámicos, agregar cursos por defecto como fallback
                if (result.cursos.length === 0) {
                    const cursosDefecto = ['1A', '1B', '2A', '2B', '3A', '3B'];
                    cursosDefecto.forEach(curso => {
                        const option = document.createElement('option');
                        option.value = curso;
                        option.textContent = curso;
                        selectMateriaTareaEditar.appendChild(option);
                    });
                }
                
                // Restaurar selección si era válida
                if (valorActual && [...selectMateriaTareaEditar.options].some(opt => opt.value === valorActual)) {
                    selectMateriaTareaEditar.value = valorActual;
                }
            }
        }
    } catch (error) {
        console.error('Error al cargar cursos:', error);
        
        // En caso de error, cargar cursos por defecto en los formularios de tareas
        const selectMateriaTarea = document.getElementById('materiaTarea');
        const selectMateriaTareaEditar = document.getElementById('materiaTareaEditar');
        
        [selectMateriaTarea, selectMateriaTareaEditar].forEach(select => {
            if (select && select.options.length <= 1) { // Solo si está vacío o solo tiene placeholder
                const cursosDefecto = ['1A', '1B', '2A', '2B', '3A', '3B'];
                cursosDefecto.forEach(curso => {
                    const option = document.createElement('option');
                    option.value = curso;
                    option.textContent = curso;
                    select.appendChild(option);
                });
            }
        });
    }
}

// Función para cargar estudiantes
async function cargarEstudiantes() {
    try {
        const cursoSeleccionado = document.getElementById('filtroCursoEstudiantes').value;
        const url = cursoSeleccionado === 'todos' ? '/api/estudiantes' : `/api/estudiantes?curso=${encodeURIComponent(cursoSeleccionado)}`;
        
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.success) {
            mostrarEstudiantes(result.estudiantes);
        } else {
            mostrarAlerta('Error al cargar estudiantes', 'error');
        }
    } catch (error) {
        console.error('Error al cargar estudiantes:', error);
        mostrarAlerta('Error de conexión al cargar estudiantes', 'error');
    }
}

// Función para mostrar lista de estudiantes
function mostrarEstudiantes(estudiantes) {
    const container = document.getElementById('listaEstudiantes');
    
    if (!estudiantes || estudiantes.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-user-graduate fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">No hay estudiantes registrados</h5>
                <p class="text-muted">Los estudiantes aparecerán aquí cuando se registren</p>
            </div>
        `;
        return;
    }
    
    let html = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Usuario</th>
                        <th>Curso</th>
                        <th>Fecha Registro</th>
                        <th>Último Acceso</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    estudiantes.forEach(estudiante => {
        const fechaRegistro = estudiante.fechaRegistro ? new Date(estudiante.fechaRegistro).toLocaleDateString() : 'N/A';
        const ultimoAcceso = estudiante.ultimoAcceso ? new Date(estudiante.ultimoAcceso).toLocaleDateString() : 'Nunca';
        
        html += `
            <tr>
                <td><span class="badge bg-primary">${estudiante.id}</span></td>
                <td><strong>${estudiante.nombre}</strong></td>
                <td><code>${estudiante.usuario}</code></td>
                <td><span class="badge bg-info">${estudiante.curso}</span></td>
                <td>${fechaRegistro}</td>
                <td>${ultimoAcceso}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="eliminarEstudiante(${estudiante.id}, '${estudiante.nombre}')" title="Eliminar estudiante">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
        <div class="mt-3">
            <small class="text-muted">
                <i class="fas fa-info-circle me-1"></i>
                Total de estudiantes: <strong>${estudiantes.length}</strong>
            </small>
        </div>
    `;
    
    container.innerHTML = html;
}

// Función para eliminar estudiante
async function eliminarEstudiante(estudianteId, nombreEstudiante) {
    if (!confirm(`¿Estás segura de que quieres eliminar al estudiante "${nombreEstudiante}"?\n\nEsta acción no se puede deshacer.`)) {
        return;
    }
    
    try {
        mostrarAlerta('Eliminando estudiante...', 'info');
        
        const response = await fetch(`/api/estudiantes/${estudianteId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            mostrarAlerta(`✅ ${result.message}`, 'success');
            // Recargar la lista de estudiantes
            cargarEstudiantes();
        } else {
            mostrarAlerta(`❌ Error: ${result.message}`, 'error');
        }
    } catch (error) {
        console.error('Error al eliminar estudiante:', error);
        mostrarAlerta('❌ Error de conexión al eliminar estudiante', 'error');
    }
}

// Función para mostrar calificaciones
function mostrarCalificaciones() {
    console.log('🎯 Mostrando sistema de calificaciones');
    
    // Scroll hacia la sección de calificaciones
    const seccionCalificaciones = document.querySelector('.card:has(#tablaCalificaciones)');
    if (seccionCalificaciones) {
        seccionCalificaciones.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Cargar tareas y cursos para calificaciones
    console.log('📚 Cargando tareas...');
    cargarTareas(); // Asegurar que las tareas estén cargadas
    
    console.log('🏫 Cargando cursos para calificaciones...');
    cargarCursosCalificaciones();
    
    // Mostrar mensaje de carga
    mostrarAlerta('Cargando sistema de calificaciones...', 'info');
}

// Función para cargar cursos en el selector de calificaciones
async function cargarCursosCalificaciones() {
    try {
        console.log('🔄 Cargando cursos para calificaciones...');
        const response = await fetch('/api/cursos');
        const result = await response.json();
        
        console.log('📋 Resultado de cursos:', result);
        
        if (result.success) {
            const select = document.getElementById('filtroCursoCalificaciones');
            
            if (!select) {
                console.error('❌ Elemento filtroCursoCalificaciones no encontrado');
                return;
            }
            
            // Limpiar opciones existentes excepto la primera
            select.innerHTML = '<option value="">Selecciona un curso</option>';
            
            // Agregar cursos
            result.cursos.forEach(curso => {
                const option = document.createElement('option');
                option.value = curso;
                option.textContent = curso;
                select.appendChild(option);
                console.log(`➕ Curso agregado: ${curso}`);
            });
            
            console.log(`✅ ${result.cursos.length} cursos cargados en el selector`);
        } else {
            console.error('❌ Error al obtener cursos:', result);
        }
    } catch (error) {
        console.error('Error al cargar cursos para calificaciones:', error);
    }
}

// Función para cargar calificaciones de un curso
async function cargarCalificaciones() {
    try {
        const cursoSeleccionado = document.getElementById('filtroCursoCalificaciones').value;
        
        if (!cursoSeleccionado) {
            document.getElementById('tablaCalificaciones').innerHTML = `
                <div class="text-center py-4">
                    <i class="fas fa-chart-bar fa-3x text-muted mb-3"></i>
                    <h5 class="text-muted">Selecciona un curso para ver las calificaciones</h5>
                </div>
            `;
            return;
        }
        
        console.log('Cargando calificaciones para curso:', cursoSeleccionado);
        mostrarAlerta('Cargando calificaciones...', 'info');
        
        const response = await fetch(`/api/calificaciones/${encodeURIComponent(cursoSeleccionado)}`);
        const result = await response.json();
        
        console.log('Resultado de calificaciones:', result);
        
        if (result.success) {
            console.log('Headers de calificaciones:', result.calificaciones.headers);
            console.log('Estudiantes:', result.calificaciones.estudiantes);
            mostrarTablaCalificaciones(result.calificaciones);
        } else {
            console.error('Error del servidor:', result.message);
            
            // Si no existe la hoja, ofrecer crearla
            if (result.message.includes('no encontrada')) {
                document.getElementById('tablaCalificaciones').innerHTML = `
                    <div class="text-center py-4">
                        <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                        <h5 class="text-muted">Hoja de calificaciones no encontrada</h5>
                        <p class="text-muted">La hoja de calificaciones para el curso ${cursoSeleccionado} no existe aún.</p>
                        <button class="btn btn-primary" onclick="regenerarCalificaciones()">
                            <i class="fas fa-plus me-2"></i>Crear Hoja de Calificaciones
                        </button>
                    </div>
                `;
            } else {
                mostrarAlerta(`Error: ${result.message}`, 'error');
            }
        }
    } catch (error) {
        console.error('Error al cargar calificaciones:', error);
        mostrarAlerta('Error de conexión al cargar calificaciones', 'error');
    }
}

// Función para mostrar tabla de calificaciones
function mostrarTablaCalificaciones(calificaciones) {
    console.log('Mostrando tabla de calificaciones:', calificaciones);
    const container = document.getElementById('tablaCalificaciones');
    
    if (!calificaciones.estudiantes || calificaciones.estudiantes.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-users fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">No hay estudiantes en este curso</h5>
                <p class="text-muted">Los estudiantes aparecerán aquí cuando se registren en el curso ${calificaciones.curso}</p>
            </div>
        `;
        return;
    }
    
    if (!calificaciones.headers || calificaciones.headers.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                <h5 class="text-muted">No hay columnas de calificaciones</h5>
                <p class="text-muted">Las columnas aparecerán cuando se creen tareas</p>
            </div>
        `;
        return;
    }
    
    let html = `
        <div class="table-responsive">
            <table class="table table-bordered table-hover">
                <thead class="table-success">
                    <tr>
    `;
    
    // Headers de la tabla
    calificaciones.headers.forEach(header => {
        if (header === 'Promedio') {
            html += `<th class="text-center bg-warning">${header}</th>`;
        } else {
            html += `<th class="text-center">${header}</th>`;
        }
    });
    
    html += `</tr></thead><tbody>`;
    
    // Filas de estudiantes
    calificaciones.estudiantes.forEach((estudiante, index) => {
        console.log(`👤 Mostrando estudiante ${index + 1}:`, estudiante);
        html += `<tr>`;
        
        calificaciones.headers.forEach(header => {
            const valor = estudiante[header] || '';
            
            if (header === 'Nombre') {
                const nombreEstudiante = valor || estudiante.nombre || estudiante.Nombre || 'Sin nombre';
                console.log(`📝 Nombre para mostrar: "${nombreEstudiante}" (valor: "${valor}", estudiante.nombre: "${estudiante.nombre}", estudiante.Nombre: "${estudiante.Nombre}")`);
                html += `<td><strong>${nombreEstudiante}</strong></td>`;
            } else if (header === 'Promedio') {
                const promedio = parseFloat(valor);
                let clase = '';
                if (!isNaN(promedio)) {
                    if (promedio >= 7) clase = 'text-success';
                    else if (promedio >= 5) clase = 'text-warning';
                    else clase = 'text-danger';
                }
                html += `<td class="text-center ${clase}"><strong>${valor}</strong></td>`;
            } else {
                // Es una tarea - agregar botón para calificar
                const tareaInfo = header.match(/^(.+) \((.+)\)$/);
                if (tareaInfo) {
                    const tituloTarea = tareaInfo[1];
                    const materia = tareaInfo[2];
                    if (valor) {
                        const nota = parseFloat(valor);
                        let clase = '';
                        if (!isNaN(nota)) {
                            if (nota >= 7) clase = 'text-success';
                            else if (nota >= 5) clase = 'text-warning';
                            else clase = 'text-danger';
                        }
                        html += `
                            <td class="text-center">
                                <span class="${clase}"><strong>${valor}</strong></span>
                                <br>
                                <button class="btn btn-sm btn-outline-primary mt-1" 
                                        onclick="abrirModalCalificacion('${estudiante.Nombre}', '${tituloTarea}', '${materia}', '${valor}')">
                                    <i class="fas fa-edit"></i> Editar
                                </button>
                            </td>
                        `;
                    } else {
                        html += `
                            <td class="text-center">
                                <span class="text-muted">Sin calificar</span>
                                <br>
                                <button class="btn btn-sm btn-success mt-1" 
                                        onclick="abrirModalCalificacion('${estudiante.Nombre}', '${tituloTarea}', '${materia}', '')">
                                    <i class="fas fa-plus"></i> Calificar
                                </button>
                            </td>
                        `;
                    }
                } else {
                    html += `<td class="text-center">${valor}</td>`;
                }
            }
        });
        
        html += `</tr>`;
    });
    
    html += `
                </tbody>
            </table>
        </div>
        <div class="mt-3">
            <div class="row">
                <div class="col-md-6">
                    <small class="text-muted">
                        <i class="fas fa-info-circle me-1"></i>
                        Curso: <strong>${calificaciones.curso}</strong> | 
                        Estudiantes: <strong>${calificaciones.estudiantes.length}</strong>
                    </small>
                </div>
                <div class="col-md-6 text-end">
                    <small class="text-muted">
                        <i class="fas fa-check-circle text-success me-1"></i>Entregado
                        <i class="fas fa-times-circle text-muted me-1 ms-3"></i>No entregado
                        <i class="fas fa-star text-warning me-1 ms-3"></i>Calificar desde entregas
                    </small>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// Función para abrir modal de calificación
function abrirModalCalificacion(nombreEstudiante, tituloTarea, materia, calificacionActual) {
    console.log('Abriendo modal de calificación:', { nombreEstudiante, tituloTarea, materia, calificacionActual });
    
    // Verificar que el modal existe
    const modalElement = document.getElementById('modalCalificacion');
    if (!modalElement) {
        console.error('Modal de calificación no encontrado');
        mostrarAlerta('Error: Modal no encontrado', 'error');
        return;
    }
    
    // Llenar los campos del modal
    const estudianteInput = document.getElementById('estudianteCalificacion');
    const tareaInput = document.getElementById('tareaCalificacion');
    const notaInput = document.getElementById('notaCalificacion');
    const tareaIdInput = document.getElementById('tareaIdCalificacion');
    
    if (!estudianteInput || !tareaInput || !notaInput || !tareaIdInput) {
        console.error('Campos del modal no encontrados');
        mostrarAlerta('Error: Campos del modal no encontrados', 'error');
        return;
    }
    
    estudianteInput.value = nombreEstudiante;
    tareaInput.value = `${tituloTarea} (${materia})`;
    notaInput.value = calificacionActual;
    
    // Buscar el ID de la tarea de manera más robusta
    console.log('Tareas disponibles:', tareasActuales);
    
    let tarea = tareasActuales.find(t => t.titulo === tituloTarea && t.materia === materia);
    
    // Si no encuentra por materia, buscar solo por título
    if (!tarea) {
        tarea = tareasActuales.find(t => t.titulo === tituloTarea);
        console.log('Búsqueda por título solamente:', tarea);
    }
    
    if (tarea) {
        tareaIdInput.value = tarea.id;
        console.log('ID de tarea encontrado:', tarea.id);
    } else {
        console.error('No se encontró la tarea:', { tituloTarea, materia });
        mostrarAlerta('Error: No se pudo identificar la tarea. Asegúrate de que las tareas estén cargadas.', 'error');
        return;
    }
    
    // Mostrar modal
    try {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
        console.log('Modal mostrado exitosamente');
    } catch (error) {
        console.error('Error al mostrar modal:', error);
        mostrarAlerta('Error al abrir el modal de calificación', 'error');
    }
}

// Función para guardar calificación
async function guardarCalificacion() {
    try {
        const estudianteNombre = document.getElementById('estudianteCalificacion').value;
        const tareaId = document.getElementById('tareaIdCalificacion').value;
        const calificacion = document.getElementById('notaCalificacion').value;
        
        console.log('Datos para guardar calificación:', { estudianteNombre, tareaId, calificacion });
        
        if (!estudianteNombre || !tareaId || calificacion === '') {
            mostrarAlerta('Por favor completa todos los campos', 'error');
            return;
        }
        
        const nota = parseFloat(calificacion);
        if (isNaN(nota) || nota < 0 || nota > 100) {
            mostrarAlerta('La calificación debe ser un número entre 0 y 100', 'error');
            return;
        }
        
        mostrarAlerta('Guardando calificación...', 'info');
        
        const response = await fetch('/api/calificaciones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                estudianteNombre: estudianteNombre,
                tareaId: parseInt(tareaId),
                calificacion: nota
            })
        });
        
        const result = await response.json();
        console.log('Resultado del servidor:', result);
        
        if (result.success) {
            mostrarAlerta('✅ Calificación guardada exitosamente', 'success');
            
            // Cerrar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalCalificacion'));
            if (modal) {
                modal.hide();
            }
            
            // Recargar calificaciones
            setTimeout(() => {
                cargarCalificaciones();
            }, 1000);
        } else {
            mostrarAlerta(`❌ Error: ${result.message}`, 'error');
        }
    } catch (error) {
        console.error('Error al guardar calificación:', error);
        mostrarAlerta('❌ Error de conexión al guardar calificación', 'error');
    }
}

// Función para probar calificaciones
async function probarCalificaciones() {
    console.log('🧪 Iniciando prueba de calificaciones...');
    
    try {
        // Probar con curso 2A
        console.log('📊 Probando calificaciones para curso 2A...');
        const response = await fetch('/api/calificaciones/2A');
        const result = await response.json();
        
        console.log('📋 Resultado de la prueba:', result);
        
        if (result.success) {
            mostrarAlerta(`✅ Prueba exitosa: ${result.calificaciones.estudiantes.length} estudiantes, ${result.calificaciones.headers.length} columnas`, 'success');
            
            // Mostrar automáticamente las calificaciones
            document.getElementById('filtroCursoCalificaciones').value = '2A';
            mostrarTablaCalificaciones(result.calificaciones);
        } else {
            mostrarAlerta(`❌ Error en prueba: ${result.message}`, 'error');
        }
    } catch (error) {
        console.error('Error en prueba de calificaciones:', error);
        mostrarAlerta('❌ Error de conexión en prueba', 'error');
    }
}

// Función para regenerar calificaciones
async function regenerarCalificaciones() {
    if (!confirm('¿Quieres regenerar las hojas de calificaciones?\n\nEsto actualizará todas las hojas con las tareas existentes.')) {
        return;
    }
    
    try {
        mostrarAlerta('Regenerando hojas de calificaciones...', 'info');
        
        const response = await fetch('/api/admin/regenerar-calificaciones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            mostrarAlerta(`✅ ${result.message}`, 'success');
            // Recargar calificaciones si hay un curso seleccionado
            const cursoSeleccionado = document.getElementById('filtroCursoCalificaciones').value;
            if (cursoSeleccionado) {
                setTimeout(() => {
                    cargarCalificaciones();
                }, 2000);
            }
        } else {
            mostrarAlerta(`❌ Error: ${result.message}`, 'error');
        }
    } catch (error) {
        console.error('Error al regenerar calificaciones:', error);
        mostrarAlerta('❌ Error de conexión al regenerar calificaciones', 'error');
    }
}

// Función para probar eliminación completa
async function probarEliminacionCompleta() {
    console.log('🧪 Iniciando prueba de eliminación completa...');
    
    // Verificar si hay tareas para eliminar
    if (!tareasActuales || tareasActuales.length === 0) {
        mostrarAlerta('❌ No hay tareas para probar la eliminación.\\n\\nPrimero crea una tarea y luego prueba eliminarla.', 'error');
        return;
    }
    
    const tarea = tareasActuales[0];
    const mensaje = `🧪 PRUEBA DE ELIMINACIÓN COMPLETA\\n\\n` +
                   `Tarea a eliminar: "${tarea.titulo}"\\n` +
                   `Curso: ${tarea.materia}\\n\\n` +
                   `✅ Se eliminará de:\\n` +
                   `• Sistema local\\n` +
                   `• Hoja "Tareas" en Google Sheets\\n` +
                   `• Hoja "Calificaciones_${tarea.materia}"\\n\\n` +
                   `🔍 Logs detallados aparecerán en la consola del servidor.\\n\\n` +
                   `¿Continuar con la prueba?`;
    
    if (confirm(mensaje)) {
        console.log('🎯 Ejecutando prueba de eliminación...');
        await eliminarTarea(tarea.id);
        
        setTimeout(() => {
            mostrarAlerta('🧪 Prueba completada.\\n\\nRevisa:\\n• La consola del servidor\\n• Google Sheets\\n• Sección de calificaciones', 'info');
        }, 3000);
    }
}

// Función para mostrar información sobre eliminación de tareas
function mostrarInfoEliminacion() {
    const mensaje = `📋 ELIMINACIÓN COMPLETA DE TAREAS\n\n` +
                   `Cuando eliminas una tarea, se elimina de:\n\n` +
                   `✅ Sistema local (aplicación)\n` +
                   `✅ Hoja "Tareas" en Google Sheets\n` +
                   `✅ Columna correspondiente en "Calificaciones_[Curso]"\n` +
                   `✅ Todas las calificaciones de esa tarea\n\n` +
                   `🔍 PROCESO AUTOMÁTICO:\n` +
                   `1. Identifica el curso de la tarea\n` +
                   `2. Busca la columna en Calificaciones_[Curso]\n` +
                   `3. Elimina la columna completa\n` +
                   `4. Actualiza los promedios automáticamente\n\n` +
                   `⚠️ IMPORTANTE:\n` +
                   `• La eliminación es permanente\n` +
                   `• Se pierden todas las calificaciones\n` +
                   `• Los promedios se recalculan automáticamente\n\n` +
                   `📊 Para verificar:\n` +
                   `1. Elimina una tarea\n` +
                   `2. Ve a Google Sheets\n` +
                   `3. Revisa que la columna desapareció\n` +
                   `4. Verifica en "Calificaciones"`;
    
    mostrarAlerta(mensaje, 'info');
}

// Función para probar la vista del profesor
function probarVistaProfesor() {
    console.log('🧪 Iniciando prueba de vista profesor...');
    
    // Verificar elementos del DOM
    console.log('🔍 Verificando elementos del DOM:');
    const elementos = {
        vistaProfesor: document.getElementById('vistaProfesor'),
        vistaEstudiante: document.getElementById('vistaEstudiante'),
        listaTareasProfesor: document.getElementById('listaTareasProfesor'),
        usuarioActual: usuarioActual
    };
    
    console.log('📋 Elementos encontrados:', elementos);
    
    // Mostrar información en alerta
    let mensaje = '🧪 Diagnóstico de Vista Profesor:\n\n';
    mensaje += `✅ Vista Profesor: ${elementos.vistaProfesor ? 'Encontrada' : '❌ No encontrada'}\n`;
    mensaje += `✅ Vista Estudiante: ${elementos.vistaEstudiante ? 'Encontrada' : '❌ No encontrada'}\n`;
    mensaje += `✅ Lista Tareas: ${elementos.listaTareasProfesor ? 'Encontrada' : '❌ No encontrada'}\n`;
    mensaje += `✅ Usuario: ${elementos.usuarioActual ? elementos.usuarioActual.tipo : '❌ No autenticado'}\n`;
    
    mostrarAlerta(mensaje, 'info');
    
    // Intentar mostrar la vista
    if (elementos.vistaProfesor && elementos.usuarioActual) {
        console.log('🎯 Intentando mostrar vista profesor...');
        mostrarVistaProfesor();
    } else {
        console.error('❌ No se puede mostrar la vista profesor');
    }
}

// Función para limpiar columnas incorrectas en calificaciones
async function limpiarCalificaciones() {
    if (!confirm('¿Quieres limpiar las columnas incorrectas en las hojas de calificaciones?\n\nEsto eliminará las columnas de tareas que están en cursos incorrectos.\n\nPor ejemplo: eliminará tareas de 1A que aparezcan en la hoja de 2A.')) {
        return;
    }
    
    try {
        mostrarAlerta('Limpiando columnas incorrectas...', 'info');
        
        const response = await fetch('/api/admin/limpiar-calificaciones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            mostrarAlerta(`✅ ${result.message}`, 'success');
            // Recargar calificaciones si hay un curso seleccionado
            const cursoSeleccionado = document.getElementById('filtroCursoCalificaciones').value;
            if (cursoSeleccionado) {
                setTimeout(() => {
                    cargarCalificaciones();
                }, 2000);
            }
        } else {
            mostrarAlerta(`❌ Error: ${result.message}`, 'error');
        }
    } catch (error) {
        console.error('Error al limpiar calificaciones:', error);
        mostrarAlerta('❌ Error de conexión al limpiar calificaciones', 'error');
    }
}

// Función para simplificar IDs de estudiantes
async function simplificarIDsEstudiantes() {
    if (!confirm('¿Estás segura de que quieres simplificar los IDs de estudiantes?\n\nEsto cambiará los IDs largos por números simples (1, 2, 3, etc.)')) {
        return;
    }
    
    try {
        mostrarAlerta('Simplificando IDs de estudiantes...', 'info');
        
        const response = await fetch('/api/admin/simplificar-ids', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            mostrarAlerta(`✅ ${result.message}`, 'success');
            // Recargar la lista de estudiantes
            cargarEstudiantes();
        } else {
            mostrarAlerta(`❌ Error: ${result.message}`, 'error');
        }
    } catch (error) {
        console.error('Error al simplificar IDs:', error);
        mostrarAlerta('❌ Error de conexión al simplificar IDs', 'error');
    }
}

function probarFlujoAuth() {
    console.log('=== PRUEBA DE FLUJO DE AUTENTICACIÓN ===');
    console.log('1. Verificando datos de sesión...');
    verificarDatosSesion();
    
    console.log('2. Estado actual de usuarioActual:', usuarioActual);
    
    console.log('3. Elementos del DOM:');
    console.log('- navbar-nav:', document.querySelector('.navbar-nav'));
    console.log('- vistaProfesor:', document.getElementById('vistaProfesor'));
    console.log('- vistaEstudiante:', document.getElementById('vistaEstudiante'));
    
    console.log('=== FIN DE PRUEBA ===');
}

// ==================== GESTIÓN DE CURSOS ====================

// Función para crear un nuevo curso
async function crearCurso() {
    const input = document.getElementById('nuevoCurso');
    const nombreCurso = input.value.trim().toUpperCase();
    
    if (!nombreCurso) {
        mostrarAlerta('Por favor ingresa un nombre para el curso', 'error');
        return;
    }
    
    if (nombreCurso.length > 10) {
        mostrarAlerta('El nombre del curso no puede tener más de 10 caracteres', 'error');
        return;
    }
    
    // Validar que solo contenga letras y números
    if (!/^[A-Z0-9]+$/.test(nombreCurso)) {
        mostrarAlerta('El nombre del curso solo puede contener letras y números', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/cursos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre: nombreCurso })
        });
        
        const result = await response.json();
        
        if (result.success) {
            mostrarAlerta(`Curso "${nombreCurso}" creado exitosamente`, 'success');
            input.value = '';
            cargarCursosGestion();
            cargarCursos(); // Actualizar todos los filtros
        } else {
            mostrarAlerta(`Error al crear curso: ${result.message}`, 'error');
        }
    } catch (error) {
        console.error('Error al crear curso:', error);
        mostrarAlerta('Error de conexión al crear curso', 'error');
    }
}

// Función para eliminar un curso
async function eliminarCurso(nombreCurso) {
    const mensaje = `¿Estás segura de que quieres eliminar el curso "${nombreCurso}"?\n\n` +
                   `⚠️ ADVERTENCIA:\n` +
                   `• Se eliminará la hoja de calificaciones del curso\n` +
                   `• Los estudiantes del curso NO se eliminarán\n` +
                   `• Las tareas del curso NO se eliminarán\n` +
                   `• Esta acción NO se puede deshacer\n\n` +
                   `¿Continuar?`;
    
    if (!confirm(mensaje)) {
        return;
    }
    
    try {
        const response = await fetch(`/api/cursos/${encodeURIComponent(nombreCurso)}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            mostrarAlerta(`Curso "${nombreCurso}" eliminado exitosamente`, 'success');
            cargarCursosGestion();
            cargarCursos(); // Actualizar todos los filtros
        } else {
            mostrarAlerta(`Error al eliminar curso: ${result.message}`, 'error');
        }
    } catch (error) {
        console.error('Error al eliminar curso:', error);
        mostrarAlerta('Error de conexión al eliminar curso', 'error');
    }
}

// Función para cargar cursos en la gestión
async function cargarCursosGestion() {
    try {
        const response = await fetch('/api/cursos/gestion');
        const result = await response.json();
        
        if (result.success) {
            mostrarCursosGestion(result.cursos);
        } else {
            mostrarAlerta('Error al cargar cursos', 'error');
        }
    } catch (error) {
        console.error('Error al cargar cursos:', error);
        mostrarAlerta('Error de conexión al cargar cursos', 'error');
    }
}

// Función para mostrar la lista de cursos en gestión
function mostrarCursosGestion(cursos) {
    const container = document.getElementById('listaCursos');
    
    if (!cursos || cursos.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-graduation-cap fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">No hay cursos registrados</h5>
                <p class="text-muted">Crea el primer curso usando el formulario de arriba</p>
            </div>
        `;
        return;
    }
    
    let html = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>Curso</th>
                        <th>Estudiantes</th>
                        <th>Tareas</th>
                        <th>Hoja Calificaciones</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    cursos.forEach(curso => {
        html += `
            <tr>
                <td>
                    <strong class="text-primary">${curso.nombre}</strong>
                </td>
                <td>
                    <span class="badge bg-info">${curso.estudiantes} estudiantes</span>
                </td>
                <td>
                    <span class="badge bg-success">${curso.tareas} tareas</span>
                </td>
                <td>
                    ${curso.hojaCalificaciones ? 
                        '<span class="badge bg-success"><i class="fas fa-check"></i> Existe</span>' : 
                        '<span class="badge bg-warning"><i class="fas fa-times"></i> No existe</span>'
                    }
                </td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="eliminarCurso('${curso.nombre}')" 
                            title="Eliminar curso">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    container.innerHTML = html;
}