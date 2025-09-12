import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { Box, Button, TextField, Typography, Paper, Tabs, Tab, List, ListItem, ListItemText, IconButton } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

function PacienteForm({ onAddPaciente }) {
  const [form, setForm] = useState({
    nombre: '', apellido: '', direccion: '', telefono: '', dni: '', obraSocial: '', numeroObraSocial: '', sesiones: '', fechaNacimiento: ''
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (form.nombre && form.apellido) {
      onAddPaciente({ ...form, planificacion: {}, observaciones: '' });
      setForm({ nombre: '', apellido: '', direccion: '', telefono: '', dni: '', obraSocial: '', sesiones: '', fechaNacimiento: '' });
    }
  };

  return (
    <Paper sx={{
      p: 3,
      mb: 3,
      borderRadius: 3,
      boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      background: '#fff',
    }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: 'primary.main' }}>Registrar Paciente</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <TextField label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} required sx={{ flex: 1, minWidth: 180 }} />
        <TextField label="Apellido" name="apellido" value={form.apellido} onChange={handleChange} required sx={{ flex: 1, minWidth: 180 }} />
        <TextField label="Dirección" name="direccion" value={form.direccion} onChange={handleChange} sx={{ flex: 1, minWidth: 180 }} />
        <TextField label="Teléfono" name="telefono" value={form.telefono} onChange={handleChange} sx={{ flex: 1, minWidth: 180 }} />
        <TextField label="DNI" name="dni" value={form.dni} onChange={handleChange} sx={{ flex: 1, minWidth: 180 }} />
        <TextField label="Fecha de Nacimiento" name="fechaNacimiento" type="date" value={form.fechaNacimiento} onChange={handleChange} InputLabelProps={{ shrink: true }} sx={{ flex: 1, minWidth: 180 }} />
        <TextField label="Obra Social" name="obraSocial" value={form.obraSocial} onChange={handleChange} sx={{ flex: 1, minWidth: 180 }} />
        <TextField label="Número de obra social" name="numeroObraSocial" value={form.numeroObraSocial} onChange={handleChange} sx={{ flex: 1, minWidth: 180 }} />
        <TextField label="Cantidad de Sesiones" name="sesiones" value={form.sesiones} onChange={handleChange} type="number" sx={{ flex: 1, minWidth: 180 }} />
        <Button type="submit" variant="contained" sx={{ height: 56, alignSelf: 'center', px: 4 }}>Agregar</Button>
      </Box>
    </Paper>
  );
}

function PacienteDetalle({ paciente, onUpdate, onDelete }) {
  // Estado para el modal de imagen
  const [imagenModal, setImagenModal] = useState(null);
  // Eliminar archivo individual
  const handleDeleteArchivo = (index) => {
    const nuevosArchivos = archivos.filter((_, i) => i !== index);
    setArchivos(nuevosArchivos);
    onUpdate({ ...paciente, archivos: nuevosArchivos });
    setMensajeDetalle('Archivo eliminado correctamente');
    setTimeout(() => setMensajeDetalle(''), 2000);
  };
  const [tab, setTab] = useState(0);
  const [tabArchivos, setTabArchivos] = useState(false);
  const [archivos, setArchivos] = useState(paciente.archivos || []);
  const [archivoNuevo, setArchivoNuevo] = useState({ file: null, descripcion: '' });
  const [mensajeDetalle, setMensajeDetalle] = useState('');

  const handleArchivoChange = e => {
    setArchivoNuevo({ ...archivoNuevo, file: e.target.files[0] });
  };

  const handleDescripcionChange = e => {
    setArchivoNuevo({ ...archivoNuevo, descripcion: e.target.value });
  };

  const handleSubirArchivo = () => {
    if (archivoNuevo.file) {
      const reader = new FileReader();
      reader.onload = ev => {
        const nuevoArchivo = {
          url: ev.target.result,
          descripcion: archivoNuevo.descripcion,
          nombre: archivoNuevo.file.name,
          fecha: new Date().toLocaleString()
        };
        const nuevosArchivos = [...archivos, nuevoArchivo];
        setArchivos(nuevosArchivos);
        setArchivoNuevo({ file: null, descripcion: '' });
        onUpdate({ ...paciente, archivos: nuevosArchivos });
        setMensajeDetalle('Archivo subido correctamente');
        setTimeout(() => setMensajeDetalle(''), 2000);
      };
      reader.readAsDataURL(archivoNuevo.file);
    }
  };
  const [plan, setPlan] = useState(paciente.planificacion || {});
  const [obs, setObs] = useState(paciente.observaciones || '');
  const [editando, setEditando] = useState(false);
  const [datos, setDatos] = useState({
    nombre: paciente.nombre,
    apellido: paciente.apellido,
    direccion: paciente.direccion,
    telefono: paciente.telefono,
    dni: paciente.dni,
    fechaNacimiento: paciente.fechaNacimiento || '',
    obraSocial: paciente.obraSocial,
    numeroObraSocial: paciente.numeroObraSocial || '',
    sesiones: paciente.sesiones
  });
  const [historial, setHistorial] = useState(paciente.historial || []);

  const handlePlanChange = (dia, value) => {
    const newPlan = { ...plan, [dia]: value };
    setPlan(newPlan);
    const nuevoRegistro = {
      fecha: new Date().toLocaleString(),
      tipo: 'planificacion',
      dia,
      valor: value
    };
    const nuevoHistorial = [...historial, nuevoRegistro];
    setHistorial(nuevoHistorial);
    onUpdate({ ...paciente, planificacion: newPlan, observaciones: obs, historial: nuevoHistorial });
  };

  const handleObsChange = e => {
    setObs(e.target.value);
    const nuevoRegistro = {
      fecha: new Date().toLocaleString(),
      tipo: 'observacion',
      valor: e.target.value
    };
    const nuevoHistorial = [...historial, nuevoRegistro];
    setHistorial(nuevoHistorial);
    onUpdate({ ...paciente, planificacion: plan, observaciones: e.target.value, historial: nuevoHistorial });
  };

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Planificación semanal de {datos.nombre} {datos.apellido}</Typography>
        <Box>
          <IconButton onClick={() => setEditando(!editando)} color="primary"><EditIcon /></IconButton>
          <IconButton onClick={onDelete} color="error"><DeleteIcon /></IconButton>
        </Box>
      </Box>
      {mensajeDetalle && (
        <Box sx={{ mb: 2, p: 1, bgcolor: '#e0f7fa', color: 'primary.main', borderRadius: 2, textAlign: 'center', fontWeight: 500, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'opacity 0.5s' }}>
          {mensajeDetalle}
        </Box>
      )}
      {/* Historial arriba de los días de la semana */}
      <Box sx={{ mt: 2, mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'secondary.main', mb: 1 }}>Historial de sesiones y observaciones</Typography>
        {historial.length === 0 ? (
          <Typography variant="body2" color="text.secondary">No hay registros aún.</Typography>
        ) : (
          <Box sx={{ maxHeight: 180, overflowY: 'auto', bgcolor: '#f7f7f7', borderRadius: 2, p: 1 }}>
            {historial.slice().reverse().map((h, idx) => (
              <Box key={idx} sx={{ mb: 1 }}>
                <Typography variant="caption" color="text.secondary">{h.fecha}</Typography>
                <Typography variant="body2">
                  {h.tipo === 'planificacion' ? `Planificación (${h.dia}): ${h.valor}` : `Observación: ${h.valor}`}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
      {/* Pestaña Archivos */}
      <Box sx={{ mb: 2 }}>
        <Button variant={tabArchivos ? 'contained' : 'outlined'} color="secondary" onClick={() => setTabArchivos(!tabArchivos)} sx={{ mb: 1 }}>
          {tabArchivos ? 'Ver planificación' : 'Ver archivos'}
        </Button>
        {tabArchivos && (
          <Box sx={{ bgcolor: '#f7f7f7', borderRadius: 2, p: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Archivos del paciente</Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
              <input type="file" accept="image/*" onChange={handleArchivoChange} />
              <TextField label="Descripción" value={archivoNuevo.descripcion} onChange={handleDescripcionChange} sx={{ minWidth: 180 }} />
              <Button variant="contained" onClick={handleSubirArchivo}>Subir</Button>
            </Box>
            {archivos.length === 0 ? (
              <Typography variant="body2" color="text.secondary">No hay archivos subidos.</Typography>
            ) : (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {archivos.map((a, idx) => (
                  <Box key={idx} sx={{ width: 140, bgcolor: '#fff', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', p: 1, position: 'relative', cursor: 'pointer' }} onClick={() => setImagenModal(a)}>
                    <img src={a.url} alt={a.descripcion} style={{ width: '100%', borderRadius: 4, marginBottom: 4 }} />
                    <Typography variant="caption" color="text.secondary">{a.fecha}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{a.descripcion}</Typography>
                    <IconButton size="small" color="error" sx={{ position: 'absolute', top: 4, right: 4 }} onClick={e => { e.stopPropagation(); handleDeleteArchivo(idx); }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
            {/* Modal para mostrar imagen grande */}
            <Dialog open={!!imagenModal} onClose={() => setImagenModal(null)} maxWidth="md">
              {imagenModal && (
                <>
                  <DialogTitle>{imagenModal.descripcion}</DialogTitle>
                  <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#222' }}>
                    <img src={imagenModal.url} alt={imagenModal.descripcion} style={{ maxWidth: '90vw', maxHeight: '80vh', borderRadius: 8 }} />
                  </DialogContent>
                </>
              )}
            </Dialog>
          </Box>
        )}
      </Box>
      {!tabArchivos && (
        <>
          {editando ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
              <TextField label="Nombre" name="nombre" value={datos.nombre} onChange={e => setDatos({ ...datos, nombre: e.target.value })} />
              <TextField label="Apellido" name="apellido" value={datos.apellido} onChange={e => setDatos({ ...datos, apellido: e.target.value })} />
              <TextField label="Dirección" name="direccion" value={datos.direccion} onChange={e => setDatos({ ...datos, direccion: e.target.value })} />
              <TextField label="Teléfono" name="telefono" value={datos.telefono} onChange={e => setDatos({ ...datos, telefono: e.target.value })} />
              <TextField label="DNI" name="dni" value={datos.dni} onChange={e => setDatos({ ...datos, dni: e.target.value })} />
              <TextField label="Fecha de Nacimiento" name="fechaNacimiento" type="date" value={datos.fechaNacimiento} onChange={e => setDatos({ ...datos, fechaNacimiento: e.target.value })} InputLabelProps={{ shrink: true }} />
              <TextField label="Obra Social" name="obraSocial" value={datos.obraSocial} onChange={e => setDatos({ ...datos, obraSocial: e.target.value })} />
              <TextField label="Número de obra social" name="numeroObraSocial" value={datos.numeroObraSocial} onChange={e => setDatos({ ...datos, numeroObraSocial: e.target.value })} />
              <TextField label="Cantidad de Sesiones" name="sesiones" value={datos.sesiones} onChange={e => setDatos({ ...datos, sesiones: e.target.value })} type="number" />
              <Button variant="contained" onClick={() => {
                setEditando(false);
                onUpdate({ ...paciente, ...datos, planificacion: plan, observaciones: obs });
                setMensajeDetalle('Datos editados correctamente');
                setTimeout(() => setMensajeDetalle(''), 2000);
              }}>Guardar</Button>
            </Box>
          ) : null}
          <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto" sx={{ mt: 2 }}>
            {diasSemana.map((dia, idx) => <Tab key={dia} label={dia} />)}
          </Tabs>
          <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
              <DatePicker
                label={`Fecha para ${diasSemana[tab]}`}
                value={plan[`${diasSemana[tab]}_fecha`] ? new Date(plan[`${diasSemana[tab]}_fecha`]) : new Date()}
                onChange={date => {
                  if (date) {
                    const jsDay = date.getDay();
                    const mapDias = [6, 0, 1, 2, 3, 4, 5];
                    const diaIdx = mapDias[jsDay];
                    setTab(diaIdx);
                    // Guardar en formato ISO para el DatePicker
                    const isoDate = date.toISOString().slice(0, 10);
                    const newPlan = { ...plan, [`${diasSemana[diaIdx]}_fecha`]: isoDate };
                    setPlan(newPlan);
                    onUpdate({ ...paciente, planificacion: newPlan, observaciones: obs, historial });
                  }
                }}
                inputFormat="dd/MM/yyyy"
                renderInput={(params) => <TextField {...params} sx={{ minWidth: 180 }} />}
                key={tab}
              />
            </LocalizationProvider>
            <TextField
              label={`Planificación para ${diasSemana[tab]}`}
              multiline
              fullWidth
              minRows={2}
              value={plan[diasSemana[tab]] || ''}
              onChange={e => {
                const newPlan = { ...plan, [diasSemana[tab]]: e.target.value };
                setPlan(newPlan);
                onUpdate({ ...paciente, planificacion: newPlan, observaciones: obs, historial });
              }}
              sx={{ flex: 1 }}
            />
          </Box>
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Fecha seleccionada: {plan[`${diasSemana[tab]}_fecha`] ? new Date(plan[`${diasSemana[tab]}_fecha`]).toLocaleDateString('es-ES') : new Date().toLocaleDateString('es-ES')}
            </Typography>
          </Box>
          <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <TextField
              label="Observaciones generales"
              multiline
              fullWidth
              minRows={2}
              value={obs}
              onChange={e => setObs(e.target.value)}
              sx={{ flex: 1 }}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ height: 56, alignSelf: 'flex-start' }}
              onClick={() => {
                const nuevoRegistro = {
                  fecha: new Date().toLocaleString(),
                  tipo: 'observacion',
                  valor: obs
                };
                const nuevoHistorial = [...historial, nuevoRegistro];
                setHistorial(nuevoHistorial);
                onUpdate({ ...paciente, planificacion: plan, observaciones: obs, historial: nuevoHistorial });
                setObs(""); // Limpiar el cuadro de observación
                setMensajeDetalle('Observaciones guardadas');
                setTimeout(() => setMensajeDetalle(''), 2000);
              }}
            >
              Guardar
            </Button>
          </Box>
        </>
      )}
    </Paper>
  );
}

export default function Pacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [seleccionadoDni, setSeleccionadoDni] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleAddPaciente = paciente => {
    let id = paciente.dni && !pacientes.some(p => p.dni === paciente.dni) ? paciente.dni : `${Date.now()}-${Math.random()}`;
    setPacientes(prev => [...prev, { ...paciente, id }]);
    setMensaje('Paciente agregado correctamente');
    setTimeout(() => setMensaje(''), 2000);
  };

  const handleUpdatePaciente = updated => {
    setPacientes(pacientes.map(p => p.id === updated.id ? updated : p));
    setSeleccionadoDni(updated.id);
  };

  const handleDeletePaciente = id => {
    setPacientes(prev => prev.filter(p => p.id !== id));
    setSeleccionadoDni(null);
    setMensaje('Paciente eliminado');
    setTimeout(() => setMensaje(''), 2000);
  };

  const seleccionado = pacientes.find(p => p.id === seleccionadoDni);

  // Filtrar pacientes según la búsqueda
  const pacientesFiltrados = pacientes.filter(p => {
    const texto = `${p.nombre} ${p.apellido} ${p.dni}`.toLowerCase();
    return texto.includes(busqueda.toLowerCase());
  });

  return (
    <Box
      sx={{
        maxWidth: { xs: '100%', sm: 600, md: 800 },
        mx: 'auto',
        mt: 4,
        px: { xs: 1, sm: 2 },
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {mensaje && (
        <Box sx={{ mb: 2, p: 1, bgcolor: '#e0f7fa', color: 'primary.main', borderRadius: 2, textAlign: 'center', fontWeight: 500, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'opacity 0.5s' }}>
          {mensaje}
        </Box>
      )}
      {!seleccionado ? (
        <>
          <PacienteForm onAddPaciente={handleAddPaciente} />
          <Paper sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            background: '#fff',
            mb: 3,
          }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: 'primary.main' }}>Listado de pacientes</Typography>
            <TextField
              label="Buscar por nombre, apellido o DNI"
              variant="outlined"
              fullWidth
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              sx={{ mb: 2 }}
            />
            <List>
              {pacientesFiltrados.map((p, idx) => {
                return (
                  <ListItem button key={p.id} onClick={() => setSeleccionadoDni(p.id)} sx={{ borderRadius: 2, mb: 1, transition: 'box-shadow 0.3s, transform 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', '&:hover': { transform: 'scale(1.02)', boxShadow: '0 4px 16px rgba(0,0,0,0.10)' } }}>
                    <ListItemText
                      primary={<span style={{ fontWeight: 500 }}>{p.nombre} {p.apellido}</span>}
                      secondary={<>
                        {`Sesiones: ${p.sesiones}`}
                        {p.obraSocial && <><br />{`Obra Social: ${p.obraSocial}`}</>}
                        {p.numeroObraSocial && <><br />{`N° Obra Social: ${p.numeroObraSocial}`}</>}
                      </>}
                    />
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        </>
      ) : (
        <>
          <Button variant="outlined" color="primary" sx={{ mb: 2, transition: 'background 0.3s' }} onClick={() => setSeleccionadoDni(null)}>
            ← Volver al listado
          </Button>
          {/* Mostrar datos del paciente en el detalle */}
          <Box sx={{ mb: 2, p: 2, bgcolor: '#f7f7f7', borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Datos del paciente</Typography>
            <Typography variant="body2"><b>Nombre:</b> {seleccionado.nombre} {seleccionado.apellido}</Typography>
            <Typography variant="body2"><b>DNI:</b> {seleccionado.dni}</Typography>
            <Typography variant="body2"><b>Dirección:</b> {seleccionado.direccion}</Typography>
            <Typography variant="body2"><b>Teléfono:</b> {seleccionado.telefono}</Typography>
            <Typography variant="body2"><b>Fecha de nacimiento:</b> {seleccionado.fechaNacimiento}</Typography>
            <Typography variant="body2"><b>Obra Social:</b> {seleccionado.obraSocial}</Typography>
            {seleccionado.numeroObraSocial && <Typography variant="body2"><b>N° Obra Social:</b> {seleccionado.numeroObraSocial}</Typography>}
            <Typography variant="body2"><b>Cantidad de sesiones:</b> {seleccionado.sesiones}</Typography>
          </Box>
          <PacienteDetalle paciente={seleccionado} onUpdate={handleUpdatePaciente} onDelete={() => handleDeletePaciente(seleccionado.id)} />
        </>
      )}
    </Box>
  );
}
