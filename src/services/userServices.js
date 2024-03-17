import { API } from "./API.js";


export const getUsers = async () => {
  const res = await API.get("/users");
  return res.data;
};

export const getUser = async (name) => {
  const url = `https://api.github.com/users/${name}`;
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

export const createUser = async (data) => {
  return await API.post("/users", data);
};
