exports.handler = function (context) {
    return [{
        results: {
            "s3-versioning-check": {
                Passed: false,
                Message: "S3 bucket should enable versioning"
            }
        }
    }
    ]
}
