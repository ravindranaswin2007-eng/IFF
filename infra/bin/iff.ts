import * as cdk from 'aws-cdk-lib'
import { IffStack } from '../lib/iff-stack'

const app = new cdk.App()
const ctx = (key: string) => app.node.tryGetContext(key)

new IffStack(app, 'IndianFinancialForum', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: ctx('region') || process.env.CDK_DEFAULT_REGION || 'ap-south-1' },
  domainName: ctx('domainName') || undefined,
  certificateArn: ctx('certificateArn') || undefined,
  desiredCount: Number(ctx('desiredCount') ?? 1),
  dbInstanceClass: ctx('dbInstanceClass') || 't4g.micro',
  multiAz: ctx('multiAz') === true || ctx('multiAz') === 'true',
  description: 'Indian Financial Forum website and CMS (Next.js + Payload on ECS Fargate, RDS PostgreSQL, S3, CloudFront)',
})
