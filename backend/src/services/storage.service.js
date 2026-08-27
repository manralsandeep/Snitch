import ImageKit from '@imagekit/nodejs';
import { config } from "../config/config.js"
import { toFile } from '@imagekit/nodejs';
const client = new ImageKit({
    privateKey: config.IMAGEKIT_PRIVATE_KEY,
    publicKey: config.IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: config.IMAGEKIT_URL_ENDPOINT
});



export async function uploadFile({ buffer, fileName, folder = "snitch" }) {

    const result = await client.files.upload({
        file: await toFile(buffer, 'file'),
        fileName,
        folder
    });
    return result
}