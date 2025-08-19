import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./screens/auth/login";
import Register from "./screens/auth/register";
// import NovaOcorrencia from "./screens/novaocorrencia/novaocorrencia";
import DetalhesOcorrencias from "./screens/detalhesocorrencias/detalhesocorrencias";
import PerfilConfiguracao from "./screens/perfilconfiguracao/perfilconfiguracao";
// import Relatorios from "./screens/relatorios/relatorios";
import EditarOcorrencias from "./screens/editarocorrencia/editarocorrencia";
import { PrivateRoute } from "./store/privateRoutes";
import { PublicRoute } from "./store/publicRoute"; // <-- novo
import Home from "./screens/home/Home";
import Ocorrencias from "./screens/ocorrencias/ocorrencias";
import NovaOcorrencia from "./screens/novaocorrencia/novaocorrencia";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* públicas (se logado, vai p/ /home) */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* privadas (só com token) */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/ocorrencias"
          element={
            <PrivateRoute>
              <Ocorrencias />
            </PrivateRoute>
          }
        />
        <Route
          path="/novaocorrencia"
          element={
            <PrivateRoute>
              <NovaOcorrencia />
            </PrivateRoute>
          }
        />
        <Route
          path="/detalhesocorrencias/:id"
          element={
            <PrivateRoute>
              <DetalhesOcorrencias />
            </PrivateRoute>
          }
        />
        <Route
          path="/detalhesocorrencias/:id/edit"
          element={
            <PrivateRoute>
              <EditarOcorrencias />
            </PrivateRoute>
          }
        />
        <Route
          path="/perfilconfiguracao"
          element={
            <PrivateRoute>
              <PerfilConfiguracao />
            </PrivateRoute>
          }
        />
        {/* 
        
       
        <Route path="/relatorios" element={<PrivateRoute><Relatorios /></PrivateRoute>} />
        <Route path="/auditoria" element={<PrivateRoute><div className="p-6">Página de Auditoria</div></PrivateRoute>} />
        */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
