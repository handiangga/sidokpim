import api from "./api";

export async function getActivities(params = {}) {
  const response = await api.get("/activities", { params });
  return response.data.data;
}

export async function getActivityById(id) {
  const response = await api.get(`/activities/${id}`);
  return response.data.data;
}

export async function createActivity(formData) {
  const response = await api.post("/activities", formData);
  return response.data;
}

export async function updateActivity(id, formData) {
  const response = await api.put(`/activities/${id}`, formData);
  return response.data;
}

export async function deleteActivity(id) {
  const response = await api.delete(`/activities/${id}`);
  return response.data;
}
