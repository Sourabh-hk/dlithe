import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const skillService = {
  getSkills: async (search = '', category = '', experienceLevel = '', availability = '') => {
    let query = `${API_URL}/skills?`;
    if (search) query += `search=${search}&`;
    if (category) query += `category=${category}&`;
    if (experienceLevel) query += `experienceLevel=${experienceLevel}&`;
    if (availability) query += `availability=${availability}&`;

    const response = await axios.get(query);
    return response.data;
  },

  getSkillById: async (id) => {
    const response = await axios.get(`${API_URL}/skills/${id}`);
    return response.data;
  },

  createSkill: async (skillData) => {
    const response = await axios.post(`${API_URL}/skills`, skillData);
    return response.data;
  },

  updateSkill: async (id, skillData) => {
    const response = await axios.put(`${API_URL}/skills/${id}`, skillData);
    return response.data;
  },

  deleteSkill: async (id) => {
    const response = await axios.delete(`${API_URL}/skills/${id}`);
    return response.data;
  }
};

export default skillService;
