import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { LocalDoctorStrategy } from './localdoctor.strategy';
import { DoctorModule } from 'src/doctor/doctor.module';

@Module({
  providers: [AuthService, LocalStrategy, JwtStrategy, LocalDoctorStrategy],
  imports: [
    UsersModule,
    PassportModule,
    DoctorModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
