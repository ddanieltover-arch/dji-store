import { Heading, Section, Text } from '@react-email/components';
import { emailColors, emailFonts } from '../styles';

type Props = {
  headline: string;
  badge?: string;
  preview?: string;
};

export function EmailHeader({ headline, badge }: Props) {
  return (
    <Section style={{ marginBottom: '24px' }}>
      <Text
        style={{
          color: emailColors.muted,
          fontFamily: emailFonts.base,
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          margin: '0 0 8px',
          textTransform: 'uppercase'
        }}
      >
        DJI Store EU
      </Text>
      {badge ? (
        <Text
          style={{
            backgroundColor: emailColors.background,
            borderRadius: '999px',
            color: emailColors.accent,
            display: 'inline-block',
            fontFamily: emailFonts.base,
            fontSize: '12px',
            fontWeight: 600,
            margin: '0 0 12px',
            padding: '4px 10px'
          }}
        >
          {badge}
        </Text>
      ) : null}
      <Heading
        style={{
          color: emailColors.text,
          fontFamily: emailFonts.base,
          fontSize: '24px',
          fontWeight: 700,
          lineHeight: '1.3',
          margin: '0'
        }}
      >
        {headline}
      </Heading>
    </Section>
  );
}
