import { Module } from '@nestjs/common';
import { InstagramService } from './instagram/instagram.service';
import { WhatsAppService } from './whatsapp/whatsapp.service';

@Module({
  imports: [],
  controllers: [],
  providers: [InstagramService, WhatsAppService],
  exports: [InstagramService, WhatsAppService],
})
export class PlatformModule {}
