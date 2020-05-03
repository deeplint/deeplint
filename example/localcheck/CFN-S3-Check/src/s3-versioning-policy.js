exports.policy = async function(resources) {

    return {
        Checks: {
            "s3-versioning-check" : {
                Resource: "RecordServiceS3Bucket",
                Result: "Failed",
                Level: "Warning",
                Message: "S3 bucket should enable versioning"
            }
        }
    }
}
