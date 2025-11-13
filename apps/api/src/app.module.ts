import {z} from "zod";

import {Module} from '@nestjs/common';
import {REQUEST} from '@nestjs/core';
import {ConfigModule} from '@nestjs/config';
import {ValidationError} from '@orpc/server';
import {onError, ORPCError, ORPCModule} from '@orpc/nest';

import {AppController} from '@/app.controller';
import {AppService} from '@/app.service';
import {ProjectsModule} from '@/modules/projects/module';
import {CampaignsModule} from '@/modules/campaigns/module';
import {RepliesModule} from "@/modules/replies/module";
import {LeadsModule} from "@/modules/leads/module";

@Module({
	imports    : [
		ConfigModule.forRoot(),
		ProjectsModule,
		CampaignsModule,
		RepliesModule,
		LeadsModule,
		ORPCModule.forRootAsync({
			useFactory: (request: Request) => ({
				interceptors                  : [
					onError((error) => {
						if (
							error instanceof ORPCError
							&& error.code === 'BAD_REQUEST'
							&& error.cause instanceof ValidationError
						) {
							const zodError = new z.ZodError(error.cause.issues as z.core.$ZodIssue[]);

							throw new ORPCError('INPUT_VALIDATION_FAILED', {
								status : 422,
								message: z.prettifyError(zodError),
								data   : z.flattenError(zodError),
								cause  : error.cause,
							});
						}

						if (
							error instanceof ORPCError
							&& error.code === 'INTERNAL_SERVER_ERROR'
							&& error.cause instanceof ValidationError
						) {
							console.error(JSON.stringify(error.cause));
							throw new ORPCError('OUTPUT_VALIDATION_FAILED', {
								cause: error.cause,
							});
						}
					}),
				],
				context                       : {request},
				eventIteratorKeepAliveInterval: 5000,
			}),
			inject    : [REQUEST],

		}),
	],
	controllers: [AppController],
	providers  : [AppService],
})
export class AppModule {
}
