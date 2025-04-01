import axios from "axios";
import { loginRI, loginResponse } from "../interfaces/login.interface";
import { create } from "zustand";
import { API_URL, SECRET_KEY, TOKEN_KEY } from "../assets/constants/constant";
import * as CryptoJS from "crypto-js";

interface LoginState {
  userR: loginRI;
  token: string | null;
  isLoggedIn: boolean;
  loginUser: (userR: loginRI) => Promise<void>;
  checkLogin: () => void;
  logout: () => void;
}

const store = (
  set: (fn: (state: LoginState) => Partial<LoginState>) => void
) => ({
  userR: {
    email: "",
    password: "",
  },
  token: localStorage.getItem(TOKEN_KEY),
  isLoggedIn: !!localStorage.getItem(TOKEN_KEY),
  loginUser: async (userR: loginRI) => {
    try {
      const cryptioPassword = CryptoJS.AES.encrypt(
        userR.password,
        SECRET_KEY
      ).toString();
      const response = await axios.post<loginResponse>(
        `${API_URL}/users/login`,
        {
          ...userR,
          password: cryptioPassword,
        }
      );
      const token = response.data.token;
      localStorage.setItem(TOKEN_KEY, token);
      set(() => ({
        token,
        isLoggedIn: true,
      }));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error("Email hoặc mật khẩu không chính xác");
        } else if (error.response?.status === 404) {
          throw new Error("Tài khoản không tồn tại");
        } else {
          throw new Error("Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại sau.");
        }
      }
      throw new Error("Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại sau.");
    }
  },
  checkLogin: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    set(() => ({
      token,
      isLoggedIn: !!token,
    }));
  },
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    set(() => ({
      token: null,
      isLoggedIn: false,
    }));
  },
});

export const useLoginStore = create<LoginState>(store);
