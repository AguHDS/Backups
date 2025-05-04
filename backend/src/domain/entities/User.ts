export class User {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly email: string,
    private hashedPassword: string,
    public readonly role: "user" | "admin"
  ) {}

  async isPasswordValid(plainPassword: string, compareFn: (pass: string, hash: string) => Promise<boolean>): Promise<boolean> {
    return await compareFn(plainPassword, this.hashedPassword);
  }
}