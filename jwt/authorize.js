//Lambda function to generate
'use strict';

var jwt = require('jsonwebtoken');

exports.handler = function(event, context) {

  var token = event.authorizationToken;

  // expecting the secret key has been set as one of the Environment variables in lambda
  var secretKey=process.env.secret;

  var verify = 'unauthorized';
  try {
    var verfiedToken = jwt.verify(token, secretKey);
    if (verfiedToken.iss === 'RealSuite' && verfiedToken.exp) {
      verify = 'allow';
    } else {
      verfiy = 'deny';
    }
  } catch(err) {
      console.log(JSON.stringify(err));
  }

  // Call oauth provider, crack jwt token, etc.
  // In this example, the token is treated as the status for simplicity.
  //console.log(JSON.stringify(verfiedToken));
  switch (verify) {
    case 'allow':
      context.succeed(generatePolicy('user', 'Allow', event.methodArn));
      break;
    case 'deny':
      context.succeed(generatePolicy('user', 'Deny', event.methodArn));
      break;
    case 'unauthorized':
      context.fail('Unauthorized');
      break;
    default:
      context.fail('error');
  }
};

var generatePolicy = function(principalId, effect, resource) {
  var authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    var policyDocument = {};
    policyDocument.Version = '2012-10-17'; // default version
    policyDocument.Statement = [];
    var statementOne = {};
    statementOne.Action = 'execute-api:Invoke'; // default action
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
}
