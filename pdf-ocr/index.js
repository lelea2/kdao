require('dotenv').config();
const fetcher = require('node-fetch');
const fs = require('fs');

fetcher('https://prosoft-transact-qa.s3.amazonaws.com/fab917bd-f4d8-4252-8fd0-c21d46098ed2_WidgetissuesMissingWidget.pdf?AWSAccessKeyId=ASIAIGG2OJ5AZTR7GTCA&Expires=1519249281&Signature=AJSJ6oEb2FA8xV7G0SA44X8lpJo%3D&x-amz-security-token=FQoDYXdzEDYaDDrdADEGTgF4H0D5jCK3A7xhGK50KcHSc%2F2xOWR4%2Bj7G2JmR04JvLTPUxeObRxLCljs0MVayvVqLrVgsgaMA1VfA6f3I95JE0zLNJcW1PLiTeJXVl2GDewV2jp%2FkfH8GxzJfuBOo%2Bw2Mf2G9m4V95R%2FNGo6BdS9LgaTcTUCkkak3NFyYhGvVtStzWJy5ZuAWmZFtYaXF%2FSvJRnsn1FrhqyjAEjgoHyx4cPoKSYWy3JBtwsmS%2B0G3tyLae1XmG7ycth%2BzTlDai7wGFM6biizn7CULoKu7csuoOcOCdtfuM1K0XGAb0VubvLzUFIcJt57jNXYsjA9DgsUAT3MZRRY4dEbxpwsGBCQUxlMBqHJSLbvKR6SRFwOehH07%2By5xVMGj0NW4Zpd6hP%2BKGK6RWexAxbo%2BMbMBC9g6ar1j4F%2Fbst9pKVJSG%2BVpSdaieQHk3xUHhCkDLOwCMqcNS9AokgpGa2XbZodt3zT93Kfgs2iL25P8xEpkZzRCAvBKKObkUmdkQARg8d%2FqzZu8gg01Ke%2BGu0%2Bt3een4H66xZxx4SWzF0u7z766dk4MMi05kO1bERHTWxR2JWOXV8mRXlQI537b%2B8uW4XWD%2F5go3b631AU%3D')
.then((res) => {
  // const dest = fs.createWriteStream('./octocat.png');
  console.log(res);
});