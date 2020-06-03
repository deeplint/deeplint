exports.list = async function (context) {
    res = [
        {
            name: "RecordServiceS3Bucket",
            type: "AWS::S3::Bucket",
            properties: {
                "VersioningConfiguration": {
                    "Status": "Disabled"
                }
            }
        }
    ]
    return res
}

