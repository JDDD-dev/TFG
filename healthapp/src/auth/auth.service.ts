import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DoctorService } from 'src/doctor/doctor.service';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { User } from 'src/users/entities/user.entity';

import { UsersService } from '../users/users.service';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly doctorsService: DoctorService,
  ) {}

  async validate(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  login(user: any) {
    console.log('login');
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async verify(token: string): Promise<User> {
    const decoded = this.jwtService.verify(token, {
      secret: jwtConstants.secret,
    });

    const user = await this.usersService.findOne(decoded.username);

    if (!user) {
      throw new Error('Unable to get the user from decoded token.');
    }

    return user;
  }

  loginDoctor(user: any) {
    console.log('loginDoctor');
    console.log(user);
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async verifyDoctor(token: string): Promise<Doctor> {
    const decoded = this.jwtService.verify(token, {
      secret: jwtConstants.secret,
    });

    const doctor = await this.doctorsService.findOne(decoded.username);

    if (!doctor) {
      throw new Error('Unable to get the user from decoded token.');
    }

    return doctor;
  }

  async validateDoctor(username: string, password: string): Promise<any> {
    const doctor = await this.doctorsService.findOne(username);

    console.log(doctor);
    if (doctor && doctor.password === password) {
      const { password, ...result } = doctor;
      return result;
    }
    return null;
  }
}
