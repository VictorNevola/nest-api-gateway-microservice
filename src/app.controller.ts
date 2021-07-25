import { Body, Controller, Get, Logger, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Observable } from 'rxjs';
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
    this.clientAdminBackEnd.emit('criar-categoria', criarCategoriaDto);
  }

  @Get('categorias')
  consultarCategorias(
    @Query('idCategoria') _id: string
  ): Observable<any>{
    return this.clientAdminBackEnd.send('consultar-categorias', _id ? _id : '')
  }

}
