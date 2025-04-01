import { userRI } from "../../interfaces/user.interface";

export interface SignUpState {
  userR: userRI;
  signUpUser: (userR: userRI) => Promise<void>;
}
