import { useEffect, useState } from 'react';
import api from './api';

export default function Reportes(){
  const [sum, setSum] = useState({ingresos:0, egresos:0, utilidad:0});

  const load = async()=> setSum((await api.get('/reportes/summary')).data);
  useEffect(()=>{ load(); },[]);

  return (
    <div className="card">
      <h3>Resumen</h3>
      <div className="row-3" style={{marginTop:8}}>
        <div className="card"><b>Ingresos</b><div style={{fontSize:22}}>${sum.ingresos.toFixed(2)}</div></div>
        <div className="card"><b>Egresos</b><div style={{fontSize:22}}>${sum.egresos.toFixed(2)}</div></div>
        <div className="card"><b>Utilidad</b><div style={{fontSize:22}}>${sum.utilidad.toFixed(2)}</div></div>
      </div>
      <p className="badge" style={{marginTop:12}}>Más reportes (por propiedad / mes) se pueden añadir fácil después.</p>
    </div>
  );
}
