import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../types/entities/user.entity";
import { Repository, DataSource } from "typeorm";

@Injectable()
export class UserService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findUserByGoogleId(id: string) {
    return this.userRepository.findOne({ where: { user_id: id } });
  }

  async createGoogleUser(user: Partial<User>) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newUser = this.userRepository.create(user);
      const savedUser = await queryRunner.manager.save(newUser);

      await queryRunner.commitTransaction();
      return savedUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    const user = await this.userRepository.findOne({ where: { user_id: id } });
    if (!user) throw new Error("User not found");

    user.refresh_token = refreshToken;
    await this.userRepository.save(user);
  }

  async getRefreshToken(id: string) {
    const user = await this.userRepository.findOne({ where: { user_id: id } });
    return user.refresh_token || null;
  }

  async removeRefreshToken(refreshToken: string) {
    await this.userRepository.update(
      {
        refresh_token: refreshToken,
      },
      {
        refresh_token: null,
      },
    );
  }
}
