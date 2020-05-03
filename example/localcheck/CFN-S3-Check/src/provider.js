exports.parser = async function (input) {
    res = {
        "Resources": {
            "RecordServiceS3Bucket": {
                "Type": "AWS::S3::Bucket",
                "Properties": {
                    "VersioningConfiguration": {
                        "Status": "Enabled"
                    }
                }
            }
        }
    }
    return res
}

