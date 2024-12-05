import React, { useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  loadingToggleAction,
  signupAction,
} from "../../store/actions/AuthActions";

function Register(props) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    if (!formData.username.trim()) {
      tempErrors.username = "El nombre de usuario es requerido";
      isValid = false;
    }

    if (!formData.email) {
      tempErrors.email = "El email es requerido";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email inválido";
      isValid = false;
    }

    if (!formData.password) {
      tempErrors.password = "La contraseña es requerida";
      isValid = false;
    } else if (formData.password.length < 6) {
      tempErrors.password = "La contraseña debe tener al menos 6 caracteres";
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = "Las contraseñas no coinciden";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const onSignUp = (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(loadingToggleAction(true));
      dispatch(signupAction(formData.email, formData.password, navigate));
    }
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
            <h2 className="text-white mb-4">Bienvenido al Sistema</h2>
            <p className="text-white-50">
              Crea una cuenta para comenzar a gestionar tus pedidos
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
              <h3 className="fw-bold">Crear Cuenta</h3>
              <p className="text-muted">Ingresa tus datos para registrarte</p>
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

            <form onSubmit={onSignUp}>
              <div className="mb-4">
                <label className="form-label">Nombre de Usuario</label>
                <input
                  type="text"
                  name="username"
                  className={`form-control ${
                    errors.username ? "is-invalid" : ""
                  }`}
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Usuario"
                />
                {errors.username && (
                  <div className="invalid-feedback">{errors.username}</div>
                )}
              </div>

              <div className="mb-4">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>

              <div className="mb-4">
                <label className="form-label">Confirmar Contraseña</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className={`form-control ${
                    errors.confirmPassword ? "is-invalid" : ""
                  }`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && (
                  <div className="invalid-feedback">
                    {errors.confirmPassword}
                  </div>
                )}
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
                Registrarse
              </button>
            </form>

            <div className="text-center mt-4">
              <p className="mb-0 text-muted">
                ¿Ya tienes una cuenta?{" "}
                <Link to="/login" className="text-primary">
                  Inicia sesión aquí
                </Link>
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

export default connect(mapStateToProps)(Register);
