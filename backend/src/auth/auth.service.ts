import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    this.logger.debug(`Validating user with email: ${email}`);
    const user = await this.findUserByEmail(email);
    if (!user) {
      this.logger.debug(`User with email ${email} not found`);
      return null;
    }

    const passwordIsValid = await this.comparePassword(password, user.password);
    if (!passwordIsValid) {
      this.logger.debug(`Invalid password for user: ${email}`);
      return null;
    }

    this.logger.debug(`User ${email} validated successfully`);
    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    try {
      const users = await this.userService.findByEmail(email);
      return users ?? null;
    } catch (error) {
      this.logger.error(
        `Error finding user by email: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async login(user: User) {
    this.logger.debug(`Generating token for user: ${user.email}`);
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
