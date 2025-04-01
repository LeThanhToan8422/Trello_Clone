import { userRI } from "./../interfaces/user.interface";
import { create } from "zustand";
import { SECRET_KEY } from "../assets/constants/constant";
import * as CryptoJS from "crypto-js";
import axiosInstance from "../config/axios";
import axios from "axios";
import { SignUpState } from "./interfaces/signup.interface";

const store = (
  set: (fn: (state: SignUpState) => Partial<SignUpState>) => void
) => ({
  userR: {
    fullName: "",
    email: "",
    password: "",
  },
  signUpUser: async (userR: userRI) => {
    try {
      const cryptioPassword = CryptoJS.AES.encrypt(
        userR.password,
        SECRET_KEY
      ).toString();
      const response = await axiosInstance.post(`/users`, {
        ...userR,
        password: cryptioPassword,
      });
      set(() => ({
        userR: response.data,
      }));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          throw new Error("Email đã được đăng ký");
        } else {
          throw new Error("Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.");
        }
      }
      throw new Error("Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.");
    }
  },
});

export const useSignUpStore = create<SignUpState>(store);
