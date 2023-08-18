import { SESClient as _SESCLient, SendEmailCommand } from '@aws-sdk/client-ses';
import { consola } from 'consola';
import { env } from '@/server/env';

const SESClient = new _SESCLient({
  region: env.AWS_SES_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function sendSESEmail(params: { to: string; subject: string; html: string; text: string }) {
  try {
    const command = new SendEmailCommand({
      Source: env.AWS_SES_SOURCE_EMAIL || 'pro.tastia@gmail.com',
      Destination: { ToAddresses: [params.to] },
      Message: {
        Subject: { Data: params.subject },
        Body: {
          Html: { Data: params.html },
          Text: { Data: params.text },
        },
      },
    });

    const sesResponse = await SESClient.send(command);
    consola.info(
      `sendMail requestId: ${sesResponse.$metadata.requestId} and messageId: ${sesResponse.MessageId}`,
      'AWS::SES::SendEmail',
    );
    return sesResponse;
  } catch (err) {
    consola.error(err);
    throw new Error('Error sending email', { cause: err });
  }
}
