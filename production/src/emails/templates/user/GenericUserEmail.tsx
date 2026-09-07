import { Section } from '@react-email/components';
import { AdminAlertBanner } from '../../components/AdminAlertBanner';
import { DetailTable } from '../../components/DetailTable';
import { EmailButton } from '../../components/EmailButton';
import { EmailHeader } from '../../components/EmailHeader';
import { LocaleText } from '../../components/LocaleText';
import { OrderSummary } from '../../components/OrderSummary';
import { BaseLayout } from '../../layouts/BaseLayout';
import type { EmailTemplateProps } from '../../../lib/email/events';
import { clientDetailRows } from '../../../lib/email/clientDetails';
import { getEmailCopy, interpolate, ORDER_LABELS, renderPreview } from '../../../lib/email/i18n';

export function GenericUserEmail({ templateId, locale, payload, ctaUrl, lineItems = [] }: EmailTemplateProps) {
  const copy = getEmailCopy(templateId, locale);
  const preview = renderPreview(templateId, locale, payload);
  const isMarketing = templateId.startsWith('marketing.') || templateId.startsWith('lifecycle.') || templateId.startsWith('alert.') || templateId === 'newsletter.welcome' || templateId === 'referral.invite';
  const detailRows = buildDetailRows(payload);

  return (
    <BaseLayout preview={preview} footer={copy.footer ? interpolate(copy.footer, payload) : undefined} showUnsubscribe={isMarketing} unsubscribeUrl={payload.unsubscribeUrl as string | undefined}>
      <EmailHeader headline={interpolate(copy.headline, payload)} badge={copy.badge ? interpolate(copy.badge, payload) : undefined} />
      <LocaleText copy={copy} payload={payload} />
      {lineItems.length ? <OrderSummary lineItems={lineItems} totalEur={payload.totalEur as string | undefined} labels={ORDER_LABELS[locale]} /> : null}
      {detailRows.length ? <DetailTable rows={detailRows} /> : null}
      {copy.cta && ctaUrl ? (
        <Section style={{ marginTop: '24px' }}>
          <EmailButton href={ctaUrl} label={interpolate(copy.cta, payload)} />
        </Section>
      ) : null}
    </BaseLayout>
  );
}

function buildDetailRows(payload: Record<string, unknown>) {
  const fields: [string, string][] = [
    ['Order', 'orderNumber'],
    ['Product', 'productName'],
    ['Payment', 'paymentMethod'],
    ['Total EUR', 'totalEur'],
    ['Serial', 'serialNumber'],
    ['RMA', 'rmaNumber'],
    ['Claim', 'claimId'],
    ['Quote', 'quoteNumber'],
    ['Tracking', 'trackingNumber'],
    ['Request ID', 'requestId'],
    ['Rating', 'rating'],
    ['Reason', 'reason'],
    ['Quantity', 'quantity'],
    ['Points', 'points'],
    ['Referral code', 'referralCode']
  ];
  const transactionRows = fields
    .filter(([, key]) => payload[key] !== undefined && payload[key] !== null && String(payload[key]).trim() !== '')
    .map(([label, key]) => ({ label, value: String(payload[key]) }));

  // Client block first so both user and admin copies confirm submitted contact details.
  return [...clientDetailRows(payload), ...transactionRows];
}
