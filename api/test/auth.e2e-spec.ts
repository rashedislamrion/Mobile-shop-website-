import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { AppModule } from './../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  let staffAccessToken = '';
  let staffRefreshToken = '';

  it('/api/v1/auth/staff/login (POST) - Valid login', () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth/staff/login')
      .send({ email: 'admin@mobilehubbd.test', password: 'Admin@12345' })
      .expect(201)
      .expect((res) => {
        expect(res.body.accessToken).toBeDefined();
        staffAccessToken = res.body.accessToken;

        // Find staff_refresh_token or refresh_token cookie
        const cookies: any = res.headers['set-cookie'];
        expect(cookies).toBeDefined();
        const cookieArr = Array.isArray(cookies) ? cookies : [cookies];
        const rtCookie = cookieArr.find(
          (c: string) =>
            c.startsWith('staff_refresh_token=') ||
            c.startsWith('refresh_token='),
        );
        expect(rtCookie).toBeDefined();
        staffRefreshToken = rtCookie
          .split(';')[0]
          .substring(rtCookie.indexOf('=') + 1);
      });
  });

  it('/api/v1/auth/me (GET) - Valid access token', () => {
    return request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${staffAccessToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.email).toBe('admin@mobilehubbd.test');
        expect(res.body.passwordHash).toBeUndefined();
      });
  });

  it('/api/v1/auth/staff/refresh (POST) - Refresh tokens', () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth/staff/refresh')
      .set('Cookie', `staff_refresh_token=${staffRefreshToken}`)
      .expect(201)
      .expect((res) => {
        expect(res.body.accessToken).toBeDefined();
      });
  });

  it('/api/v1/auth/staff/refresh (POST) - Invalid refresh token fails', () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth/staff/refresh')
      .set('Cookie', 'staff_refresh_token=invalid_token_xyz')
      .expect(401);
  });
});
