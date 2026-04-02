import { ImageDAO } from "../interfaces/ImageDAO";
import {
    S3Client,
    PutObjectCommand,
    ObjectCannedACL
} from "@aws-sdk/client-s3";

export class DynamoImage implements ImageDAO {
    private bucket  = "hecktagons-tweeter-images";
    private region = "us-west-2";
    private client = new S3Client({ region: this.region });

    async putImage(
        fileName: string,
        imageStringBase64Encoded: string
    ): Promise<string> {
        let decodedImageBuffer: Buffer = Buffer.from(
            imageStringBase64Encoded,
            "base64"
        );
        const s3Params = {
            Bucket: this.bucket,
            Key: "image/" + fileName,
            Body: decodedImageBuffer,
            ContentType: "image/png",
            ACL: ObjectCannedACL.public_read,
        };
        const c = new PutObjectCommand(s3Params);
        try {
            await this.client.send(c);
            return (
                `https://${this.bucket}.s3.${this.region}.amazonaws.com/image/${fileName}`
            );
        } catch (error) {
            throw Error("s3 put image failed with: " + error);
        }
    }
}