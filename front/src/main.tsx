/* import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { UserProvider } from './context/UserContext.tsx';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
   <React.StrictMode>
      <UserProvider>
         <App />
      </UserProvider>
   </React.StrictMode>
);
 */
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import ServerChecker from "./services/axios.ServerChecker.ts";
import ServerError from "./components/ServerError/ServerError.tsx";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen.tsx";
import { UserProvider } from "./context/UserContext.tsx";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

async function initApp() {
  root.render(<LoadingScreen />); // Carga inicial

  try {
    const servidorActivo = await ServerChecker.checkServer();

    if (servidorActivo) {
      root.render(
        <React.StrictMode>
          <UserProvider>
            <Suspense fallback={<LoadingScreen />}>
              <App />
            </Suspense>
          </UserProvider>
        </React.StrictMode>
      );
    } else {
      root.render(<ServerError />);
    }
  } catch (error) {
    console.error("Error al verificar el servidor:", error);
    root.render(<ServerError />);
  }
}

initApp();
