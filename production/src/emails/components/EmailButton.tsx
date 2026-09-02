import { Button } from '@react-email/components';
import { emailColors, emailFonts } from '../styles';

type Props = { href: string; label: string };

export function EmailButton({ href, label }: Props) {
  return (
    <Button
      href={href}
      style={{
        backgroundColor: emailColors.accent,
        borderRadius: '6px',
        color: '#ffffff',
        display: 'inline-block',
        fontFamily: emailFonts.base,
        fontSize: '14px',
        fontWeight: 600,
        lineHeight: '100%',
        padding: '12px 24px',
        textDecoration: 'none'
      }}
    >
      {label}
    </Button>
  );
}
