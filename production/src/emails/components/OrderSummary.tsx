import { Hr, Section, Text } from '@react-email/components';
import type { OrderLineItem } from '../../lib/email/events';
import { emailColors, emailFonts } from '../styles';

type Props = {
  lineItems: OrderLineItem[];
  totalEur?: string;
  labels: { items: string; total: string };
};

export function OrderSummary({ lineItems, totalEur, labels }: Props) {
  if (!lineItems.length) return null;

  return (
    <Section style={{ margin: '24px 0' }}>
      <Text
        style={{
          color: emailColors.text,
          fontFamily: emailFonts.base,
          fontSize: '14px',
          fontWeight: 600,
          margin: '0 0 12px'
        }}
      >
        {labels.items}
      </Text>
      {lineItems.map((item) => (
        <Text
          key={`${item.sku ?? item.name}-${item.quantity}`}
          style={{
            color: emailColors.text,
            fontFamily: emailFonts.base,
            fontSize: '14px',
            margin: '0 0 6px'
          }}
        >
          {item.quantity}× {item.name}
          {item.sku ? ` (${item.sku})` : ''} — €{item.priceEur.toFixed(2)}
        </Text>
      ))}
      {totalEur ? (
        <>
          <Hr style={{ borderColor: emailColors.border, margin: '12px 0' }} />
          <Text
            style={{
              color: emailColors.text,
              fontFamily: emailFonts.base,
              fontSize: '15px',
              fontWeight: 700,
              margin: '0'
            }}
          >
            {labels.total}: €{totalEur}
          </Text>
        </>
      ) : null}
    </Section>
  );
}
