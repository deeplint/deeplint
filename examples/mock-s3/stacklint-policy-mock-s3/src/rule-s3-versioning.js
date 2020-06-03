exports.check = async function (context) {
    const resources = context.getResources()

    const res = {
        passed: false,
        problem: {
            "resource":
                "RecordServiceS3Bucket",
            "message":
                "S3 bucket should enable versioning"
        }
    }
    return res
}
