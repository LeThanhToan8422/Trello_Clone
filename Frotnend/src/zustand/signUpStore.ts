import axios from "axios";
import { userRI } from "./../interfaces/user.interface";
import { create } from "zustand";
import { API_URL, SECRET_KEY } from "../assets/constants/constant";
import * as CryptoJS from "crypto-js";

interface SignUpState {
  userR: userRI;
  signUpUser: (userR: userRI) => Promise<void>;
}

const store = (
  set: (fn: (state: SignUpState) => Partial<SignUpState>) => void
) => ({
  userR: {
    fullName: "",
    email: "",
    password: "",
  },
  signUpUser: async (userR: userRI) => {
    const cryptioPassword = CryptoJS.AES.encrypt(
      userR.password,
      SECRET_KEY
    ).toString();
    const response = await axios.post(`${API_URL}/users`, {
      ...userR,
      password: cryptioPassword,
    });
    set(() => ({
      userR: response.data,
    }));
  },
});

export const useSignUpStore = create<SignUpState>(store);
