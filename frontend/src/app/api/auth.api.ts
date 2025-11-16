import api from '../config/api.config';

export const LoginAPI = async (credentials: { email_or_username: string; password: string }) => {
  const response = await api.get(`/auth/login?email_or_username=${credentials.email_or_username}&password=${credentials.password}`);
  return response.data;
}


export const SignUpAPI = async (credentials: { email: string; password: string, name: string, username: string, role: string,authParty:string | undefined }) => {
  const response = await api.post(`/auth/signup?authParty=${credentials.authParty}`, credentials);
  return response.data;
}