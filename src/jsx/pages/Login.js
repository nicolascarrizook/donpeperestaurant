import React, { useState } from "react";
import { connect, useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import {
  loadingToggleAction,
  loginAction,
} from "../../store/actions/AuthActions";

function Login(props) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const dispatch = useDispatch();

  const onLogin = (e) => {
    e.preventDefault();
    let error = false;
    const errorObj = { email: "", password: "" };

    if (email === "") {
      errorObj.email = "El email es requerido";
      error = true;
    }
    if (password === "") {
      errorObj.password = "La contraseña es requerida";
      error = true;
    }

    setErrors(errorObj);
    if (error) return;

    dispatch(loadingToggleAction(true));
    dispatch(loginAction(email, password, navigate));
  };

  return (
    <div className="container-fluid p-0">
      <div className="row g-0 min-vh-100">
        {/* Lado izquierdo - Imagen */}
        <div
          className="col-lg-6 d-none d-lg-flex"
          style={{
            backgroundColor: "#FF6B00",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="text-center p-5">
            <img
              src="/logo.png"
              alt="Logo"
              style={{ maxWidth: "300px", marginBottom: "2rem" }}
            />
            <h2 className="text-white mb-4">Sistema de Gestión de Pedidos</h2>
            <p className="text-white-50">
              Administra tus pedidos de manera eficiente y sencilla
            </p>
          </div>
        </div>

        {/* Lado derecho - Formulario */}
        <div className="col-lg-6 d-flex align-items-center">
          <div className="w-100 p-4 p-lg-5">
            <div className="mb-5">
              <img
                src="/logo.png"
                alt="Logo"
                className="d-lg-none"
                style={{ maxWidth: "200px", marginBottom: "2rem" }}
              />
              <h3 className="fw-bold">Iniciar Sesión</h3>
              <p className="text-muted">
                Ingresa tus credenciales para continuar
              </p>
            </div>

            {props.errorMessage && (
              <div className="alert alert-danger" role="alert">
                {props.errorMessage}
              </div>
            )}

            {props.successMessage && (
              <div className="alert alert-success" role="alert">
                {props.successMessage}
              </div>
            )}

            <form onSubmit={onLogin}>
              <div className="mb-4">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              <div className="mb-4">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>

              <div className="mb-4">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="rememberMe"
                  />
                  <label className="form-check-label" htmlFor="rememberMe">
                    Recordar sesión
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-lg w-100"
                style={{
                  backgroundColor: "#FF6B00",
                  color: "white",
                  border: "none",
                }}
                disabled={props.showLoading}
              >
                {props.showLoading ? (
                  <span className="spinner-border spinner-border-sm me-2"></span>
                ) : null}
                Ingresar
              </button>
            </form>

            <div className="text-center mt-4">
              <p className="mb-0 text-muted">
                ¿No tienes una cuenta?{" "}
                <NavLink to="/page-register" className="text-primary">
                  Regístrate aquí
                </NavLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  errorMessage: state.auth.errorMessage,
  successMessage: state.auth.successMessage,
  showLoading: state.auth.showLoading,
});

export default connect(mapStateToProps)(Login);
