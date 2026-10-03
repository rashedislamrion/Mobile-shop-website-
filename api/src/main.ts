import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { PrismaClientExceptionFilter } from './common/filters/prisma-client-exception.filter';

async function bootstrap() {
  const isProduction = process.env.NODE_ENV === 'production';
  const jwtAccessSecret = process.env.JWT_ACCESS_SECRET;
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

  // SEC-001: Validate cryptographic secrets on bootstrap
  const validateJwtSecret = (name: string, secret?: string) => {
    const forbiddenDefaults = ['access-secret', 'refresh-secret', 'secret'];
    if (!secret || secret.length < 32 || forbiddenDefaults.includes(secret)) {
      if (isProduction) {
        throw new Error(
          `[FATAL] ${name} is missing, shorter than 32 characters, or using insecure default in production! Execution aborted.`,
        );
      } else {
        console.warn(
          `[SECURITY WARNING] ${name} is weak, missing, or using default ('${secret}'). Configure a 32+ char secret in .env before deploying!`,
        );
      }
    }
  };

  validateJwtSecret('JWT_ACCESS_SECRET', jwtAccessSecret);
  validateJwtSecret('JWT_REFRESH_SECRET', jwtRefreshSecret);

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable graceful shutdown
  app.enableShutdownHooks();

  // Trust reverse proxy (Nginx on VPS) for accurate IP resolution in rate limiting
  app.set('trust proxy', 1);

  app.setGlobalPrefix('api/v1');

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.use(compression());
  app.use(cookieParser());

  const uploadDir = process.env.UPLOAD_ROOT || join(process.cwd(), 'uploads');
  app.useStaticAssets(uploadDir, { prefix: '/uploads/' });

  // Parse comma-separated ALLOWED_ORIGINS from environment variable
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((o) => o.trim().replace(/\/$/, ''))
    .filter(Boolean);

  const frontendUrl = (process.env.FRONTEND_URL || '')
    .trim()
    .replace(/\/$/, '');

  // SEC-002: Hardened CORS configuration
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with NO Origin header (server-to-server, payment IPN callbacks, curl, health checks)
      if (!origin) {
        return callback(null, true);
      }

      // Allow local development (localhost and 127.0.0.1 on any port) in non-production
      if (
        !isProduction &&
        (/^https?:\/\/localhost(:\d+)?$/.test(origin) ||
          /^https?:\/\/127\.0\.0\.1(:\d+)?$/.test(origin))
      ) {
        return callback(null, true);
      }

      // Allow explicit origins in ALLOWED_ORIGINS
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow FRONTEND_URL if specified
      if (frontendUrl && origin === frontendUrl) {
        return callback(null, true);
      }

      // Disallowed origins return false (not thrown error)
      callback(null, false);
    },
    credentials: true,
  });

  // Global filters & validation
  app.useGlobalFilters(new PrismaClientExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
