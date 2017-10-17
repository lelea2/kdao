// Note: use this file to test upload zipform
import * as config from 'config';
import * as fetch from 'node-fetch';
const zipFormURL = config.zipForm.URL;
const zipFormSharedKey = config.zipForm.SHARED_KEY;

import * as uuid from 'uuid';
const AWS = require('aws-sdk');
const fs = require('fs');
const s3 = new AWS.S3({
  params: { Bucket: config.S3Bucket }
});

export default class ZipFormHelper {

  public static async getZfxFormContent(transaction_id: string, vendor_form_id: string, zfx_form_version: string, context_id: string) {
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-ContextId': context_id,
      'X-Auth-SharedKey': zipFormSharedKey
     };
    // const response = await fetch(`${zipFormURL}/api/transactions/${transaction_id}/documents/${vendor_form_id}/${zfx_form_version}`, {
    //   method: 'GET',
    //   headers
    // });

    const response = await fetch(`https://h5.zipformonline.com/api/transactions/0f1ee286-e455-4e3b-8003-702aa25b925a/documents/B3466E24-24E0-4355-95FD-EB84E7AEBDE5/812.0`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-ContextId': '9b4b8ab6-2504-40b2-be22-afbf7f12ec54',
        'X-Auth-SharedKey': '36441E42-40E8-4A63-AC52-269765422884'
      }
    });
    const data = await response.buffer();
    if (data) {
      // const base64data = new Buffer(data, 'utf-8');
      const fileupload = await this.uploadFileToS3(data, 'khanh.test');
      console.log(fileupload);
      // console.log(data.body);
      return data;
    } else {
      const errMsg = `Error getting content for =${vendor_form_id}`;
      console.log(errMsg, data);
      throw new Error(errMsg);
    }
  }

   /**
   * Helper function upload file to s3
   * @param {any} bodyStream - binary64 for file
   * @param {string} filename
   * @method uploadFileToS3
   */
  public static async uploadFileToS3(bodyStream: any, filename: string) {
    console.log('upload to s3');
    const fileKey = `${uuid.v4()}_${filename}.pdf`;
    const response = await s3.upload({
      Key: fileKey.replace(/\s+/g, ''),
      Body: bodyStream,
      ACL: 'private'
    }).promise();
    return response;
  }
}

ZipFormHelper.getZfxFormContent('test', '1', '2', '3');
