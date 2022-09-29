import axios from "axios";
const axiosInstance = axios.create({
  baseURL: 'https://www.coordinatemanager.xyz:441',
})
export default axiosInstance;