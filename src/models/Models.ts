export interface Message {
  sender: User;
  receiver: User;
  message: string;
  timestamp: string;
}

export interface User {
  id: number;
  username: string;
  password: string;
  role: "ROLE_PARENT" | "ROLE_TEACHER" | "ROLE_ADMIN";
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: Date;
  organizer: User;
}

// Define the structure of JWT payload
export interface JwtPayload {
  id: number;
  username: string;
  role: string;
}

// Define the authentication context type
export interface AuthContextType {
  userId: number | null;
  username: string | null;
  role: string | null;
  login: (token: string) => void;
  logout: () => void;
}
