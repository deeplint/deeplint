exports.check = async function (context) {
    const resources = context.getResources()
    let problems = []
    const _ = require('lodash')
    for (const key of Object.keys(resources)) {
        for (const resource of resources[key]) {
            if (resource.type === 'aws::s3::bucket') {
                let isPublic = false;
                if (_.has(resource.properties, 'BucketACLs.Grants')) {
                    for (const rule of resource.properties.BucketACLs.Grants) {
                        if (rule.Grantee.URI === "http://acs.amazonaws.com/groups/global/AllUsers") {
                            if (rule.Permission === 'READ' || rule.Permission === 'WRITE' || rule.Permission === 'FULL_CONTROL') {
                                isPublic = true;
                                break;
                            }
                        }
                    }
                }
                if (_.has(resource.properties, 'BucketPolicyStatus.PolicyStatus.IsPublic') && resource.properties.BucketPolicyStatus.PolicyStatus.IsPublic) {
                    isPublic = true;
                }
                if (isPublic) {
                    problems.push({
                        message: `AWS S3 Bucket: ${resource.name} is public`
                    })
                }
            }
        }
    }
    return problems
}
