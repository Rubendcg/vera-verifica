import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { hashSync } from 'bcryptjs';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { User } from '../src/modules/users/entities/user.entity';
import { AuthController } from '../src/modules/auth/auth.controller';
import { AuthService } from '../src/modules/auth/auth.service';
import { JwtAuthGuard } from '../src/modules/auth/guards/jwt-auth.guard';

describe('Auth endpoints (e2e)', () => {
  let app: INestApplication;

  const users: User[] = [
    {
      id: '1',
      email: 'admin@vera.local',
      passwordHash: hashSync('Secret123!', 10),
      fullName: 'Admin Vera',
      isAdmin: true,
      isActive: true,
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      party: null,
      vehicleAccesses: [],
      grantedVehicleAccesses: [],
      ownerVerificationResponses: [],
      adminVerificationUpdates: [],
      verificationObligationHistoryEntries: [],
      uploadedDocuments: [],
      uploadedDocumentFiles: [],
    } as User,
  ];

  const userRepository = {
    findOne: jest.fn(async (options: { where?: { email?: string; id?: string; isActive?: boolean } }) => {
      const email = options.where?.email;
      const id = options.where?.id;
      const isActive = options.where?.isActive;

      return (
        users.find((user) => {
          if (email && user.email !== email) {
            return false;
          }

          if (id && user.id !== id) {
            return false;
          }

          if (isActive !== undefined && user.isActive !== isActive) {
            return false;
          }

          return true;
        }) ?? null
      );
    }),
    save: jest.fn(async (user: User) => user),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtAuthGuard,
        {
          provide: getRepositoryToken(User),
          useValue: userRepository,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /auth/login returns a bearer token for valid credentials', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@vera.local',
        password: 'Secret123!',
      })
      .expect(201);

    expect(response.body.tokenType).toBe('Bearer');
    expect(response.body.accessToken).toEqual(expect.any(String));
    expect(response.body.user).toMatchObject({
      id: '1',
      email: 'admin@vera.local',
      isAdmin: true,
    });
    expect(userRepository.save).toHaveBeenCalled();
  });

  it('GET /auth/me returns the authenticated user', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@vera.local',
        password: 'Secret123!',
      })
      .expect(201);

    const meResponse = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
      .expect(200);

    expect(meResponse.body).toMatchObject({
      id: '1',
      email: 'admin@vera.local',
      isAdmin: true,
    });
  });

  it('POST /auth/login rejects invalid credentials', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@vera.local',
        password: 'Wrong123!',
      })
      .expect(401);
  });
});
