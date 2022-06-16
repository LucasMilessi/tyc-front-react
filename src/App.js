import { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Formik, Field, Form } from "formik";
import * as Yup from 'yup';

const URL_API = process.env.URL_API_TYC;

const docSchema = Yup.object().shape({
  numDocumento: Yup.string()
    .required("Este campo es obligatorio. Por favor ingrese su número de documento"),
  checkB: Yup.boolean()
});

function App() {

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [show, setShow] = useState(false);
  const [tyc, setTyc] = useState([]);
  const [tipoDoc, setTipoDoc] = useState();
  const [doc, setDoc] = useState("");
  const [check, setCheck] = useState(false);
  const [estado, setEstado] = useState(true);
  const [boton, setBoton] = useState(true);

    const validarCedula = (value) => {
    const cedulaValida = /[0-9]{2}-PN-[0-9]{3}-[0-9]{4}/;
    
    if(cedulaValida.test(value.replace(/\s/g, ""))){
      setBoton(false)
      setDoc(value)
    }else{
      setBoton(true)
      setDoc("")
    }

    return cedulaValida.test(value.replace(/\s/g, ""))
      ? undefined
      : 'La cédula no es correcta, ej: 12-PN-123-1234';
  };

  const validarPasaporte = (value) => {
    const pasaporteValido = /^[a-zA-Z0-9-]{5,16}$/;
    
    if(pasaporteValido.test(value.replace(/\s/g, ""))){
      setBoton(false)
      setDoc(value)
    }else{
      setBoton(true)
      setDoc("")
    }

    return pasaporteValido.test(value.replace(/\s/g, ""))
      ? undefined 
      : 'El pasaporte no es correcto, debe de contener de 5 a 16 caracteres, ej: 123-PN-12';
      
  };


  useEffect(() => {
    fetch(URL_API + '/mostrarTyC')
      .then(response => response.json())
      .then(data =>
        setTyc(data));
  }, []);

  const AgregarAceptTyC = () => {
    //values.preventDefault();

    console.log(doc)

    let datos = {
      tipoDocumento: tipoDoc,
      documento: doc,
      versionTC: tyc.version
    };

    console.log(datos);

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

    setCheck(check);
    setEstado(true);
    setBoton(true);

  }

  const HabilitarCheck = () => {
    setCheck(!check);
    setEstado(false);
    handleClose();
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


      <div className="container input-group">
        <select className='form-select form-select-lg mb-3' onChange={event => { setTipoDoc(event.target.value) }}>
          <option className='btn btn-primary'>Elegir Tipo documento</option>
          <option value="Cedula">Cedula</option>
          <option value="Pasaporte">Pasaporte</option>
        </select>
      </div>

      <br />
      <br />
      <br />

      <Formik
        initialValues={{
          numDocumento: '',
          checkB: false,
          
        }}
        validationSchema={docSchema}
        onSubmit={(values) => {
          setDoc(values.numDocumento)}}
      >
        {({ errors, touched }) => (
          <Form>

            <div className="container input-group">
              <span className="input-group-text" id="inputGroup-sizing-lg">Número de Documento</span>
              <Field
                id="numDocumento"
                type="text"
                className="form-control"
                name="numDocumento"
                placeholder='Ingrese su número de documento'
                aria-label="Large"
                aria-describedby="inputGroup-sizing-sm" 
                validate={tipoDoc === 'Pasaporte' ? validarPasaporte : validarCedula}
                 />
            </div>

            {errors.numDocumento && touched.numDocumento ? (
              <div className='m-4 row justify-content-center text-danger'>{errors.numDocumento}</div>
            ) : null}

            <br />
            <br />
            <br />

            <div className="container">
              <div className="form-check">
                <Field className="form-check-input m-4 row justify-content-center"
                  type="checkbox"
                  name="checkB"
                  value="{check}"
                  disabled={estado}
                  onChange={AgregarAceptTyC}
                />
              </div>

              <Button className="nextButton" onClick={handleShow}>
                Ver Terminos y Condicones
              </Button>

            </div>

            <Modal show={show} onHide={handleClose} backdrop='static' keyboard="false">
              <Modal.Header closeButton>
                <Modal.Title><div className='m-0 row justify-content-center'>Terminos y Condiciones</div></Modal.Title>
              </Modal.Header>
              <Modal.Body>{tyc.descripcion}</Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={HabilitarCheck} type="submit" disabled={boton} onChange={handleClose}>
                  Aceptar TyC
                </Button>
              </Modal.Footer>
            </Modal>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default App;
