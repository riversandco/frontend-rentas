import { useState } from 'react';
import Propiedades from './Propiedades.jsx';
import Inquilinos from './Inquilinos.jsx';
import Pagos from './Pagos.jsx';
import Gastos from './Gastos.jsx';
import Cuentas from './Cuentas.jsx';
import Reportes from './Reportes.jsx';

export default function App(){
  const [tab, setTab] = useState('propiedades');
  return (
    <div className="container">
      <h1>Rivers & Co — Administrador de Rentas</h1>
      <div className="nav">
        {['propiedades','inquilinos','pagos','gastos','cuentas','reportes'].map(t=>(
          <button key={t} className={tab===t?'active':''} onClick={()=>setTab(t)}>
            {t[0].toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>

      {tab==='propiedades' && <Propiedades/>}
      {tab==='inquilinos' && <Inquilinos/>}
      {tab==='pagos' && <Pagos/>}
      {tab==='gastos' && <Gastos/>}
      {tab==='cuentas' && <Cuentas/>}
      {tab==='reportes' && <Reportes/>}
    </div>
  );
}
