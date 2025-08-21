import { useEffect, useState } from 'react';
import api from './api';

export default function Cuentas(){
  const [bancos, setBancos] = useState([]);
  const [nombre, setNombre] = useState('');

  const load = async()=> setBancos((await api.get('/bancos')).data);
  useEffect(()=>{ load(); },[]);

  const add = async()=>{
    if(!nombre) return;
    await api.post('/bancos', { nombre });
    setNombre(''); load();
  };

  return (
    <>
      <div className="card">
        <h3>Cuentas Bancarias</h3>
        <div className="toolbar">
          <input placeholder="Nombre del banco" value={nombre} onChange={e=>setNombre(e.target.value)}/>
          <button onClick={add}>Agregar</button>
        </div>
        <ul>
          {bancos.map(b=> <li key={b.id} className="badge">{b.nombre}</li>)}
        </ul>
      </div>
      <div className="card">
        <p>Inicialmente cargamos: <b>BOFA - MARIO</b>, <b>BOFA - RIVERS USA</b>, <b>Mercury</b>.</p>
      </div>
    </>
  );
}
