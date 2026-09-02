import { Section, Text } from '@react-email/components';
import { emailColors, emailFonts } from '../styles';

type Row = { label: string; value: string };

type Props = { rows: Row[] };

export function DetailTable({ rows }: Props) {
  return (
    <Section
      style={{
        backgroundColor: emailColors.background,
        borderRadius: '8px',
        margin: '24px 0',
        padding: '16px'
      }}
    >
      {rows.map((row) => (
        <Text
          key={row.label}
          style={{
            color: emailColors.text,
            fontFamily: emailFonts.base,
            fontSize: '14px',
            lineHeight: '1.6',
            margin: '0 0 8px'
          }}
        >
          <span style={{ color: emailColors.muted }}>{row.label}: </span>
          <strong>{row.value}</strong>
        </Text>
      ))}
    </Section>
  );
}
