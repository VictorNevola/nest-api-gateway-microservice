import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AwsCognitoService } from 'src/aws/aws-cognito.service';
import { AuthLoginUsuarioDto } from './dtos/auth-login-usuario.dto';
import { AuthRegistroUsuarioDto } from './dtos/auth-registro-usuario';

@Controller('api/v1/auth')
export class AuthController {

    constructor(
        private awsCognitoService: AwsCognitoService
    ){}

    @Post('/registro')
    @UsePipes(ValidationPipe)
    async registro(
        @Body() authRegistro: AuthRegistroUsuarioDto
    ){
        return await this.awsCognitoService.registrarUsuario(authRegistro);
    }

    @Post('/login')
    @UsePipes(ValidationPipe)
    async login(
        @Body() authLogin: AuthLoginUsuarioDto
    ){
        return await this.awsCognitoService.autenticarUsuario(authLogin);
    }
}
