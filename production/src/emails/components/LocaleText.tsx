import { Section, Text } from '@react-email/components';
import { interpolate } from '../../lib/email/i18n';
import type { EmailCopy, EmailPayload } from '../../lib/email/events';

type Props = {
  copy: EmailCopy;
  payload: EmailPayload;
};

export function LocaleText({ copy, payload }: Props) {
  return (
    <Section>
      <Text style={{ color: '#18181b', fontSize: '15px', lineHeight: '1.7', margin: '0 0 16px' }}>
        {interpolate(copy.body, payload)}
      </Text>
      {copy.footer ? (
        <Text style={{ color: '#71717a', fontSize: '13px', lineHeight: '1.6', margin: '0' }}>
          {interpolate(copy.footer, payload)}
        </Text>
      ) : null}
    </Section>
  );
}
