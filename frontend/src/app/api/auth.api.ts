import api from '../config/api.config';

export const LoginAPI = async (credentials: { email_or_username: string; password: string }) => {
  const response = await api.get(`/auth/login?email_or_username=${credentials.email_or_username}&password=${credentials.password}`);
  return response.data;
}