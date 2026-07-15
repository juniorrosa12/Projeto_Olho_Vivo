import axios from "axios";

const API = `${window.location.protocol}//${window.location.hostname}:8000`;

export const getStatistics = () => axios.get(`${API}/statistics/hour`);import axios from "axios";

const API=`${window.location.protocol}//${window.location.hostname}:8000`;

export const getStatistics=()=>axios.get(`${API}/statistics/hour`);
