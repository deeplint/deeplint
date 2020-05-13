exports.handler = async function (context) {
    res = [
        {
            "RecordServiceS3Bucket": {
                "Type": "AWS::S3::Bucket",
                "Properties": {
                    "VersioningConfiguration": {
                        "Status": "Enabled"
                    }
                }
            }
        }
    ]
    return res
}

