import { useEffect, useState } from 'react';
import api from './api';

const TIPOS = ['Single','Duplex'];
const ESTADOS = ['Disponible','Rentada','En mantenimiento','En revisión'];

export default function Propiedades(){
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    codigo:'', direccion:'', tipo:'', estado:'', zipcode:'', cuartos:'', banos:'', status:'',
    compra:'', remodelacion:'', all_in:'', arv:'', renta_estimada:'', fecha_compra:'',
    agua_cuenta:'', energia_cuenta:'', sewer_cuenta:'', gas_cuenta:'', insurance_num:'', notas:''
  });

  const load = async()=> setList((await api.get('/propiedades')).data);
  useEffect(()=>{ load(); },[]);

  const send = async ()=>{
    await api.post('/propiedades', {...form, cuartos:+form.cuartos||0, banos:+form.banos||0});
    setForm({codigo:'', direccion:'', tipo:'', estado:'', zipcode:'', cuartos:'', banos:'', status:'',
      compra:'', remodelacion:'', all_in:'', arv:'', renta_estimada:'', fecha_compra:'',
      agua_cuenta:'', energia_cuenta:'', sewer_cuenta:'', gas_cuenta:'', insurance_num:'', notas:''});
    load();
  };

  return (
    <>
      <div className="card">
        <h3>Nueva Propiedad</h3>
        <div className="row">
          <input placeholder="ID/Código (ej. 1A)" value={form.codigo} onChange={e=>setForm({...form,codigo:e.target.value})}/>
          <input placeholder="Dirección" value={form.direccion} onChange={e=>setForm({...form,direccion:e.target.value})}/>
          <select value={form.tipo} onChange={e=>setForm({...form,tipo:e.target.value})}>
            <option value="">Tipo</option>{TIPOS.map(x=><option key={x}>{x}</option>)}
          </select>
          <select value={form.estado} onChange={e=>setForm({...form,estado:e.target.value})}>
            <option value="">Estado</option>{ESTADOS.map(x=><option key={x}>{x}</option>)}
          </select>

          <input placeholder="Zipcode" value={form.zipcode} onChange={e=>setForm({...form,zipcode:e.target.value})}/>
          <input placeholder="Cuartos" value={form.cuartos} onChange={e=>setForm({...form,cuartos:e.target.value})}/>
          <input placeholder="Baños" value={form.banos} onChange={e=>setForm({...form,banos:e.target.value})}/>
          <input placeholder="Status (Rentada/Vacant)" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}/>

          <input placeholder="Compra" value={form.compra} onChange={e=>setForm({...form,compra:e.target.value})}/>
          <input placeholder="Remodelación" value={form.remodelacion} onChange={e=>setForm({...form,remodelacion:e.target.value})}/>
          <input placeholder="All In" value={form.all_in} onChange={e=>setForm({...form,all_in:e.target.value})}/>
          <input placeholder="ARV" value={form.arv} onChange={e=>setForm({...form,arv:e.target.value})}/>

          <input placeholder="Renta estimada" value={form.renta_estimada} onChange={e=>setForm({...form,renta_estimada:e.target.value})}/>
          <input placeholder="Fecha de compra (YYYY-MM-DD)" value={form.fecha_compra} onChange={e=>setForm({...form,fecha_compra:e.target.value})}/>
          <input placeholder="# Agua" value={form.agua_cuenta} onChange={e=>setForm({...form,agua_cuenta:e.target.value})}/>
          <input placeholder="# Energía" value={form.energia_cuenta} onChange={e=>setForm({...form,energia_cuenta:e.target.value})}/>

          <input placeholder="# Sewer" value={form.sewer_cuenta} onChange={e=>setForm({...form,sewer_cuenta:e.target.value})}/>
          <input placeholder="# Gas" value={form.gas_cuenta} onChange={e=>setForm({...form,gas_cuenta:e.target.value})}/>
          <input placeholder="Insurance #" value={form.insurance_num} onChange={e=>setForm({...form,insurance_num:e.target.value})}/>
          <input placeholder="Notas" value={form.notas} onChange={e=>setForm({...form,notas:e.target.value})}/>
        </div>
        <div className="toolbar"><button onClick={send}>Guardar</button></div>
        <div className="badge">Para Dúplex, luego crea unidades (UP/DN) desde Inquilinos o Gastos.</div>
      </div>

      <div className="card">
        <h3>Lista de Propiedades</h3>
        <table className="table">
          <thead><tr>
            <th>ID</th><th>Dirección</th><th>Tipo</th><th>Estado</th><th>Renta est.</th>
          </tr></thead>
          <tbody>
            {list.map(p=>(
              <tr key={p.id}>
                <td>{p.codigo}</td><td>{p.direccion}</td><td>{p.tipo}</td><td>{p.estado}</td><td>${p.renta_estimada||'-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
