import { loginRI } from "../../interfaces/login.interface";

export interface LoginState {
  userR: loginRI;
  token: string | null;
  isLoggedIn: boolean;
  loginUser: (userR: loginRI) => Promise<void>;
  checkLogin: () => void;
  logout: () => void;
}
