import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { Repository } from 'typeorm';
import { ModuleSummary } from '../../common/module-summary.interface';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import {
  AccessTokenPayload,
  AuthenticatedUser,
} from './interfaces/authenticated-user.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  getModuleSummary(): ModuleSummary {
    return {
      key: 'auth',
      route: '/auth',
      phase: 1,
      purpose: 'Controla autenticacion, sesion y permisos base para administradores y propietarios.',
      tables: ['users'],
    };
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();
    const user = await this.userRepository.findOne({
      where: { email },
      relations: {
        party: true,
      },
    });

    if (!user || !user.isActive || !user.passwordHash) {
      throw new UnauthorizedException('Las credenciales enviadas no son validas.');
    }

    const passwordIsValid = await compare(dto.password, user.passwordHash);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Las credenciales enviadas no son validas.');
    }

    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    return {
      accessToken: await this.signAccessToken(user),
      tokenType: 'Bearer',
      user: this.mapAuthenticatedUser(user),
    };
  }

  async getAuthenticatedUser(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId, isActive: true },
      relations: {
        party: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('El usuario autenticado ya no esta disponible.');
    }

    return this.mapAuthenticatedUser(user);
  }

  async authenticateAccessToken(token: string) {
    let payload: AccessTokenPayload;

    try {
      payload = await this.jwtService.verifyAsync<AccessTokenPayload>(token);
    } catch {
      throw new UnauthorizedException('El token de acceso no es valido o ya expiro.');
    }

    return this.getAuthenticatedUser(payload.sub);
  }

  // Signs the minimum payload needed to resolve the active user on every request.
  private async signAccessToken(user: User) {
    return this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    } satisfies AccessTokenPayload);
  }

  private mapAuthenticatedUser(user: User): AuthenticatedUser {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
      partyId: user.party?.id ?? null,
    };
  }
}
