import axios from "axios";

const api=`${window.location.protocol}//${window.location.hostname}:8000`;

export const getEvents=(limit=100)=>
    axios.get(`${api}/events?limit=${limit}`);

export const getDashboard=()=>
    axios.get(`${api}/events/dashboard`);
