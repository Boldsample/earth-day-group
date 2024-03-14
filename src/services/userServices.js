export const getUsers = async (inputField) => {
    const url = `https://api.github.com/search/users?q=${inputField}`;
    const res = await fetch(url);
    const data = await res.json();
    const cleanUpResults = data.items.splice(10);
    return data.items;
  };
  
  export const getUser = async (name) => {
    const url = `https://api.github.com/users/${name}`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
  };