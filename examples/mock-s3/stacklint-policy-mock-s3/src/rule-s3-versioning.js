exports.check = function (context) {
    let results = []
    const resources = context.getResources()

        console.log(resources)

    return [{
        "s3-versioning-check": {
            resource: "RecordServiceS3Bucket:",
            message: "S3 bucket should enable versioning"
        }
    }
    ]
}
