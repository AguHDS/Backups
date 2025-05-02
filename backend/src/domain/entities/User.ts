export class User {
  constructor(
    public readonly name: string,
    public readonly role: "user" | "admin",
    public readonly id: number,
    private hashedPassword: string
  ) {}

  async isPasswordValid(plainPassword: string, compareFn: (a: string, b: string) => Promise<boolean>): Promise<boolean> {
    return await compareFn(plainPassword, this.hashedPassword);
  }
}