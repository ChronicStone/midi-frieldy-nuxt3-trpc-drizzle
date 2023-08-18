import { z } from 'zod';
import { sendSESEmail } from './external/awsSES.service';
import { compileEmailTemplate } from '@/server/services/internal/mailerTemplate.service';
import { userInvitationEmailPayloadSchema } from '@/server/dto/system/mailer.dto';

export async function sendInvitationEmail(
  payload: z.infer<typeof userInvitationEmailPayloadSchema>['params'],
) {
  const { html, subject, text } = await compileEmailTemplate({
    type: 'userInvitation',
    params: payload,
  });

  return sendSESEmail({
    to: payload.email,
    subject,
    html,
    text,
  });
}
