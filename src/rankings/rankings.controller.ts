import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';

@Controller('api/v1/rankings')
export class RankingsController {

    constructor(
        private clientProxySmartyRanking: ClientProxySmartRanking
    ) { }

    private clientRankingsBackEnd = this.clientProxySmartyRanking.getClientProxyRankingsInstance();

    @Get()
    consultaRankings(
        @Query('idCategoria') idCategoria: string,
        @Query('dataRef') dataRef: string
    ): Observable<any> {

        if (!idCategoria) throw new BadRequestException('O id da categoria é obrigatório')

        return this.clientRankingsBackEnd.send('consultar-rankings', { idCategoria, dataRef: dataRef ? dataRef : '' });
    }
}
