exports.schema = {}
exports.list = async function (context) {
    res = [
        {
            key: {
                "name": "RecordServiceS3Bucket",
                "type": "AWS::S3::Bucket",
            },
            properties: {
                "VersioningConfiguration": {
                    "Status": "Disabled"
                }
            }
        }
    ]
    return res
}

