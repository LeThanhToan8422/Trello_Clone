import axios from "axios";
import { userRI } from "./../interfaces/user.interface";
import { create } from "zustand";
import { API_URL } from "../assets/constants/constant";

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
    const response = await axios.post(`${API_URL}/users`, userR);
    set(() => ({
      userR: response.data,
    }));
  },
});

export const useSignUpStore = create<SignUpState>(store);
