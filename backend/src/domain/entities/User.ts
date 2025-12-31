export class User {
  constructor(
    public readonly id: string | number,
    public readonly name: string,
    public readonly email: string,
    public readonly role: "user" | "admin"
  ) {}
}
