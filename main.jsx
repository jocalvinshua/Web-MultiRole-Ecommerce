import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

import App from "./App.jsx";

import { AuthContextProvider } from "./src/context/AuthContext.jsx";
import { AppContextProvider } from "./src/context/AppContext.jsx";
import { ProductContextProvider } from "./src/context/ProductContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthContextProvider>
      <AppContextProvider>
        <ProductContextProvider>
          <App />
        </ProductContextProvider>
      </AppContextProvider>
    </AuthContextProvider>
  </BrowserRouter>
);
