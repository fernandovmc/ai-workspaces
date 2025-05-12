import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  Logger,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../users/user.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthenticatedRequest } from '../common/types/request.types';

@Controller()
export class AuthAliasController {
  private readonly logger = new Logger(AuthAliasController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    this.logger.debug(
      `Login attempt with email: ${loginDto.email} at /login endpoint`,
    );

    if (
      !loginDto ||
      typeof loginDto.email !== 'string' ||
      typeof loginDto.password !== 'string'
    ) {
      throw new BadRequestException('Invalid login data');
    }

    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    this.logger.debug(
      `Registration attempt with email: ${createUserDto.email} at /register endpoint`,
    );

    if (
      !createUserDto ||
      typeof createUserDto.email !== 'string' ||
      typeof createUserDto.password !== 'string'
    ) {
      this.logger.warn('Invalid registration data received');
      throw new BadRequestException('Invalid registration data');
    }

    try {
      const existingUser = await this.authService.findUserByEmail(
        createUserDto.email,
      );

      if (existingUser) {
        this.logger.warn(
          `Registration failed: User with email ${createUserDto.email} already exists`,
        );
        throw new BadRequestException('User with this email already exists');
      }

      // Hash the password before creating user
      const hashedPassword = await this.authService.hashPassword(
        createUserDto.password,
      );
      const secureUserDto = {
        ...createUserDto,
        password: hashedPassword,
      };

      // Create user with hashed password
      this.logger.debug(`Creating user with email: ${secureUserDto.email}`);
      const user = await this.userService.createUser(secureUserDto);

      if (!user || !user.id) {
        this.logger.error('User was not properly created in the database');
        throw new InternalServerErrorException('Failed to create user account');
      }

      this.logger.debug(`User created successfully with ID: ${user.id}`);

      const loginResult = await this.authService.login(user);
      this.logger.debug('JWT token generated successfully');

      return loginResult;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }

      this.logger.error(`Registration error: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        'An error occurred during registration',
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req: AuthenticatedRequest) {
    try {
      const userId = parseInt(req.user.sub);
      this.logger.debug(
        `Getting profile for user ID: ${userId} at /me endpoint`,
      );

      const user = await this.userService.findUserById(userId);

      if (!user) {
        this.logger.warn(`User with ID ${userId} not found in database`);
        throw new UnauthorizedException('User not found');
      }

      // Return user information without sensitive data
      return {
        id: user.id,
        email: user.email,
      };
    } catch (error) {
      this.logger.error(
        `Error retrieving user profile: ${error.message}`,
        error.stack,
      );

      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to retrieve user profile');
    }
  }
}
