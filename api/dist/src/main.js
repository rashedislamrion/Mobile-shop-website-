"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = require("path");
const prisma_client_exception_filter_1 = require("./common/filters/prisma-client-exception.filter");
async function bootstrap() {
    const isProduction = process.env.NODE_ENV === 'production';
    const jwtAccessSecret = process.env.JWT_ACCESS_SECRET;
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
    const validateJwtSecret = (name, secret) => {
        const forbiddenDefaults = ['access-secret', 'refresh-secret', 'secret'];
        if (!secret || secret.length < 32 || forbiddenDefaults.includes(secret)) {
            if (isProduction) {
                throw new Error(`[FATAL] ${name} is missing, shorter than 32 characters, or using insecure default in production! Execution aborted.`);
            }
            else {
                console.warn(`[SECURITY WARNING] ${name} is weak, missing, or using default ('${secret}'). Configure a 32+ char secret in .env before deploying!`);
            }
        }
    };
    validateJwtSecret('JWT_ACCESS_SECRET', jwtAccessSecret);
    validateJwtSecret('JWT_REFRESH_SECRET', jwtRefreshSecret);
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableShutdownHooks();
    app.set('trust proxy', 1);
    app.setGlobalPrefix('api/v1');
    app.use((0, helmet_1.default)({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
    }));
    app.use((0, compression_1.default)());
    app.use((0, cookie_parser_1.default)());
    const uploadDir = process.env.UPLOAD_ROOT || (0, path_1.join)(process.cwd(), 'uploads');
    app.useStaticAssets(uploadDir, { prefix: '/uploads/' });
    const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
        .split(',')
        .map((o) => o.trim().replace(/\/$/, ''))
        .filter(Boolean);
    const frontendUrl = (process.env.FRONTEND_URL || '')
        .trim()
        .replace(/\/$/, '');
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin) {
                return callback(null, true);
            }
            if (!isProduction &&
                (/^https?:\/\/localhost(:\d+)?$/.test(origin) ||
                    /^https?:\/\/127\.0\.0\.1(:\d+)?$/.test(origin))) {
                return callback(null, true);
            }
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            if (frontendUrl && origin === frontendUrl) {
                return callback(null, true);
            }
            callback(null, false);
        },
        credentials: true,
    });
    app.useGlobalFilters(new prisma_client_exception_filter_1.PrismaClientExceptionFilter());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    await app.listen(process.env.PORT || 4000);
}
bootstrap();
//# sourceMappingURL=main.js.map