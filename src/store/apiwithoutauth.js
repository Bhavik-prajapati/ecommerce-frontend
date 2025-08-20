import axios from "axios";

const apiwithoutauth = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

export default apiwithoutauth;
