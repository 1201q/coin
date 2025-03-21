import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../types/entities/user.entity";
import { Repository, DataSource } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Wallet } from "src/types/entities/wallet.entity";
import { INIT_WALLET_BALANCE } from "src/constants/constants";

@Injectable()
export class UserService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findUserByGoogleId(id: string) {
    const user = this.userRepository.findOne({
      where: { user_id: id },
      relations: ["wallet"],
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async findUserWallet(walletId: string) {
    const wallet = this.walletRepository.findOne({
      where: { wallet_id: walletId },
    });

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    return wallet;
  }

  async createGoogleUser(user: Partial<User>) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newWallet = new Wallet();
      newWallet.wallet_id = uuidv4();
      newWallet.balance = INIT_WALLET_BALANCE;
      newWallet.available_balance = INIT_WALLET_BALANCE;
      newWallet.locked_balance = 0;

      const savedWallet = await queryRunner.manager.save(newWallet);

      const newUser = new User();
      newUser.user_id = user.user_id;
      newUser.email = user.email;
      newUser.name = user.name;
      newUser.provider = user.provider;
      newUser.wallet = savedWallet;

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
