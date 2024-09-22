import aws from "aws-sdk"

const region = "ap-south-1"
const bucketName ="beiyo-files"
const accessKeyId = ""
const secretAcessKey = ""

const s3 = new aws.S3({
    region,
    accessKeyId,
    secretAcessKey,
    signatureVersion:'4'
})