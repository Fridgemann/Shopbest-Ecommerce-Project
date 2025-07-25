import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function showToast(message, type = "success") {
  toast[type](message, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
}

// Place <ToastContainer /> once in your app, e.g. in _app.js or Layout
export { ToastContainer };