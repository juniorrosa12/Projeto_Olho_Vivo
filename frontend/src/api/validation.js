import axios from "axios";

const api=`${window.location.protocol}//${window.location.hostname}:8000`;

export const approve=id=>axios.post(`${api}/validation/${id}/approve`);

export const reject=id=>axios.post(`${api}/validation/${id}/reject`);
