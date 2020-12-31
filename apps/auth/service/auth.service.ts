import { UserRO } from "../../users/module/dto/user-response.ts";
import { UserAPI } from "../environmental.ts";

export class AuthService {
  async validateUser(email: string, password: string): Promise<UserRO> {
    const response = await fetch(`${UserAPI}/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json'
      },
    });
    const result = response.json();
    console.log('api call response', result);
    return result;
  }
}