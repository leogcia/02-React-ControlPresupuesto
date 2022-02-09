import { useEffect, useState } from 'react'
import Header from './components/Header'
import ListadoGastos from './components/ListadoGastos';
import Filtros from './components/Filtros';
import Modal from './components/Modal';
import IconoNuevoGasto from './img/nuevo-gasto.svg'
import { generarId } from './helpers';

function App() {
  const [gastos, setGastos] = useState(
    localStorage.getItem('gastos') ? JSON.parse(localStorage.getItem('gastos')) : []
  );

  const [presupuesto, setPresupuesto] = useState(
    Number(localStorage.getItem('presupuesto')) ?? 0  //Busca si hay algo en localStorage, si lo hay lo mantiene, si no el valor inicial del State es 0
  );
  const [isValidPresupuesto, setIsValidPresupuesto] = useState(false);

  const [modal, setModal] = useState(false);
  const [animarModal, setAnimarModal] = useState(false);

  const [gastoEditar, setGastoEditar] = useState({});

  const [filtro, setFiltro] = useState('');
  const [gastosFiltrados, setGastosFiltrados] = useState([]);

  useEffect(()=> {
    if(Object.keys(gastoEditar).length > 0) {
      setModal(true);
      setTimeout(() => {
        setAnimarModal(true)
    }, 500);
    }
  }, [gastoEditar]);  //se ejecuta cuando cambia gastoEditar

  useEffect(()=>{
    localStorage.setItem('presupuesto', presupuesto ?? 0)
  },[presupuesto]);   //se ejecuta cuando cambia presupuesto

  useEffect(()=> {
    localStorage.setItem('gastos', JSON.stringify(gastos) ?? [])    //JSON.stringify se usa porque no podemos agregar arreglos al localStorage, por lo tanto convertimos todo el contenido de éste en string
  },[gastos]); //se ejecuta cuando cambia gastos

  useEffect(()=>{
    const presupuestoLS = Number(localStorage.getItem('presupuesto')) ?? 0;
    if(presupuestoLS > 0){
      setIsValidPresupuesto(true)
    }
  },[]);   //se ejecuta una vez cuando inicia la aplicación

  useEffect(()=> {  
    if(filtro) {
      //Filtrar gastos por categoria
      const gastosFiltrados = gastos.filter(gasto => gasto.categoria === filtro);
      setGastosFiltrados(gastosFiltrados);
    }
  },[filtro]);   //se ejecuta una vez cuando inicia la filtro

  const handleNuevoGasto = () => {
    setModal(true);
    setGastoEditar({})
    setTimeout(() => {
      setAnimarModal(true)
    }, 500);
  }

  const guardarGasto = (gasto) => {
    if(gasto.id) {
      //Actualizar
      const gastosActualizados = gastos.map(gastoState => gastoState.id === gasto.id ? gasto : gastoState);
      setGastos(gastosActualizados);
      setGastoEditar({})
    } else {
      //Nuevo Gasto
      gasto.id = generarId();
      gasto.fecha = Date.now();
      setGastos([...gastos, gasto]);
    }
    setAnimarModal(false);
      setTimeout(() => {
          setModal(false);
      }, 500);
  }

  const eliminarGasto = (id) =>{
    const gastosActualizados = gastos.filter(gasto => gasto.id !== id);
    setGastos(gastosActualizados)
  }

  return (
    <div className={modal ? 'fijar' : ''}>
      <Header
        gastos={gastos}
        setGastos={setGastos}
        presupuesto={presupuesto}
        setPresupuesto={setPresupuesto}
        isValidPresupuesto={isValidPresupuesto}
        setIsValidPresupuesto={setIsValidPresupuesto}
      />

      {
        isValidPresupuesto && (
          <>
            <main>
              <Filtros
                filtro={filtro}
                setFiltro={setFiltro}
              />
              <ListadoGastos
                gastos={gastos}
                setGastoEditar={setGastoEditar}
                eliminarGasto={eliminarGasto}
                filtro={filtro}
                gastosFiltrados={gastosFiltrados}
              />
            </main>
            <div className="nuevo-gasto">
              <img
                src={IconoNuevoGasto}
                alt="imagen icono"
                onClick={handleNuevoGasto}
              />
            </div>
          </>
        )
      }

      {
        modal && <Modal
                    setModal={setModal}
                    animarModal={animarModal}
                    setAnimarModal={setAnimarModal}
                    guardarGasto={guardarGasto}
                    gastoEditar={gastoEditar}
                    setGastoEditar={setGastoEditar}
                />
      }
      
    </div>
  )
}

export default App
