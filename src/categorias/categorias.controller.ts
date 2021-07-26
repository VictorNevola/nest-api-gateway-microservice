import { Body, Controller, Get, Logger, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria-dto';
import { CriarCategoriaDto } from './dtos/criar-categoria-dto';

@Controller('categorias')
export class CategoriasController {

    private logger = new Logger(CategoriasController.name);

    constructor (
        private clientProxySmartRankig: ClientProxySmartRanking
    ){}

    private clientAdminBackEnd = this.clientProxySmartRankig.getClientProxyAdminBackendInstance();

    @Post('')
    @UsePipes(ValidationPipe)
    criarCategoria(
      @Body() criarCategoriaDto: CriarCategoriaDto
    ) {
      this.clientAdminBackEnd.emit('criar-categoria', criarCategoriaDto);
    }
  
    @Get('')
    consultarCategorias(
      @Query('idCategoria') _id: string
    ): Observable<any> {
      return this.clientAdminBackEnd.send('consultar-categorias', _id ? _id : '')
    }
  
    @Put('/categorias/:idCategoria')
    @UsePipes(ValidationPipe)
    async atualizarCategoria(
      @Body() atualizarCategoriaDto: AtualizarCategoriaDto,
      @Param('idCategoria') _id: string,
    ) {
      this.clientAdminBackEnd.emit('atualizar-categoria', { idCategoria: _id, categoriaAtualizada: atualizarCategoriaDto })
    }

}
