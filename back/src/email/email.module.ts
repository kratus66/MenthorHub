import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

@Module({
  providers: [EmailService],
  exports: [EmailService], // 👈 necesario para que otros módulos lo usen
})
export class EmailModule {}