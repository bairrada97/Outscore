const axios = require('axios').default;
const config = require('./Config');

const axiosInstance = axios.create({
    ...config.axios,
    "method":"GET",
});

// Add a response interceptor
axiosInstance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if(response.headers['content-type'] === 'application/json'){
        return response;
    }
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (err.response) {
        // client received an error response (5xx, 4xx)
        console.log(err.response);
      } else if (err.request) {
        // client never received a response, or request never left
        console.log(err.request);
      } else {
        // anything else
        console.log(error);
      }
    return Promise.reject(error);
  });

  // Add a request interceptor
  axiosInstance.interceptors.request.use(function (config) {
    // Do something before request is sent
    console.info(config.baseURL, config)
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

  module.exports = axiosInstance;