export default function Hmac() {
    const crypto = require('crypto');
    const moment = require('moment');
    const https = require('https');

    // please don't store credentials directly in code
    const accessKey = process.env.COS_HMAC_ACCESS_KEY_ID;
    const secretKey = process.env.COS_HMAC_SECRET_ACCESS_KEY;

    const httpMethod = 'GET';
    const host = 's3-api.us-geo.objectstorage.softlayer.net';
    const region = 'us-standard';
    const endpoint = 'https://s3-api.us-geo.objectstorage.softlayer.net';
    const bucket = ''; // add a '/' before the bucket name to list buckets
    const objectKey = '';
    const requestParameters = '';

    // hashing and signing methods
    function hash(key, msg) {
        var hmac = crypto.createHmac('sha256', key);
        hmac.update(msg, 'utf8');
        return hmac.digest();
    }

    function hmacHex(key, msg) {
        var hmac = crypto.createHmac('sha256', key);
        hmac.update(msg, 'utf8');
        return hmac.digest('hex');
    }

    function hashHex(msg) {
        var hash = crypto.createHash('sha256');
        hash.update(msg);
        return hash.digest('hex');
    }

    // region is a wildcard value that takes the place of the AWS region value
    // as COS doesn't use the same conventions for regions, this parameter can accept any string
    function createSignatureKey(key, datestamp, region, service) {
        let keyDate = hash(('AWS4' + key), datestamp);
        let keyString = hash(keyDate, region);
        let keyService = hash(keyString, service);
        let keySigning = hash(keyService, 'aws4_request');
        return keySigning;
    }

    // assemble the standardized request
    var time = moment().utc();
    var timestamp = time.format('YYYYMMDDTHHmmss') + 'Z';
    var datestamp = time.format('YYYYMMDD');

    var standardizedResource = bucket + '/' + objectKey;
    var standardizedQuerystring = requestParameters;
    var standardizedHeaders = 'host:' + host + '\n' + 'x-amz-date:' + timestamp + '\n';
    var signedHeaders = 'host;x-amz-date';
    var payloadHash = hashHex('');

    var standardizedRequest = httpMethod + '\n' +
        standardizedResource + '\n' +
        standardizedQuerystring + '\n' +
        standardizedHeaders + '\n' +
        signedHeaders + '\n' +
        payloadHash;

    // assemble string-to-sign
    var hashingAlgorithm = 'AWS4-HMAC-SHA256';
    var credentialScope = datestamp + '/' + region + '/' + 's3' + '/' + 'aws4_request';
    var sts = hashingAlgorithm + '\n' +
        timestamp + '\n' +
        credentialScope + '\n' +
        hashHex(standardizedRequest);

    // generate the signature
    var signatureKey = createSignatureKey(secretKey, datestamp, region, 's3');
    var signature = hmacHex(signatureKey, sts);

    // assemble all elements into the 'authorization' header
    var v4authHeader = hashingAlgorithm + ' ' +
        'Credential=' + accessKey + '/' + credentialScope + ', ' +
        'SignedHeaders=' + signedHeaders + ', ' +
        'Signature=' + signature;

    // create and send the request
    var authHeaders = {'x-amz-date': timestamp, 'Authorization': v4authHeader}
    // the 'requests' package autmatically adds the required 'host' header
    console.log(authHeaders);
    var requestUrl = endpoint + standardizedResource + standardizedQuerystring

    console.log(`\nSending ${httpMethod} request to IBM COS -----------------------`);
    console.log('Request URL = ' + requestUrl);

    var options = {
        host: host,
        port: 443,
        path: standardizedResource + standardizedQuerystring,
        method: httpMethod,
        headers: authHeaders
    }

    var request = https.request(options, function (response) {
        console.log('\nResponse from IBM COS ----------------------------------');
        console.log(`Response code: ${response.statusCode}\n`);

        response.on('data', function (chunk) {
            console.log(chunk.toString());
        });
    });

    request.end();
}