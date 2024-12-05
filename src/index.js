import React from "react";
import ReactDOM from "react-dom/client";
//import './index.css';
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import ThemeContext from "./context/ThemeContext";
import reportWebVitals from "./reportWebVitals";
import { store } from "./store/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter basename="/">
        <ThemeContext>
          <App />
        </ThemeContext>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
