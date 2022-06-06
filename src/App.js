import { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';


const URL_API = 'http://localhost:8082/api/termYcond'

function App() {

  const [tyc, setTyc] = useState([]);
  const [tipoDoc, setTipoDoc] = useState();
  const [doc, setDoc] = useState();
  const [check, setCheck] = useState(false);
  const [estado, setEstado] = useState(true);

  const AbrirPagina = () => {
    window.open("Hola")
  }

  useEffect(() => {
    fetch(URL_API + '/mostrarTyC')
      .then(response => response.json())
      .then(data =>
        setTyc(data));
  }, []);

  const AgregarAceptTyC = (event) => {
    event.preventDefault();

    let datos = {
      tipoDocumento: tipoDoc,
      documento: doc,
      versionTC: tyc.version
    };

    const request = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    };

    console.log(datos)
    console.log(request)

    fetch(URL_API + '/crearAcept',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      })
      .then(response => response.json())
      .then((termYcond) => {
        console.log(termYcond);
      })
      .catch((error) => {
        console.log("Error: ", error);
      });


    setCheck(!check);
    setEstado(false);
  }

  const HabilitarCheck = () => {
    setCheck(!check);
    setEstado(false);
  }

  return (
    <>
      <div className='m-0 row justify-content-center'>
        <h1 className='m-2 row justify-content-center'>Aceptacion de Terminos y Condiciones</h1>
      </div>

      <br />
      <br />
      <br />

      <p className='m-4 row justify-content-center'>Tipo de Documento</p>

      <div class="container input-group">
        <select className='form-select form-select-lg mb-3' onChange={event => { setTipoDoc(event.target.value) }}>
          <option className='btn btn-primary'>Elegir Tipo documento</option>
          <option value="Cedula">Cedula</option>
          <option value="Pasaporte">Pasaporte</option>
        </select>
      </div>

      <br />
      <br />
      <br />

      <div class="container input-group">
        <span class="input-group-text" id="inputGroup-sizing-lg">Número de Documento</span>
        <input type="text"
          class="form-control"
          placeholder='Ingrese su numero de documento'
          aria-label="Large"
          aria-describedby="inputGroup-sizing-sm"
          onChange={event => { setDoc(event.target.value) }} />
      </div>

      <br />
      <br />
      <br />

      <div class="container">
        <div class="form-check">
          <input class="form-check-input m-3 row justify-content-center"
            type="checkbox"
            value="{check}"
            disabled={estado}
            onChange={AgregarAceptTyC}
          />
          <Popup trigger={<button className='btn btn-warning m-2'>Leer Terminos y Condiciones</button>} position="right center">
            <div>
              {tyc.descripcion}
              <button className='btn btn-warning m-3' onChange={HabilitarCheck}>Aceptar TyC</button>
            </div>
          </Popup>
        </div>
      </div>
    </>
  );
}

export default App;
