export interface User {
  id: number;
  username: string;
  password: string; // bcrypt hashed password will be stored here. hashing done by password service
}