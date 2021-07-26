import { Module } from '@nestjs/common';
import { JogadoresController } from './jogadores.controller';
import { ProxyrmqModule } from '../proxyrmq/proxyrmq.module'

@Module({
  imports: [ProxyrmqModule],  
  controllers: [JogadoresController]
})
export class JogadoresModule {}
