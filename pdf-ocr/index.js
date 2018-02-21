require('dotenv').config();
const request = require('request');
const fs = require('fs');
// const FormData = require('form-data');
// const formData = new FormData();

// const url = 'https://prosoft-transact-qa.s3.amazonaws.com/fab917bd-f4d8-4252-8fd0-c21d46098ed2_WidgetissuesMissingWidget.pdf?AWSAccessKeyId=ASIAIGG2OJ5AZTR7GTCA&Expires=1519250902&Signature=AfYDYpkra8nahywOCU9WWCNitGA%3D&x-amz-security-token=FQoDYXdzEDYaDDrdADEGTgF4H0D5jCK3A7xhGK50KcHSc%2F2xOWR4%2Bj7G2JmR04JvLTPUxeObRxLCljs0MVayvVqLrVgsgaMA1VfA6f3I95JE0zLNJcW1PLiTeJXVl2GDewV2jp%2FkfH8GxzJfuBOo%2Bw2Mf2G9m4V95R%2FNGo6BdS9LgaTcTUCkkak3NFyYhGvVtStzWJy5ZuAWmZFtYaXF%2FSvJRnsn1FrhqyjAEjgoHyx4cPoKSYWy3JBtwsmS%2B0G3tyLae1XmG7ycth%2BzTlDai7wGFM6biizn7CULoKu7csuoOcOCdtfuM1K0XGAb0VubvLzUFIcJt57jNXYsjA9DgsUAT3MZRRY4dEbxpwsGBCQUxlMBqHJSLbvKR6SRFwOehH07%2By5xVMGj0NW4Zpd6hP%2BKGK6RWexAxbo%2BMbMBC9g6ar1j4F%2Fbst9pKVJSG%2BVpSdaieQHk3xUHhCkDLOwCMqcNS9AokgpGa2XbZodt3zT93Kfgs2iL25P8xEpkZzRCAvBKKObkUmdkQARg8d%2FqzZu8gg01Ke%2BGu0%2Bt3een4H66xZxx4SWzF0u7z766dk4MMi05kO1bERHTWxR2JWOXV8mRXlQI537b%2B8uW4XWD%2F5go3b631AU%3D';

// formData.append('my_file', request(url));

// console.log(formData);

const formData = {
  file: [
    fs.createReadStream(__dirname + '/offers.pdf')
  ]
};

console.log(formData);

// request.post({url:'http://api.newocr.com/v1/upload?key=0b9ce68814269997ba6bdeefc829fd90', formData: formData}, (err, httpResponse, body) => {
//   console.log(httpResponse);
//   if (err) {
//     return console.error('upload failed:', err);
//   }
//   console.log('Upload successful!  Server responded with:', body);
// });

// id: 566e598b7dcfd53a20cae3240f5ebc77

// ocr

//GET /v1/ocr?key=api_key&file_id=12345&page=1&lang=eng&psm=3 HTTP/1.1

// request('http://api.newocr.com/v1/ocr?key=0b9ce68814269997ba6bdeefc829fd90&file_id=566e598b7dcfd53a20cae3240f5ebc77&page=1&lang=eng&psm=3', 
//   (error, response, body) => {
//     if (error) {
//       return console.error('upload failed:', error);
//     }
//     console.log(body);
//   });

// request.post({url:'http://api.newocr.com/v1/upload?key=0b9ce68814269997ba6bdeefc829fd90', formData: formData}, (err, httpResponse, body) => {
//   console.log(httpResponse);
//   if (err) {
//     return console.error('upload failed:', err);
//   }
//   console.log('Upload successful!  Server responded with:', body);
// });

//Upload successful!  Server responded with: {"status":"success","data":{"file_id":"eb40f02713842fa746b15e2e543f6b52","pages":10}}
//eb40f02713842fa746b15e2e543f6b52

request('http://api.newocr.com/v1/ocr?key=0b9ce68814269997ba6bdeefc829fd90&file_id=eb40f02713842fa746b15e2e543f6b52&page=2&lang=eng&psm=6', 
  (error, response, body) => {
    if (error) {
      return console.error('upload failed:', error);
    }
    console.log(body);
  });