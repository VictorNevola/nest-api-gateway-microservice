import { Injectable } from "@nestjs/common";
import { AuthRegistroUsuarioDto } from "src/auth/dtos/auth-registro-usuario";
import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { AwsCognitoConfig } from "./aws-cognito.config";
import { AuthLoginUsuarioDto } from "src/auth/dtos/auth-login-usuario.dto";

@Injectable()
export class AwsCognitoService {

    private userPool: CognitoUserPool

    constructor(
        private authConfig: AwsCognitoConfig
    ) {
        this.userPool = new CognitoUserPool({
            UserPoolId: this.authConfig.userPoolId,
            ClientId: this.authConfig.clientId
        })
    }

    async registrarUsuario(usuario: AuthRegistroUsuarioDto) {
        const { nome, email, senha, telefoneCelular } = usuario;

        return new Promise((resolve, reject) => {
            this.userPool.signUp(
                email,
                senha,
                [
                    new CognitoUserAttribute({
                        Name: 'phone_number',
                        Value: telefoneCelular
                    }),
                    new CognitoUserAttribute({
                        Name: 'name',
                        Value: nome
                    })
                ],
                null,
                (err, result) => {

                    if (!result) return reject(err)

                    return resolve(result.user)
                }
            )
        });

    }

    async autenticarUsuario(usuarioLogin: AuthLoginUsuarioDto){
        const { email, senha } = usuarioLogin;

        const userData = {
            Username: email,
            Pool: this.userPool
        }

        const authenticateDetails = new AuthenticationDetails({
            Username: email,
            Password: senha
        })

        const userCognito = new CognitoUser(userData);

        return new Promise((resolve, reject) => {
            userCognito.authenticateUser(authenticateDetails, {
                onSuccess: (result) => {
                    resolve(result)
                },

                onFailure: (err) => {
                    reject(err)
                }
            })

        })

    }
}