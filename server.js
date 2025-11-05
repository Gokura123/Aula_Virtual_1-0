const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const GoogleSheetsService = require('./google-sheets');

const app = express();
const PORT = process.env.PORT || 5500;

// Inicializar Google Sheets
const sheetsService = new GoogleSheetsService();
let sheetsConnected = false;

// Cache temporal para tareas (se sincroniza con Google Sheets)
let tareasCache = [];

// Base de datos temporal para usuarios (en producción usar una base de datos real)
let usuariosEstudiantes = [];

// Contadores para IDs secuenciales
let contadorTareas = 1;
let contadorEstudiantes = 1;
let contadorEntregas = 1;

// Función para obtener el próximo ID disponible (IDs simples)
function obtenerProximoId(tipo, datos = []) {
  // Para nuevos registros, usar IDs simples secuenciales
  switch(tipo) {
    case 'tarea': 
      // Buscar el ID más alto que sea menor a 1000 (IDs simples)
      const idsSimplesTareas = datos.filter(t => parseInt(t.id) < 1000).map(t => parseInt(t.id));
      if (idsSimplesTareas.length > 0) {
        return Math.max(...idsSimplesTareas) + 1;
      }
      return contadorTareas++;
      
    case 'estudiante':
      // Buscar el ID más alto que sea menor a 1000 (IDs simples)
      const idsSimplesEstudiantes = datos.filter(e => parseInt(e.id) < 1000).map(e => parseInt(e.id));
      if (idsSimplesEstudiantes.length > 0) {
        return Math.max(...idsSimplesEstudiantes) + 1;
      }
      return contadorEstudiantes++;
      
    case 'entrega': 
      return contadorEntregas++;
      
    default: 
      return 1;
  }
}

// Intentar conectar a Google Sheets al iniciar
sheetsService.inicializar().then(async (success) => {
  sheetsConnected = success;
  if (success) {
    console.log('✅ Google Sheets conectado exitosamente');
    
    // Cargar tareas existentes de Google Sheets
    try {
      const resultado = await sheetsService.obtenerTareas();
      if (resultado.success) {
        tareasCache = resultado.tareas;
        // Establecer contador de tareas basado en IDs simples (< 1000)
        if (tareasCache.length > 0) {
          const idsSimples = tareasCache.filter(t => parseInt(t.id) < 1000).map(t => parseInt(t.id));
          if (idsSimples.length > 0) {
            contadorTareas = Math.max(...idsSimples) + 1;
          }
        }
        console.log(`📚 Cargadas ${tareasCache.length} tareas desde Google Sheets (próximo ID simple: ${contadorTareas})`);
      }
    } catch (error) {
      console.log('⚠️  Error al cargar tareas existentes:', error.message);
    }

    // Cargar estudiantes existentes de Google Sheets
    try {
      const resultadoEstudiantes = await sheetsService.obtenerEstudiantes();
      if (resultadoEstudiantes.success) {
        usuariosEstudiantes = resultadoEstudiantes.estudiantes;
        // Establecer contador de estudiantes basado en IDs simples (< 1000)
        if (usuariosEstudiantes.length > 0) {
          const idsSimples = usuariosEstudiantes.filter(e => parseInt(e.id) < 1000).map(e => parseInt(e.id));
          if (idsSimples.length > 0) {
            contadorEstudiantes = Math.max(...idsSimples) + 1;
          }
        }
        console.log(`👥 Cargados ${usuariosEstudiantes.length} estudiantes desde Google Sheets (próximo ID simple: ${contadorEstudiantes})`);
      }
    } catch (error) {
      console.log('⚠️  Error al cargar estudiantes existentes:', error.message);
    }
  } else {
    console.log('⚠️  Google Sheets no conectado - usando modo local');
    
    // Agregar estudiante de prueba en modo local
    if (usuariosEstudiantes.length === 0) {
      usuariosEstudiantes.push({
        id: 1,
        nombre: 'Juan Pérez',
        usuario: 'juan123',
        password: '1234',
        curso: '1A',
        fechaRegistro: new Date().toISOString()
      });
      console.log('👤 Estudiante de prueba agregado: juan123 / 1234');
    }
  }
}).catch(error => {
  console.error('❌ Error al inicializar Google Sheets:', error);
  sheetsConnected = false;
  
  // Agregar estudiante de prueba en caso de error
  if (usuariosEstudiantes.length === 0) {
    usuariosEstudiantes.push({
      id: 1,
      nombre: 'Juan Pérez',
      usuario: 'juan123',
      password: '1234',
      curso: '1A',
      fechaRegistro: new Date().toISOString()
    });
    console.log('👤 Estudiante de prueba agregado: juan123 / 1234');
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configuración de multer para subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB límite
  }
});

// Rutas básicas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Redirigir a login por defecto
app.get('/inicio', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Rutas de autenticación
app.post('/api/auth/login', (req, res) => {
  try {
    const { tipo, usuario, password } = req.body;
    
    if (tipo === 'profesor') {
      // Validar credenciales del profesor
      if (usuario === 'Virginia Torrez' && password === '12345') {
        const token = 'profesor_' + Date.now();
        res.json({
          success: true,
          message: 'Login exitoso',
          token: token,
          usuario: {
            nombre: usuario,
            tipo: 'profesor'
          }
        });
      } else {
        res.status(401).json({
          success: false,
          message: 'Credenciales incorrectas'
        });
      }
    } else if (tipo === 'estudiante') {
      // Buscar estudiante en la base de datos temporal
      const estudiante = usuariosEstudiantes.find(u => 
        u.usuario === usuario && u.password === password
      );
      
      if (estudiante) {
        // Actualizar último acceso en Google Sheets
        if (sheetsConnected) {
          sheetsService.actualizarUltimoAcceso(usuario).then(resultado => {
            if (resultado.success) {
              console.log('✅ Último acceso actualizado para:', usuario);
            }
          });
        }
        
        const token = 'estudiante_' + Date.now();
        res.json({
          success: true,
          message: 'Login exitoso',
          token: token,
          usuario: {
            nombre: estudiante.nombre,
            usuario: estudiante.usuario,
            curso: estudiante.curso,
            tipo: 'estudiante'
          }
        });
      } else {
        res.status(401).json({
          success: false,
          message: 'Usuario o contraseña incorrectos'
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: 'Tipo de usuario no válido'
      });
    }
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { nombre, usuario, curso, password } = req.body;
    
    // Validar que no exista el usuario (buscar en cache local y Google Sheets)
    let usuarioExistente = usuariosEstudiantes.find(u => u.usuario === usuario);
    
    // Si Google Sheets está conectado, verificar también allí
    if (sheetsConnected && !usuarioExistente) {
      const resultadoBusqueda = await sheetsService.buscarEstudiante(usuario);
      if (resultadoBusqueda.success) {
        usuarioExistente = resultadoBusqueda.estudiante;
      }
    }
    
    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        message: 'El nombre de usuario ya existe'
      });
    }
    
    // Crear nuevo estudiante
    const nuevoEstudiante = {
      id: obtenerProximoId('estudiante', usuariosEstudiantes),
      nombre: nombre,
      usuario: usuario,
      curso: curso,
      password: password,
      fechaRegistro: new Date().toISOString()
    };
    
    // Agregar al cache local
    usuariosEstudiantes.push(nuevoEstudiante);
    
    // Guardar en Google Sheets si está conectado
    if (sheetsConnected) {
      const resultado = await sheetsService.registrarEstudiante(nuevoEstudiante);
      if (resultado.success) {
        console.log('✅ Estudiante guardado en Google Sheets:', nuevoEstudiante.nombre);
      } else {
        console.error('❌ Error al guardar estudiante en Google Sheets:', resultado.message);
      }
    }
    
    console.log('Nuevo estudiante registrado:', nuevoEstudiante.nombre, 'Curso:', nuevoEstudiante.curso);
    
    res.json({
      success: true,
      message: 'Registro exitoso',
      usuario: {
        nombre: nuevoEstudiante.nombre,
        usuario: nuevoEstudiante.usuario,
        curso: nuevoEstudiante.curso
      },
      savedToSheets: sheetsConnected
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Ruta para profesores - crear tarea
app.post('/api/tareas', async (req, res) => {
  try {
    const { titulo, descripcion, fechaLimite, materia } = req.body;
    
    const nuevaTarea = {
      id: obtenerProximoId('tarea', tareasCache),
      titulo,
      descripcion,
      fechaLimite,
      materia,
      fechaCreacion: new Date().toISOString(),
      entregas: []
    };
    
    // Agregar al cache local
    tareasCache.push(nuevaTarea);
    
    // Guardar en Google Sheets si está conectado
    if (sheetsConnected) {
      const resultado = await sheetsService.crearTarea(nuevaTarea);
      if (!resultado.success) {
        console.error('Error al guardar en Google Sheets:', resultado.message);
      }
    }
    
    res.json({ 
      success: true, 
      message: 'Tarea creada exitosamente',
      tarea: nuevaTarea,
      savedToSheets: sheetsConnected
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al crear la tarea' 
    });
  }
});

// Ruta para estudiantes - entregar tarea
app.post('/api/entregas', upload.single('archivo'), async (req, res) => {
  try {
    const { tareaId, estudianteNombre, enlace, comentarios } = req.body;
    
    const entrega = {
      id: obtenerProximoId('entrega'),
      tareaId: parseInt(tareaId),
      estudianteNombre,
      fechaEntrega: new Date().toISOString(),
      tipo: req.file ? 'archivo' : 'enlace',
      contenido: req.file ? req.file.filename : enlace,
      comentarios: comentarios || ''
    };
    
    // Guardar en Google Sheets si está conectado
    if (sheetsConnected) {
      const resultado = await sheetsService.registrarEntrega(entrega);
      if (!resultado.success) {
        console.error('Error al guardar entrega en Google Sheets:', resultado.message);
      }
    }
    
    res.json({ 
      success: true, 
      message: 'Entrega realizada exitosamente',
      entrega,
      savedToSheets: sheetsConnected
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al procesar la entrega' 
    });
  }
});

// Ruta para obtener todas las tareas
app.get('/api/tareas', async (req, res) => {
  try {
    const curso = req.query.curso; // Parámetro opcional para filtrar por curso
    
    console.log('GET /api/tareas - sheetsConnected:', sheetsConnected);
    console.log('GET /api/tareas - tareasCache length:', tareasCache.length);
    console.log('GET /api/tareas - curso solicitado:', curso);
    
    let tareas = [];
    
    if (sheetsConnected) {
      // Intentar obtener desde Google Sheets
      const resultado = await sheetsService.obtenerTareas();
      console.log('Resultado de Google Sheets:', resultado);
      
      if (resultado.success) {
        // Actualizar cache con datos de Sheets
        tareasCache = resultado.tareas || [];
        tareas = tareasCache;
      } else {
        // Si falla Sheets, usar cache local
        console.log('Fallo Google Sheets, usando cache local');
        tareas = tareasCache || [];
      }
    } else {
      // Usar cache local si no hay conexión a Sheets
      console.log('Sin conexión a Sheets, usando cache local');
      tareas = tareasCache || [];
    }
    
    // Filtrar por curso si se especifica
    if (curso) {
      const tareasFiltradas = tareas.filter(tarea => {
        const cursoTarea = tarea.materia || tarea.curso;
        return cursoTarea === curso;
      });
      console.log(`Tareas filtradas para curso ${curso}: ${tareasFiltradas.length} de ${tareas.length}`);
      res.json({ success: true, tareas: tareasFiltradas });
    } else {
      res.json({ success: true, tareas: tareas });
    }
    
  } catch (error) {
    console.error('Error en GET /api/tareas:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener tareas',
      tareas: [] 
    });
  }
});

// Ruta para obtener estadísticas
app.get('/api/estadisticas', async (req, res) => {
  try {
    if (sheetsConnected) {
      const resultado = await sheetsService.obtenerEstadisticas();
      res.json(resultado);
    } else {
      res.json({ 
        success: true, 
        estadisticas: {
          totalTareas: 0,
          tareasActivas: 0,
          totalEntregas: 0,
          entregasPendientes: 0
        }
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false, 
      estadisticas: {} 
    });
  }
});

// Ruta para editar tarea
app.put('/api/tareas/:id', async (req, res) => {
  try {
    const tareaId = parseInt(req.params.id);
    const { titulo, descripcion, fechaLimite, materia } = req.body;
    
    // Buscar tarea en cache local
    const indice = tareasCache.findIndex(t => t.id === tareaId);
    if (indice === -1) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }
    
    // Actualizar tarea en cache local
    tareasCache[indice] = {
      ...tareasCache[indice],
      titulo,
      descripcion,
      fechaLimite,
      materia,
      fechaModificacion: new Date().toISOString()
    };
    
    // Actualizar en Google Sheets si está conectado
    if (sheetsConnected) {
      const resultado = await sheetsService.actualizarTarea(tareaId, tareasCache[indice]);
      if (!resultado.success) {
        console.error('Error al actualizar en Google Sheets:', resultado.message);
      }
    }
    
    res.json({
      success: true,
      message: 'Tarea actualizada exitosamente',
      tarea: tareasCache[indice]
    });
  } catch (error) {
    console.error('Error al editar tarea:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Ruta para eliminar tarea
app.delete('/api/tareas/:id', async (req, res) => {
  try {
    const tareaId = parseInt(req.params.id);
    console.log(`🗑️ Solicitud de eliminación de tarea ID: ${tareaId}`);
    
    // Buscar tarea en cache local
    const indice = tareasCache.findIndex(t => t.id === tareaId);
    if (indice === -1) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada en el sistema'
      });
    }
    
    // Obtener información de la tarea antes de eliminarla
    const tareaEliminada = tareasCache[indice];
    console.log(`📋 Eliminando tarea: "${tareaEliminada.titulo}" del curso: ${tareaEliminada.materia}`);
    
    // Eliminar de cache local
    tareasCache.splice(indice, 1);
    
    let resultadoSheets = { success: true, message: 'Google Sheets no conectado' };
    
    // Eliminar de Google Sheets si está conectado
    if (sheetsConnected) {
      console.log('📊 Eliminando de Google Sheets...');
      resultadoSheets = await sheetsService.eliminarTarea(tareaId);
      
      if (!resultadoSheets.success) {
        console.error('❌ Error al eliminar de Google Sheets:', resultadoSheets.message);
        // Revertir eliminación del cache si falló en Google Sheets
        tareasCache.splice(indice, 0, tareaEliminada);
        
        return res.status(500).json({
          success: false,
          message: `Error al eliminar de Google Sheets: ${resultadoSheets.message}`,
          tarea: tareaEliminada
        });
      }
      
      console.log('✅ Tarea eliminada exitosamente de Google Sheets y calificaciones');
    }
    
    res.json({
      success: true,
      message: sheetsConnected 
        ? `Tarea "${tareaEliminada.titulo}" eliminada completamente del sistema y Google Sheets`
        : `Tarea "${tareaEliminada.titulo}" eliminada del sistema local`,
      tarea: tareaEliminada,
      sheetsResult: resultadoSheets
    });
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al eliminar tarea'
    });
  }
});

// Ruta para verificar estado de Google Sheets
app.get('/api/status/sheets', async (req, res) => {
  try {
    const status = {
      connected: sheetsConnected,
      timestamp: new Date().toISOString(),
      sheetsId: process.env.GOOGLE_SHEETS_ID,
      clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
      tareasCache: tareasCache.length,
      estudiantesCache: usuariosEstudiantes.length
    };
    
    if (sheetsConnected) {
      // Intentar una operación de prueba
      try {
        const resultadoTareas = await sheetsService.obtenerTareas();
        const resultadoEstudiantes = await sheetsService.obtenerEstudiantes();
        
        status.testResults = {
          tareasFromSheets: resultadoTareas.success ? resultadoTareas.tareas.length : 'Error',
          estudiantesFromSheets: resultadoEstudiantes.success ? resultadoEstudiantes.estudiantes.length : 'Error',
          lastTest: new Date().toISOString()
        };
      } catch (error) {
        status.testResults = {
          error: error.message,
          lastTest: new Date().toISOString()
        };
      }
    }
    
    res.json({
      success: true,
      status: status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Ruta para obtener estadísticas de estudiantes
app.get('/api/estadisticas/estudiantes', async (req, res) => {
  try {
    if (sheetsConnected) {
      const resultado = await sheetsService.obtenerEstadisticasEstudiantes();
      res.json(resultado);
    } else {
      // Estadísticas del cache local
      const estadisticasPorCurso = {};
      usuariosEstudiantes.forEach(estudiante => {
        const curso = estudiante.curso;
        if (!estadisticasPorCurso[curso]) {
          estadisticasPorCurso[curso] = 0;
        }
        estadisticasPorCurso[curso]++;
      });

      res.json({ 
        success: true, 
        estadisticas: {
          totalEstudiantes: usuariosEstudiantes.length,
          estudiantesActivos: usuariosEstudiantes.length,
          estudiantesPorCurso: estadisticasPorCurso,
          ultimosRegistros: usuariosEstudiantes.slice(-5)
        }
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false, 
      estadisticas: {} 
    });
  }
});

// Ruta para obtener entregas
app.get('/api/entregas', async (req, res) => {
  try {
    const tareaId = req.query.tareaId;
    const curso = req.query.curso;
    
    if (sheetsConnected) {
      const resultado = await sheetsService.obtenerEntregas(
        tareaId ? parseInt(tareaId) : null,
        curso
      );
      res.json(resultado);
    } else {
      // Modo local - obtener entregas del localStorage simulado
      res.json({ 
        success: true, 
        entregas: [] 
      });
    }
  } catch (error) {
    console.error('Error al obtener entregas:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener entregas',
      entregas: [] 
    });
  }
});

// Ruta para descargar archivos
app.get('/api/descargar/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, 'uploads', filename);
    
    // Verificar que el archivo existe
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({
        success: false,
        message: 'Archivo no encontrado'
      });
    }
    
    // Enviar archivo para descarga
    res.download(filepath, (err) => {
      if (err) {
        console.error('Error al descargar archivo:', err);
        res.status(500).json({
          success: false,
          message: 'Error al descargar archivo'
        });
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Ruta para obtener estudiantes (solo para profesores)
app.get('/api/estudiantes', (req, res) => {
  try {
    const { curso } = req.query;
    
    let estudiantes = usuariosEstudiantes;
    
    // Filtrar por curso si se especifica
    if (curso && curso !== 'todos') {
      estudiantes = usuariosEstudiantes.filter(e => e.curso === curso);
    }
    
    // No enviar las contraseñas por seguridad
    const estudiantesSinPassword = estudiantes.map(e => ({
      id: e.id,
      nombre: e.nombre,
      usuario: e.usuario,
      curso: e.curso,
      fechaRegistro: e.fechaRegistro,
      estado: e.estado || 'Activo',
      ultimoAcceso: e.ultimoAcceso
    }));
    
    res.json({
      success: true,
      estudiantes: estudiantesSinPassword
    });
  } catch (error) {
    console.error('Error al obtener estudiantes:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Ruta para eliminar estudiante (solo para profesores)
app.delete('/api/estudiantes/:id', async (req, res) => {
  try {
    const estudianteId = parseInt(req.params.id);
    
    // Buscar estudiante en cache local
    const indiceEstudiante = usuariosEstudiantes.findIndex(e => e.id === estudianteId);
    
    if (indiceEstudiante === -1) {
      return res.status(404).json({
        success: false,
        message: 'Estudiante no encontrado'
      });
    }
    
    const estudiante = usuariosEstudiantes[indiceEstudiante];
    
    // Eliminar de Google Sheets si está conectado
    if (sheetsConnected) {
      const resultado = await sheetsService.eliminarEstudiante(estudianteId);
      if (!resultado.success) {
        console.error('Error al eliminar de Google Sheets:', resultado.message);
      }
    }
    
    // Eliminar del cache local
    usuariosEstudiantes.splice(indiceEstudiante, 1);
    
    console.log(`🗑️ Estudiante eliminado: ${estudiante.nombre} (ID: ${estudianteId})`);
    
    res.json({
      success: true,
      message: `Estudiante ${estudiante.nombre} eliminado exitosamente`
    });
  } catch (error) {
    console.error('Error al eliminar estudiante:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Ruta para obtener cursos disponibles
app.get('/api/cursos', async (req, res) => {
  try {
    if (sheetsConnected) {
      // Usar la misma lógica que /api/cursos/gestion pero solo devolver nombres
      const resultado = await sheetsService.obtenerCursosDetallados();
      if (resultado.success) {
        const nombresCursos = resultado.cursos.map(curso => curso.nombre).sort();
        res.json({
          success: true,
          cursos: nombresCursos
        });
      } else {
        // Fallback a lógica original si falla Google Sheets
        const cursos = [...new Set(usuariosEstudiantes.map(e => e.curso))].sort();
        res.json({
          success: true,
          cursos: cursos
        });
      }
    } else {
      // Lógica original cuando no hay conexión a Google Sheets
      const cursos = [...new Set(usuariosEstudiantes.map(e => e.curso))].sort();
      res.json({
        success: true,
        cursos: cursos
      });
    }
  } catch (error) {
    console.error('Error al obtener cursos:', error);
    res.status(500).json({
      success: false,
      cursos: []
    });
  }
});

// Ruta para obtener cursos con información detallada (para gestión)
app.get('/api/cursos/gestion', async (req, res) => {
  try {
    if (!sheetsConnected) {
      return res.json({
        success: false,
        message: 'Google Sheets no conectado',
        cursos: []
      });
    }
    
    const resultado = await sheetsService.obtenerCursosDetallados();
    res.json(resultado);
  } catch (error) {
    console.error('Error al obtener cursos detallados:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener cursos',
      cursos: []
    });
  }
});

// Ruta para crear un nuevo curso
app.post('/api/cursos', async (req, res) => {
  try {
    const { nombre } = req.body;
    
    if (!nombre || !nombre.trim()) {
      return res.status(400).json({
        success: false,
        message: 'El nombre del curso es requerido'
      });
    }
    
    const nombreCurso = nombre.trim();
    
    if (nombreCurso.length > 10) {
      return res.status(400).json({
        success: false,
        message: 'El nombre del curso no puede tener más de 10 caracteres'
      });
    }
    
    if (!sheetsConnected) {
      return res.json({
        success: false,
        message: 'Google Sheets no conectado'
      });
    }
    
    const resultado = await sheetsService.crearCurso(nombreCurso);
    res.json(resultado);
  } catch (error) {
    console.error('Error al crear curso:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear curso'
    });
  }
});

// Ruta para eliminar un curso
app.delete('/api/cursos/:nombre', async (req, res) => {
  try {
    const nombreCurso = req.params.nombre;
    
    if (!nombreCurso) {
      return res.status(400).json({
        success: false,
        message: 'El nombre del curso es requerido'
      });
    }
    
    if (!sheetsConnected) {
      return res.json({
        success: false,
        message: 'Google Sheets no conectado'
      });
    }
    
    const resultado = await sheetsService.eliminarCurso(nombreCurso);
    res.json(resultado);
  } catch (error) {
    console.error('Error al eliminar curso:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar curso'
    });
  }
});

// Ruta para asignar calificación
app.post('/api/calificaciones', async (req, res) => {
  try {
    const { estudianteNombre, tareaId, calificacion } = req.body;
    
    if (!estudianteNombre || !tareaId || calificacion === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Datos incompletos para asignar calificación'
      });
    }
    
    // Validar calificación (escala 0-100)
    const nota = parseFloat(calificacion);
    if (isNaN(nota) || nota < 0 || nota > 100) {
      return res.status(400).json({
        success: false,
        message: 'La calificación debe ser un número entre 0 y 100'
      });
    }
    
    if (sheetsConnected) {
      const resultado = await sheetsService.asignarCalificacion(estudianteNombre, parseInt(tareaId), nota);
      res.json(resultado);
    } else {
      res.status(503).json({
        success: false,
        message: 'Google Sheets no está conectado'
      });
    }
  } catch (error) {
    console.error('Error al asignar calificación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Ruta para obtener calificaciones de un curso
app.get('/api/calificaciones/:curso', async (req, res) => {
  try {
    const curso = req.params.curso;
    console.log(`🔍 Solicitando calificaciones para curso: ${curso}`);
    
    if (sheetsConnected) {
      console.log('📊 Google Sheets conectado, obteniendo calificaciones...');
      const resultado = await sheetsService.obtenerCalificacionesCurso(curso);
      console.log('📋 Resultado de calificaciones:', resultado);
      res.json(resultado);
    } else {
      console.log('❌ Google Sheets no conectado');
      res.status(503).json({
        success: false,
        message: 'Google Sheets no está conectado'
      });
    }
  } catch (error) {
    console.error('Error al obtener calificaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Ruta para regenerar hojas de calificaciones
app.post('/api/admin/regenerar-calificaciones', async (req, res) => {
  try {
    if (!sheetsConnected) {
      return res.status(503).json({
        success: false,
        message: 'Google Sheets no está conectado'
      });
    }

    console.log('🔧 Regenerando hojas de calificaciones...');
    
    // Obtener todas las tareas
    const resultadoTareas = await sheetsService.obtenerTareas();
    if (!resultadoTareas.success) {
      return res.json({
        success: false,
        message: 'No se pudieron obtener las tareas'
      });
    }

    // Actualizar hojas de calificaciones con todas las tareas
    for (const tarea of resultadoTareas.tareas) {
      await sheetsService.actualizarHojaCalificacionesConTarea(tarea);
    }
    
    res.json({
      success: true,
      message: `Hojas de calificaciones regeneradas con ${resultadoTareas.tareas.length} tareas`
    });
  } catch (error) {
    console.error('Error al regenerar calificaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Ruta para limpiar columnas incorrectas en calificaciones
app.post('/api/admin/limpiar-calificaciones', async (req, res) => {
  try {
    if (!sheetsConnected) {
      return res.status(503).json({
        success: false,
        message: 'Google Sheets no está conectado'
      });
    }

    console.log('🧹 Iniciando limpieza de columnas incorrectas...');
    const resultado = await sheetsService.limpiarColumnasIncorrectas();
    
    res.json(resultado);
  } catch (error) {
    console.error('Error al limpiar columnas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Ruta para reparar hojas de calificaciones corruptas
app.post('/api/admin/reparar-calificaciones', async (req, res) => {
  try {
    if (!sheetsConnected) {
      return res.status(503).json({
        success: false,
        message: 'Google Sheets no está conectado'
      });
    }

    console.log('🔧 Reparando hojas de calificaciones...');
    
    // Obtener estudiantes para identificar cursos
    const resultadoEstudiantes = await sheetsService.obtenerEstudiantes();
    if (!resultadoEstudiantes.success) {
      return res.status(500).json({
        success: false,
        message: 'No se pudieron obtener los estudiantes'
      });
    }
    
    const cursos = [...new Set(resultadoEstudiantes.estudiantes.map(e => e.curso))];
    let hojasReparadas = 0;
    let errores = [];
    
    for (const curso of cursos) {
      try {
        console.log(`🔄 Reparando hoja para curso: ${curso}`);
        
        // Verificar y recrear hoja si es necesario
        const hojaCalif = await sheetsService.verificarYCrearHojaCalificaciones(curso);
        
        if (hojaCalif) {
          hojasReparadas++;
          console.log(`✅ Hoja reparada: Calificaciones_${curso}`);
        } else {
          errores.push(`No se pudo reparar hoja para curso: ${curso}`);
        }
        
      } catch (cursoError) {
        console.error(`Error reparando curso ${curso}:`, cursoError);
        errores.push(`Error en curso ${curso}: ${cursoError.message}`);
      }
    }
    
    // Sincronizar tareas existentes
    try {
      const resultadoTareas = await sheetsService.obtenerTareas();
      if (resultadoTareas.success) {
        for (const tarea of resultadoTareas.tareas) {
          await sheetsService.actualizarHojaCalificacionesConTarea(tarea);
        }
      }
    } catch (tareasError) {
      console.error('Error sincronizando tareas:', tareasError);
      errores.push(`Error sincronizando tareas: ${tareasError.message}`);
    }
    
    res.json({
      success: true,
      message: `Reparación completada. ${hojasReparadas} hojas reparadas.`,
      hojasReparadas,
      errores: errores.length > 0 ? errores : undefined
    });
    
  } catch (error) {
    console.error('Error al reparar calificaciones:', error);
    res.status(500).json({
      success: false,
      message: `Error al reparar calificaciones: ${error.message}`
    });
  }
});

// Ruta para simplificar IDs de estudiantes (solo para administradores)
app.post('/api/admin/simplificar-ids', async (req, res) => {
  try {
    if (!sheetsConnected) {
      return res.status(503).json({
        success: false,
        message: 'Google Sheets no está conectado'
      });
    }

    console.log('🔧 Iniciando simplificación de IDs de estudiantes...');
    const resultado = await sheetsService.simplificarIDsEstudiantes();
    
    if (resultado.success) {
      // Recargar estudiantes con los nuevos IDs
      const resultadoEstudiantes = await sheetsService.obtenerEstudiantes();
      if (resultadoEstudiantes.success) {
        usuariosEstudiantes = resultadoEstudiantes.estudiantes;
        contadorEstudiantes = resultado.proximoId;
        console.log(`✅ Estudiantes recargados con IDs simplificados. Próximo ID: ${contadorEstudiantes}`);
      }
    }
    
    res.json(resultado);
  } catch (error) {
    console.error('Error al simplificar IDs:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Ruta para servir archivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Crear directorio de uploads si no existe
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
  console.log(`Accede a: http://localhost:${PORT}`);
});