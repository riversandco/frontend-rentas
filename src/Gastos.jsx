import { useEffect, useState } from 'react';
import api from './api';

const TIPOS = ['Agua','Sewer','Basura','Grama','Nieve','Insurance','Luz','Gas'];
const QUIEN = ['Owner','Tenant'];

export default function Gastos(){
  const [props, setProps] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [bancos, setBancos] = useState([]);
  const [list, setList] = useState([]);

  const [form, setForm] = useState({
    propiedad_id:'', unidad_id:'', tipo:'', pagado_por:'', monto:'', fecha:'', descripcion:'', banco_id:''
  });

  const load = async ()=>{
    const [p,g,b] = await Promise.all([
      api.get('/propiedades'), api.get('/gastos'), api.get('/bancos')
    ]);
    setProps(p.data); setList(g.data); setBancos(b.data);
  };
  useEffect(()=>{ load(); },[]);

  const onProp = async(id)=>{
    setForm({...form,propiedad_id:id, unidad_id:''});
    if(!id){ setUnidades([]); return; }
    const r = await api.get(`/propiedades/${id}/unidades`);
    setUnidades(r.data);
  };

  const send = async ()=>{
    await api.post('/gastos', {
      ...form,
      propiedad_id: form.propiedad_id || null,
      unidad_id: form.unidad_id || null,
      banco_id: form.banco_id || null,
      monto: +form.monto || 0
    });
    setForm({propiedad_id:'', unidad_id:'', tipo:'', pagado_por:'', monto:'', fecha:'', descripcion:'', banco_id:''});
    load();
  };

  return (
    <>
      <div className="card">
        <h3>Registrar Gasto</h3>
        <div className="row">
          <select value={form.propiedad_id} onChange={e=>onProp(e.target.value)}>
            <option value="">Propiedad (opcional)</option>
            {props.map(p=><option key={p.id} value={p.id}>{p.codigo} — {p.direccion}</option>)}
          </select>
          <select value={form.unidad_id} onChange={e=>setForm({...form,unidad_id:e.target.value})}>
            <option value="">Unidad (si aplica)</option>
            {unidades.map(u=><option key={u.id} value={u.id}>{u.etiqueta}</option>)}
          </select>
          <select value={form.tipo} onChange={e=>setForm({...form,tipo:e.target.value})}>
            <option value="">Tipo de gasto</option>
            {TIPOS.map(x=><option key={x}>{x}</option>)}
          </select>
          <select value={form.pagado_por} onChange={e=>setForm({...form,pagado_por:e.target.value})}>
            <option value="">Pagado por</option>
            {QUIEN.map(x=><option key={x}>{x}</option>)}
          </select>

          <input placeholder="Monto" value={form.monto} onChange={e=>setForm({...form,monto:e.target.value})}/>
          <input placeholder="Fecha (YYYY-MM-DD)" value={form.fecha} onChange={e=>setForm({...form,fecha:e.target.value})}/>
          <input placeholder="Descripción" value={form.descripcion} onChange={e=>setForm({...form,descripcion:e.target.value})}/>
          <select value={form.banco_id} onChange={e=>setForm({...form,banco_id:e.target.value})}>
            <option value="">Banco</option>
            {bancos.map(b=><option key={b.id} value={b.id}>{b.nombre}</option>)}
          </select>
        </div>
        <div className="toolbar"><button onClick={send}>Guardar</button></div>
      </div>

      <div className="card">
        <h3>Gastos</h3>
        <table className="table">
          <thead><tr>
            <th>Propiedad</th><th>Unidad</th><th>Tipo</th><th>Pagado por</th><th>Monto</th><th>Fecha</th><th>Banco</th><th>Descripción</th>
          </tr></thead>
          <tbody>
            {list.map(g=>(
              <tr key={g.id}>
                <td>{g.propiedad_id||'-'}</td>
                <td>{g.unidad_id||'-'}</td>
                <td>{g.tipo}</td>
                <td>{g.pagado_por}</td>
                <td>${g.monto}</td>
                <td>{g.fecha}</td>
                <td>{g.banco_id||'-'}</td>
                <td>{g.descripcion||''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
