import { createContext, useState, useEffect, useCallback } from 'react';
import skillService from '../services/skillService';

export const SkillContext = createContext();

export const SkillProvider = ({ children }) => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSkills = useCallback(async (search, category, experienceLevel, availability) => {
    setLoading(true);
    setError(null);
    try {
      const data = await skillService.getSkills(search, category, experienceLevel, availability);
      setSkills(data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch skills');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <SkillContext.Provider value={{ skills, loading, error, fetchSkills }}>
      {children}
    </SkillContext.Provider>
  );
};
