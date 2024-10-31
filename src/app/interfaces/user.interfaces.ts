import { UserStatus } from "../enums/userStatusenum";

export interface User {
    _id: string;
    name: string;
    email: string;
    phonenumber?: string;
    country?: string;
    profilepicture?: string;
    updatedProfile?: User;
    status?: UserStatus;
    profilePicUrl?: string;
  }