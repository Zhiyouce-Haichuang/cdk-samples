import cdk = require('@aws-cdk/core');
import lambda = require('@aws-cdk/aws-lambda');
import path = require('path');
import apigateway = require('@aws-cdk/aws-apigateway');
import { Vpc, SubnetType } from '@aws-cdk/aws-ec2';
import { Ec2HealthCheckOptions } from '@aws-cdk/aws-autoscaling';


export interface LambdaRestApiProps extends cdk.StackProps {
  vpc?: Vpc,
}


export class LambdaRestApi extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: LambdaRestApiProps) {
    super(scope, id, props);

    // const vpc = Vpc.fromLookup(this, 'VPC', {
    //   isDefault: true
    // })

    /**
     * Running Lambda in Python and enable the VPC support
     */
    // const handler = new lambda.Function(this, 'FuncPython', {
    //   code: lambda.Code.fromAsset(path.join(__dirname, '../function/hello-world')),
    //   handler: 'lambda_function.handler',
    //   runtime: lambda.Runtime.PYTHON_3_7,
    //   tracing: lambda.Tracing.ACTIVE,
    //   memorySize: 512,
    //   vpc,
    //   vpcSubnets: {
    //     subnetType: SubnetType.PRIVATE
    //   }
    // })

    // const api = new apigateway.LambdaRestApi(this, 'PythonRestApi', {
    //   handler
    // })


    const fn = new lambda.Function(this, 'FuncNode', {
      code: new lambda.InlineCode(`exports.handler = (event, context, callback) =>
      callback(null, {
        statusCode: '200',
        body: JSON.stringify(event),
        headers: {
          'Content-Type': 'application/json',
        },
      });`),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_8_10,
    });

    new apigateway.LambdaRestApi(this, 'ApigatewayLambdaRestAPI', {
      handler: fn,
      // please note in China region there's only API Gateway regional endpoint
      endpointTypes: [apigateway.EndpointType.REGIONAL]
    });
  }
}

