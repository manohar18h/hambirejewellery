import axios from "axios";

const api = axios.create({
  baseURL: "https://api.hambirejewellery.com/api/catalog",
});

export default api;
