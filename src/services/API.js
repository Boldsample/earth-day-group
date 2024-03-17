import axios from "axios";

export const API = axios.create({
  baseURL: "https://earth-day-group.boldsample.com/laravel/api/",
  headers: {
    "Content-Type": "application/json",
  },
});
