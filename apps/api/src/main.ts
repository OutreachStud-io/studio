import {isDebugMode} from "@/lib/util";
import session from 'express-session';
import {NestFactory} from '@nestjs/core';
import {AppModule} from '@/app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		bodyParser: false,
	});

	app.enableCors({
		origin     : (origin, callback) => {
			// Allow requests with no origin (mobile apps, etc.)
			if (!origin) return callback(null, true);
			// Allow all origins for REST API
			return callback(null, true);
		},
		credentials: true,
	});


	app.use(
		session({
			secret           : process.env.SESSION_SECRET!,
			resave           : false,
			saveUninitialized: true,
			cookie           : {
				// Configure secure cookies
				secure  : !isDebugMode(), // Temporarily hardcode for debugging
				sameSite: 'lax',
				httpOnly: true,
				maxAge  : 24 * 60 * 60 * 1000, // 24 hours
			},
		}),
	);

	await app.listen(process.env.PORT ?? 3002);
}

bootstrap();
