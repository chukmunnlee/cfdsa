import {Controller, Get, HttpCode} from "@nestjs/common";
import {AuthResponse} from "src/models";

@Controller()
export class HealthController {

	@Get('/healthz')
	@HttpCode(200)
	healthz(): AuthResponse {
		return { timestamp: (new Date()).getTime() } as AuthResponse
	}
}
