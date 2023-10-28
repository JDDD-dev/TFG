import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth/auth.service';
import { Storage } from '@google-cloud/storage';
import { MedAppointmentService } from './med-appointment/med-appointment.service';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private medAppointmentService: MedAppointmentService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req: any) {
    console.log('login attemp');
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('doctor'))
  @Post('auth/loginDoctor')
  async loginDoctor(@Request() req: any) {
    console.log('login attemp Doctor');
    console.log(req.user);
    console.log('login attemp Doctor');
    return this.authService.loginDoctor(req.user);
  }

  @Get()
  async testEndpoint() {
    return 'Respuesta de ejemplo';
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'uploads/',
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    const storage = new Storage();
    const bucketName = 'healthappjd';
    const data = await storage.bucket(bucketName).upload(file.path);
    return JSON.stringify(data[0].metadata.mediaLink);
  }
}
