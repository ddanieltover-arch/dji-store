import { Section, Text } from '@react-email/components';
import { emailColors, emailFonts } from '../styles';

type Props = { title: string; subtitle?: string };

export function AdminAlertBanner({ title, subtitle }: Props) {
  return (
    <Section
      style={{
        backgroundColor: emailColors.adminBanner,
        borderRadius: '8px',
        marginBottom: '24px',
        padding: '16px'
      }}
    >
      <Text
        style={{
          color: emailColors.adminBannerText,
          fontFamily: emailFonts.base,
          fontSize: '14px',
          fontWeight: 700,
          margin: '0 0 4px'
        }}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          style={{
            color: emailColors.adminBannerText,
            fontFamily: emailFonts.base,
            fontSize: '13px',
            margin: '0'
          }}
        >
          {subtitle}
        </Text>
      ) : null}
    </Section>
  );
}
