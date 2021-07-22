import { Body, Controller, Get, Logger, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AppService } from './app.service';
import { CriarCategoriaDto } from './dtos/criar-categoria-dto';

@Controller('api/v1')
export class AppController {

  private logger = new Logger(AppController.name);

  private clientAdminBackEnd: ClientProxy;

  constructor() {
    this.clientAdminBackEnd = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://user:${process.env.USERRABBIT}@${process.env.SERVERAWSEC2}/smartranking`],
        queue: 'admin-backend'
      }
    })
  }

  @Post('categorias')
  @UsePipes(ValidationPipe)
  criarCategoria(
    @Body() criarCategoriaDto: CriarCategoriaDto
  ){
    return this.clientAdminBackEnd.emit('criar-categoria', criarCategoriaDto);
  }

}
