import * as path from 'node:path'
import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import { Platform } from 'aws-cdk-lib/aws-ecr-assets'
import * as ecs from 'aws-cdk-lib/aws-ecs'
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns'
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2'
import * as logs from 'aws-cdk-lib/aws-logs'
import * as rds from 'aws-cdk-lib/aws-rds'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager'

export interface IffStackProps extends cdk.StackProps {
  /** e.g. www.indianfinancialforum.org — optional. Without it the site is served on the CloudFront *.cloudfront.net URL. */
  domainName?: string
  /** ACM certificate for domainName. Must be in us-east-1 (a CloudFront requirement). */
  certificateArn?: string
  desiredCount: number
  dbInstanceClass: string
  multiAz: boolean
}

/**
 * Visitors ─HTTPS─▶ CloudFront ─▶ Application Load Balancer ─▶ ECS Fargate (Next.js + Payload CMS)
 *                                                              ├─▶ RDS PostgreSQL (enquiries, content, users)
 *                                                              └─▶ S3 (photos, reports, résumés — private)
 */
export class IffStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: IffStackProps) {
    super(scope, id, props)

    // Public subnets for the load balancer and containers, isolated subnets for the database.
    // No NAT gateway: containers get public IPs (inbound is still locked to the load balancer), which saves ~US$35/month.
    const vpc = new ec2.Vpc(this, 'Vpc', {
      maxAzs: 2,
      natGateways: 0,
      subnetConfiguration: [
        { name: 'public', subnetType: ec2.SubnetType.PUBLIC, cidrMask: 24 },
        { name: 'database', subnetType: ec2.SubnetType.PRIVATE_ISOLATED, cidrMask: 24 },
      ],
      gatewayEndpoints: { S3: { service: ec2.GatewayVpcEndpointAwsService.S3 } },
    })

    const bucket = new s3.Bucket(this, 'Uploads', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: true,
      lifecycleRules: [{ noncurrentVersionExpiration: cdk.Duration.days(90) }],
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    })

    const dbSecurityGroup = new ec2.SecurityGroup(this, 'DbSg', { vpc, description: 'PostgreSQL - reachable only from the web containers' })
    const db = new rds.DatabaseInstance(this, 'Database', {
      engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_16 }),
      instanceType: new ec2.InstanceType(props.dbInstanceClass),
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      securityGroups: [dbSecurityGroup],
      credentials: rds.Credentials.fromGeneratedSecret('iff_admin'),
      databaseName: 'iff',
      allocatedStorage: 20,
      maxAllocatedStorage: 100,
      storageType: rds.StorageType.GP3,
      storageEncrypted: true,
      multiAz: props.multiAz,
      backupRetention: cdk.Duration.days(7),
      deletionProtection: true,
      removalPolicy: cdk.RemovalPolicy.SNAPSHOT,
      autoMinorVersionUpgrade: true,
    })

    const payloadSecret = new secretsmanager.Secret(this, 'PayloadSecret', {
      description: 'Signs IFF admin sessions',
      generateSecretString: { passwordLength: 48, excludePunctuation: true },
    })
    // Shared secret CloudFront sends to the load balancer, so the site can't be reached around CloudFront.
    const originVerify = new secretsmanager.Secret(this, 'OriginVerify', { generateSecretString: { passwordLength: 32, excludePunctuation: true } })

    const siteUrl = props.domainName ? `https://${props.domainName}` : undefined

    const cluster = new ecs.Cluster(this, 'Cluster', { vpc, containerInsightsV2: ecs.ContainerInsights.ENABLED })
    const logGroup = new logs.LogGroup(this, 'Logs', { retention: logs.RetentionDays.ONE_MONTH, removalPolicy: cdk.RemovalPolicy.DESTROY })

    const web = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'Web', {
      cluster,
      desiredCount: props.desiredCount,
      cpu: 512,
      memoryLimitMiB: 1024,
      runtimePlatform: { cpuArchitecture: ecs.CpuArchitecture.X86_64, operatingSystemFamily: ecs.OperatingSystemFamily.LINUX },
      assignPublicIp: true,
      taskSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      publicLoadBalancer: true,
      circuitBreaker: { rollback: true },
      healthCheckGracePeriod: cdk.Duration.seconds(120),
      minHealthyPercent: 100,
      taskImageOptions: {
        image: ecs.ContainerImage.fromAsset(path.join(__dirname, '..', '..'), { platform: Platform.LINUX_AMD64 }),
        containerPort: 3000,
        logDriver: ecs.LogDrivers.awsLogs({ streamPrefix: 'web', logGroup }),
        environment: {
          NODE_ENV: 'production',
          S3_BUCKET: bucket.bucketName,
          S3_REGION: this.region,
          DB_HOST: db.dbInstanceEndpointAddress,
          DB_PORT: db.dbInstanceEndpointPort,
          DB_NAME: 'iff',
          DATABASE_SSL: 'true',
          ...(siteUrl ? { SERVER_URL: siteUrl } : {}),
        },
        secrets: {
          DB_USER: ecs.Secret.fromSecretsManager(db.secret!, 'username'),
          DB_PASSWORD: ecs.Secret.fromSecretsManager(db.secret!, 'password'),
          PAYLOAD_SECRET: ecs.Secret.fromSecretsManager(payloadSecret),
        },
      },
    })

    web.targetGroup.configureHealthCheck({ path: '/healthz', healthyHttpCodes: '200', interval: cdk.Duration.seconds(20) })
    web.targetGroup.setAttribute('deregistration_delay.timeout_seconds', '20')
    bucket.grantReadWrite(web.taskDefinition.taskRole)
    bucket.grantDelete(web.taskDefinition.taskRole)
    db.connections.allowDefaultPortFrom(web.service, 'Web containers')

    const scaling = web.service.autoScaleTaskCount({ minCapacity: props.desiredCount, maxCapacity: Math.max(4, props.desiredCount) })
    scaling.scaleOnCpuUtilization('Cpu', { targetUtilizationPercent: 60 })

    // Only requests that carry CloudFront's secret header are forwarded; everything else gets 403.
    const cfnListener = web.listener.node.defaultChild as elbv2.CfnListener
    cfnListener.defaultActions = [{ type: 'fixed-response', fixedResponseConfig: { statusCode: '403', contentType: 'text/plain', messageBody: 'Forbidden' } }]
    web.listener.addAction('FromCloudFront', {
      priority: 1,
      conditions: [elbv2.ListenerCondition.httpHeader('X-Origin-Verify', [originVerify.secretValue.unsafeUnwrap()])],
      action: elbv2.ListenerAction.forward([web.targetGroup]),
    })

    // Next.js server actions check that Origin matches the forwarded host, so pass the viewer's Host along.
    const forwardHost = new cloudfront.Function(this, 'ForwardHost', {
      runtime: cloudfront.FunctionRuntime.JS_2_0,
      code: cloudfront.FunctionCode.fromInline(`function handler(event) {
  var r = event.request;
  r.headers['x-forwarded-host'] = { value: r.headers.host.value };
  r.headers['x-forwarded-proto'] = { value: 'https' };
  return r;
}`),
    })

    const albOrigin = new origins.LoadBalancerV2Origin(web.loadBalancer, {
      protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
      customHeaders: { 'X-Origin-Verify': originVerify.secretValue.unsafeUnwrap() },
      readTimeout: cdk.Duration.seconds(60),
    })

    const distribution = new cloudfront.Distribution(this, 'Cdn', {
      comment: 'Indian Financial Forum',
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_200, // includes India edge locations
      ...(props.domainName && props.certificateArn
        ? { domainNames: [props.domainName], certificate: acm.Certificate.fromCertificateArn(this, 'Cert', props.certificateArn) }
        : {}),
      defaultBehavior: {
        origin: albOrigin,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
        functionAssociations: [{ function: forwardHost, eventType: cloudfront.FunctionEventType.VIEWER_REQUEST }],
        compress: true,
      },
      additionalBehaviors: {
        '/_next/static/*': {
          origin: albOrigin,
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
          compress: true,
        },
      },
    })

    // Without a custom domain, the CloudFront URL is the site's public address.
    if (!siteUrl) web.taskDefinition.defaultContainer!.addEnvironment('SERVER_URL', `https://${distribution.distributionDomainName}`)

    new cdk.CfnOutput(this, 'SiteUrl', { value: siteUrl ?? `https://${distribution.distributionDomainName}` })
    new cdk.CfnOutput(this, 'AdminUrl', { value: `${siteUrl ?? `https://${distribution.distributionDomainName}`}/admin` })
    new cdk.CfnOutput(this, 'CloudFrontDomain', { value: distribution.distributionDomainName, description: 'Point your domain’s CNAME here' })
    new cdk.CfnOutput(this, 'UploadsBucket', { value: bucket.bucketName })
    new cdk.CfnOutput(this, 'DatabaseSecretArn', { value: db.secret!.secretArn })
    new cdk.CfnOutput(this, 'LogGroupName', { value: logGroup.logGroupName })
  }
}
