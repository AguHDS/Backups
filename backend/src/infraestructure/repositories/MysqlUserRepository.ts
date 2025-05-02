import { User } from "../../domain/entities/User.js";
import { UserRepository } from "../../domain/repositories/UserRepository.js";
import { getUserByName } from "../../db/queries/getUserByName.js";

export class MysqlUserRepository implements UserRepository {
  async findByUsername(username: string): Promise<User | null> {
    const row = await getUserByName(username);
    if (!row || row.length === 0) return null;

    return new User(row.namedb, row.role, row.id, row.passdb);
  }
}
