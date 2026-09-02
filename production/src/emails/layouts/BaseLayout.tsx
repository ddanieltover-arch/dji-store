import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text
} from '@react-email/components';
import type { ReactNode } from 'react';
import { SITE_EMAIL } from '../../lib/email/config';
import { emailColors, emailFonts } from '../styles';

type Props = {
  preview: string;
  children: ReactNode;
  footer?: string;
  showUnsubscribe?: boolean;
  unsubscribeUrl?: string;
};

export function BaseLayout({ preview, children, footer, showUnsubscribe, unsubscribeUrl }: Props) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://djii.eu';

  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: emailColors.background, fontFamily: emailFonts.base, margin: 0, padding: '24px 0' }}>
        <Container
          style={{
            backgroundColor: emailColors.card,
            borderRadius: '8px',
            margin: '0 auto',
            maxWidth: '600px',
            padding: '32px'
          }}
        >
          {children}
          <Hr style={{ borderColor: emailColors.border, margin: '32px 0 24px' }} />
          <Text style={{ color: emailColors.muted, fontFamily: emailFonts.base, fontSize: '12px', lineHeight: '1.6', margin: '0 0 8px' }}>
            {footer ?? `Questions? Contact us at ${SITE_EMAIL}`}
          </Text>
          <Text style={{ color: emailColors.muted, fontFamily: emailFonts.base, fontSize: '12px', lineHeight: '1.6', margin: '0 0 8px' }}>
            DJI Store EU · Certified European Distribution
          </Text>
          <Section>
            <Link href={siteUrl} style={{ color: emailColors.accent, fontSize: '12px', marginRight: '12px' }}>
              Visit store
            </Link>
            <Link href={`${siteUrl}/privacy`} style={{ color: emailColors.accent, fontSize: '12px', marginRight: '12px' }}>
              Privacy
            </Link>
            {showUnsubscribe && unsubscribeUrl ? (
              <Link href={unsubscribeUrl} style={{ color: emailColors.muted, fontSize: '12px' }}>
                Unsubscribe
              </Link>
            ) : null}
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
