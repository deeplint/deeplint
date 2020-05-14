exports.handler = async function (context) {
    res = [
        {
            "RecordServiceS3Bucket": {
                "type": "AWS::S3::Bucket",
                "properties": {
                    "VersioningConfiguration": {
                        "Status": "Enabled"
                    }
                }
            }
        }
    ]
    return res
}

