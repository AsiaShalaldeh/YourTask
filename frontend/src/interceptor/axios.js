// import axios from "axios";

// let refresh = false;

// axios.interceptors.response.use(
//   (resp) => resp,
//   async (error) => {
//     if (error.response.status === 401 && !refresh) {
//       refresh = true;
//       console.log(localStorage.getItem("refresh_token"));
//       try {
//         const response = await axios.post(
//           "http://localhost:8000/token/refresh/",
//           {
//             refresh: localStorage.getItem("refresh_token"),
//           },
//           {
//             headers: {
//               "Content-Type": "application/json",
//             },
//             withCredentials: true,
//           }
//         );

//         if (response.status === 200) {
//           axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.access_token}`;
//           localStorage.setItem("access_token", response.data.access_token);
//           localStorage.setItem("refresh_token", response.data.refresh_token);
//           return axios(error.config);
//         }
//       } catch (error) {
//         console.error("Error refreshing token:", error);
//       }
//     }
//     refresh = false;
//     return Promise.reject(error);
//   }
// );
// Wrapper for HTTP requests with Axios
import axios from 'axios';

// Add a request interceptor
axios.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access_token');

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
