import { useEffect, useState } from 'react';
import api from './api';

export default function Inquilinos(){
  const [bancos, setBancos] = useState([]);
  const [props, setProps]   = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    nombre:'',telefono:'',email:'',propiedad_id:'',unidad_id:'',renta_mensual:'',contrato_inicio:'',contrato_fin:'',banco_id:''
  });

  const load = async()=>{
    const [b,p,t] = await Promise.all([
      api.get('/bancos'), api.get('/propiedades'), api.get('/inquilinos')
    ]);
    setBancos(b.data); setProps(p.data); setList(t.data);
  };
  useEffect(()=>{ load(); },[]);

  const onPropChange = async(id)=>{
    setForm({...form,propiedad_id:id, unidad_id:''});
    if(!id){ setUnidades([]); return; }
    const r = await api.get(`/propiedades/${id}/unidades`);
    setUnidades(r.data);
  };

  const send = async()=>{
    await api.post('/inquilinos', {
      ...form,
      renta_mensual:+form.renta_mensual||0,
      propiedad_id: form.propiedad_id || null,
      unidad_id: form.unidad_id || null,
      banco_id: form.banco_id || null
    });
    setForm({nombre:'',telefono:'',email:'',propiedad_id:'',unidad_id:'',renta_mensual:'',contrato_inicio:'',contrato_fin:'',banco_id:''});
    load();
  };

  // Crear unidad rápida (UP/DN) si es dúplex
  const [nuevaUnidad, setNuevaUnidad] = useState('');
  const crearUnidad = async()=>{
    if(!form.propiedad_id || !nuevaUnidad) return;
    await api.post(`/propiedades/${form.propiedad_id}/unidades`, { etiqueta:nuevaUnidad });
    setNuevaUnidad(''); onPropChange(form.propiedad_id);
  };

  return (
    <>
      <div className="card">
        <h3>Nuevo Inquilino</h3>
        <div className="row">
          <input placeholder="Nombre" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})}/>
          <input placeholder="Teléfono" value={form.telefono} onChange={e=>setForm({...form,telefono:e.target.value})}/>
          <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
          <select value={form.propiedad_id} onChange={e=>onPropChange(e.target.value)}>
            <option value="">Propiedad</option>
            {props.map(p=><option key={p.id} value={p.id}>{p.codigo} — {p.direccion}</option>)}
          </select>

          <select value={form.unidad_id} onChange={e=>setForm({...form,unidad_id:e.target.value})}>
            <option value="">Unidad (si aplica)</option>
            {unidades.map(u=><option key={u.id} value={u.id}>{u.etiqueta}</option>)}
          </select>
          <div className="toolbar">
            <input placeholder="Nueva unidad (ej. UP/DN)" value={nuevaUnidad} onChange={e=>setNuevaUnidad(e.target.value)}/>
            <button className="secondary" onClick={crearUnidad}>Crear unidad</button>
          </div>

          <input placeholder="Renta mensual" value={form.renta_mensual} onChange={e=>setForm({...form,renta_mensual:e.target.value})}/>
          <input placeholder="Inicio contrato (YYYY-MM-DD)" value={form.contrato_inicio} onChange={e=>setForm({...form,contrato_inicio:e.target.value})}/>
          <input placeholder="Fin contrato (YYYY-MM-DD)" value={form.contrato_fin} onChange={e=>setForm({...form,contrato_fin:e.target.value})}/>
          <select value={form.banco_id} onChange={e=>setForm({...form,banco_id:e.target.value})}>
            <option value="">Banco (depósitos)</option>
            {bancos.map(b=><option key={b.id} value={b.id}>{b.nombre}</option>)}
          </select>
        </div>
        <div className="toolbar"><button onClick={send}>Guardar</button></div>
      </div>

      <div className="card">
        <h3>Inquilinos</h3>
        <table className="table">
          <thead><tr>
            <th>Nombre</th><th>Propiedad</th><th>Unidad</th><th>Renta</th><th>Inicio</th><th>Fin</th>
          </tr></thead>
          <tbody>
            {list.map(t=>(
              <tr key={t.id}>
                <td>{t.nombre}</td>
                <td>{t.propiedad_id||'-'}</td>
                <td>{t.unidad_id||'-'}</td>
                <td>${t.renta_mensual||'-'}</td>
                <td>{t.contrato_inicio||'-'}</td>
                <td>{t.contrato_fin||'-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
