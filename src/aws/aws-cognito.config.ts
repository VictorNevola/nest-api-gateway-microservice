import { Injectable } from "@nestjs/common";

@Injectable()
export class AwsCognitoConfig {
    public userPoolId: string = process.env.COGNITO_USER_POLL;
    public clientId: string = process.env.COGNITO_CLIENT_ID;
    public authority = `https://cognito-idp.sa-east-1.amazonaws.com/${this.userPoolId}`;
}