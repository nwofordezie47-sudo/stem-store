export interface User {
  id: string;
  fullName: string;
  email: string;
  role: "user" | "admin";
  favorites: string[];
}