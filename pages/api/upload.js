import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import multiparty from "multiparty";
import fs from "fs";
import mime from "mime-types";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";

const bucketName = "ecommerce-admin-ak";

export default async function handle(req, res) {
    await mongooseConnect();
    await isAdminRequest(req, res);
    const form = new multiparty.Form();
    // form.parse(req, (err, fields, files) => {
    //     console.log(files.length);
    //     res.json("ok");
    // });
    const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            resolve({ fields, files });
        });
    });
    console.log("Length: ", files.file.length);

    const client = new S3Client({
        region: "ap-south-1",
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    });
    // grab all the links

    const links = [];

    for (const file of files.file) {
        const ext = file.originalFilename.split(".").pop();
        const newFilename = Date.now() + "." + ext;

        console.log({ ext, file });

        await client.send(
            new PutObjectCommand({
                Bucket: bucketName,
                Key: newFilename,
                Body: fs.readFileSync(file.path),
                ACL: "public-read",
                ContentType: mime.lookup(file.path),
            })
        );

        const link = `https://${bucketName}.s3.ap-south-1.amazonaws.com/${newFilename}`;
        links.push(link);
    }

    // console.log(fields);

    return res.json({ links });
}

export const config = {
    api: {
        bodyParser: false,
    },
};
