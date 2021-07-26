import { Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class AwsService {

    private logger = new Logger(AwsService.name)

    public async uploadArquivo(file: any, id: string) {
        const s3 = new AWS.S3({
            region: 'sa-east-1',
            accessKeyId: process.env.S3ACCESSKEYID,
            secretAccessKey: process.env.S3SECRETACCESSKEY
        });

        const fileExtension = file.originalname.split('.')[1];
        const urlKey = `${id}.${fileExtension}`;

        const params = {
            ACL: 'public-read',
            Body: file.buffer,
            Bucket: 'smartranking-student',
            Key: urlKey
        };

        await s3.putObject(params).promise().then(data => data);

        return { url: `https://smartranking-student.s3.sa-east-1.amazonaws.com/${urlKey}` };

    }
}
