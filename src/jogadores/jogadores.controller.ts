import { Controller, Get, Logger, Post, UsePipes, ValidationPipe, Body, Query, Put, Param, BadRequestException, Delete, UseInterceptors, UploadedFile, UseGuards, Req } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto'
import { Observable } from 'rxjs';
import { ClientProxySmartRanking } from '../proxyrmq/client-proxy'
import { ValidacaoParametrosPipe } from '../common/pipes/validacao-parametros.pipe'
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from 'src/aws/aws.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('api/v1/jogadores')
export class JogadoresController {

  private logger = new Logger(JogadoresController.name)

  constructor(
    private clientProxySmartRanking: ClientProxySmartRanking,
    private awsService: AwsService
  ) { }

  private clientAdminBackend = this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  @Post()
  @UsePipes(ValidationPipe)
  async criarJogador(
    @Body() criarJogadorDto: CriarJogadorDto) {

    this.logger.log(`criarJogadorDto: ${JSON.stringify(criarJogadorDto)}`)

    const categoria = this.clientAdminBackend.send('consultar-categorias',
      criarJogadorDto.categoria)

    if (categoria) {
      this.clientAdminBackend.emit('criar-jogador', criarJogadorDto)
    } else {
      throw new BadRequestException(`Categoria não cadastrada!`)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  consultarJogadores(
    @Req() req: Request,
    @Query('idJogador') _id: string
  ): Observable<any> {
    return this.clientAdminBackend.send('consultar-jogadores', _id ? _id : '')
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async atualizarJogador(
    @Body() atualizarJogadorDto: AtualizarJogadorDto,
    @Param('_id', ValidacaoParametrosPipe) _id: string) {

    const categoria = this.clientAdminBackend.send('consultar-categorias',
      atualizarJogadorDto.categoria)
    if (categoria) {
      this.clientAdminBackend.emit('atualizar-jogador', { id: _id, jogador: atualizarJogadorDto })
    } else {
      throw new BadRequestException(`Categoria não cadastrada!`)
    }
  }

  @Delete('/:_id')
  async deletarJogador(
    @Param('_id', ValidacaoParametrosPipe) _id: string) {
    this.clientAdminBackend.emit('deletar-jogador', { _id })
  }

  @Post('/:_id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadArquivo(
    @UploadedFile() file,
    @Param('_id') _id: string
  ) {
    const jogador = this.clientAdminBackend.send('consultar-jogadores', _id);

    if (!jogador) {
      throw new BadRequestException(`Jogador não encontrado!`);
    }

    const { url } = await this.awsService.uploadArquivo(file, _id);

    const atualizarJogadorDto: AtualizarJogadorDto = {
      urlFotoJogador: url
    }

    await this.clientAdminBackend.emit('atualizar-jogador', { id: _id, jogador: atualizarJogadorDto });

    return this.clientAdminBackend.send('consultar-jogadores', _id);

  }

}