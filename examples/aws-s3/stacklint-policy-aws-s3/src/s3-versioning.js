exports.handler = function (context) {
    return [{
        "s3-versioning-check": {
            resource: "RecordServiceS3Bucket:",
            message: "S3 bucket should enable versioning"
        }
    }
    ]
}
