import axios from "axios";

const API = `${window.location.protocol}//${window.location.hostname}:8000`;

export const listAnnotations = (trackId) =>
  axios.get(`${API}/annotations/${trackId}`);

export const createAnnotation = (data) =>
  axios.post(`${API}/annotations`, data);

export const deleteAnnotation = (id) =>
  axios.delete(`${API}/annotations/${id}`);
