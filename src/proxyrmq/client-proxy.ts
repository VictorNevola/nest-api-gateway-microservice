import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class ClientProxySmartRanking {

    getClientProxyAdminBackendInstance(): ClientProxy {
        return ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: [`amqp://user:${process.env.USERRABBIT}@${process.env.SERVERAWSEC2}/smartranking`],
                queue: 'admin-backend'
            }
        })
    }

}