import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalDoctorStrategy extends PassportStrategy(Strategy, 'doctor') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    console.log(username, password);
    const doctor = await this.authService.validateDoctor(username, password);
    if (!doctor) {
      throw new UnauthorizedException();
    }
    return doctor;
  }
}
