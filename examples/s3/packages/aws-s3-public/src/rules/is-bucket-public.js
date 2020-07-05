exports.check = async function (context) {
    const resources = context.getResources()
    let problems = []
    for (const key of Object.keys(resources)) {
        for (const resource of resources[key]) {
            if(resource.type === 'aws::s3::bucket') {
                if(resource.properties.BucketEncryption && Object.keys(resource.properties.BucketEncryption).length === 0) {
                    problems.push({
                        message: `AWS S3 Bucket: ${resource.name} does not enable server-side encryption`
                    })
                }
            }
        }
    }
    return problems
}
