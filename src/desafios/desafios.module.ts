import { Module } from '@nestjs/common';
import { DesafiosController } from './desafios.controller';
import { ProxyrmqModule } from '../proxyrmq/proxyrmq.module'

@Module({
  imports: [ProxyrmqModule],  
  controllers: [DesafiosController]
})
export class DesafiosModule {}
