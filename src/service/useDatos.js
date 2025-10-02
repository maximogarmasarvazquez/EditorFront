// src/service/useDatos.js
import { useState, useEffect } from "react";
import axios from "axios";

const useDatos = () => {
  const [subestaciones, setSubestaciones] = useState([]);


  useEffect(() => {
    axios.get("http://localhost:5000/subestaciones")
      .then(res => setSubestaciones(res.data))
      .catch(err => console.error(err));


  }, []);

  return { subestaciones };
};

export default useDatos;
