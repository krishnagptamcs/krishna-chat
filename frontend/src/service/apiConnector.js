// IMPORTING THE AXIOS , making HTTP request form web browser or backend

import axios from "axios";

// CREATING THE AXIOS INSTANCE

export const axiosInstance = axios.create({});

// EXPORTING THE FUNCTION WHICH IS USED IN OPERATION'S , PASSING ALL THE REQUIRED PARAMETRS IN IT , IT RETURN THE AXIOSINSTANCE

export const apiConnector = (method, url, bodyData, headers, params) => {
  return axiosInstance({
    method: `${method}`,
    url: `${url}`,
    data: bodyData ? bodyData : null,
    headers: headers
      ? {
          ...headers,
          "Content-Type": "application/json",
        }
      : {
          "Content-Type": "application/json",
        },
    params: params ? params : null,
  });
};
