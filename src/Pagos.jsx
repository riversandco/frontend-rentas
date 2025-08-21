import { useEffect, useState } from 'react';
import api from './api';

export default function Pagos(){
  const [bancos, setBancos] = useState([]);
  const [inquilinos, setInquilinos] = useState([]);
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    inquilino_id:'', propiedad_id:'', unidad_id:'', monto:'', fecha:'', metodo:'Transferencia', banco_id:'', mes_correspondiente:'', nota:''
  });

  const load = async()=>{
    const [b, t, p] = await Promise.all([
      api.get('/bancos'), api.get('/inquilinos'), api.get('/pagos')
    ]);
    setBancos(b.data); setInquilinos(t.data); setList(p.data);
  };
  useEffect(()=>{ load(); },[]);

  const onTenant = (id)=>{
    const t = inquilinos.find(x=> String(x.id)===String(id));
    setForm({...form, inquilino_id:id, propiedad_id:t?.propiedad_id||'', unidad_id:t?.unidad_id||''});
  };

  const send = async()=>{
    await api.post('/pagos', {
      ...form,
      monto: +form.monto || 0,
      banco_id: form.banco_id || null,
      unidad_id: form.unidad_id || null,
      propiedad_id: form.propiedad_id || null
    });
    setForm({inquilino_id:'', propiedad_id:'', unidad_id:'', monto:'', fecha:'', metodo:'Transferencia', banco_id:'', mes_correspondiente:'', nota:''});
    load();
  };

  return (
    <>
      <div className="card">
        <h3>Registrar Pago de Renta</h3>
        <div className="row">
          <select value={form.inquilino_id} onChange={e=>onTenant(e.target.value)}>
            <option value="">Inquilino</option>
            {inquilinos.map(t=><option key={t.id} value={t.id}>{t.nombre}</option>)}
          </select>
          <input placeholder="Propiedad (auto)" value={form.propiedad_id} readOnly/>
          <input placeholder="Unidad (auto)" value={form.unidad_id} readOnly/>
          <input placeholder="Monto" value={form.monto} onChange={e=>setForm({...form,monto:e.target.value})}/>
          <input placeholder="Fecha (YYYY-MM-DD)" value={form.fecha} onChange={e=>setForm({...form,fecha:e.target.value})}/>
          <input placeholder="Mes correspondiente (YYYY-MM)" value={form.mes_correspondiente} onChange={e=>setForm({...form,mes_correspondiente:e.target.value})}/>
          <select value={form.banco_id} onChange={e=>setForm({...form,banco_id:e.target.value})}>
            <option value="">Banco</option>
            {bancos.map(b=><option key={b.id} value={b.id}>{b.nombre}</option>)}
          </select>
          <input placeholder="Método (opcional)" value={form.metodo} onChange={e=>setForm({...form,metodo:e.target.value})}/>
          <input placeholder="Nota" value={form.nota} onChange={e=>setForm({...form,nota:e.target.value})}/>
        </div>
        <div className="toolbar"><button onClick={send}>Guardar</button></div>
      </div>

      <div className="card">
        <h3>Pagos</h3>
        <table className="table">
          <thead><tr>
            <th>Inquilino</th><th>Propiedad</th><th>Unidad</th><th>Monto</th><th>Fecha</th><th>Mes</th><th>Banco</th>
          </tr></thead>
          <tbody>
            {list.map(p=>(
              <tr key={p.id}>
                <td>{p.inquilino_id||'-'}</td>
                <td>{p.propiedad_id||'-'}</td>
                <td>{p.unidad_id||'-'}</td>
                <td>${p.monto}</td>
                <td>{p.fecha}</td>
                <td>{p.mes_correspondiente||''}</td>
                <td>{p.banco_id||'-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
