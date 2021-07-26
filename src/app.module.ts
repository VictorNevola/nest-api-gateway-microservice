import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CategoriasModule } from './categorias/categorias.module';
import { ProxyrmqModule } from './proxyrmq/proxyrmq.module';
import { JogadoresModule } from './jogadores/jogadores.module';
import { AwsModule } from './aws/aws.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ProxyrmqModule,
    CategoriasModule,
    JogadoresModule,
    AwsModule
  ]
})
export class AppModule {}
