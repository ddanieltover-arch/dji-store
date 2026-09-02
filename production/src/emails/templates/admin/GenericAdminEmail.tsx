import { Section } from '@react-email/components';
import { AdminAlertBanner } from '../../components/AdminAlertBanner';
import { DetailTable } from '../../components/DetailTable';
import { EmailButton } from '../../components/EmailButton';
import { EmailHeader } from '../../components/EmailHeader';
import { LocaleText } from '../../components/LocaleText';
import { OrderSummary } from '../../components/OrderSummary';
import { BaseLayout } from '../../layouts/BaseLayout';
import type { EmailTemplateProps } from '../../../lib/email/events';
import { ADMIN_BANNER, getEmailCopy, interpolate, ORDER_LABELS, renderPreview } from '../../../lib/email/i18n';

export function GenericAdminEmail({ templateId, locale, payload, ctaUrl, lineItems = [] }: EmailTemplateProps) {
  const copy = getEmailCopy(templateId, locale);
  const preview = renderPreview(templateId, locale, payload);
  const banner = ADMIN_BANNER[locale];
  const detailRows = buildAdminRows(payload);

  return (
    <BaseLayout preview={preview}>
      <AdminAlertBanner title={banner.title} subtitle={banner.subtitle} />
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

function buildAdminRows(payload: Record<string, unknown>) {
  const fields: [string, string][] = [
    ['Customer', 'customerName'],
    ['Email', 'customerEmail'],
    ['Order', 'orderNumber'],
    ['Product', 'productName'],
    ['Total EUR', 'totalEur'],
    ['Payment', 'paymentMethod'],
    ['Serial', 'serialNumber'],
    ['RMA', 'rmaNumber'],
    ['Reason', 'reason'],
    ['Claim', 'claimId'],
    ['Company', 'companyName'],
    ['Quantity', 'quantity'],
    ['Referee', 'refereeEmail'],
    ['Referral code', 'referralCode'],
    ['Points', 'points'],
    ['Request ID', 'requestId'],
    ['Rating', 'rating']
  ];
  return fields
    .filter(([, key]) => payload[key] !== undefined && payload[key] !== null && payload[key] !== '')
    .map(([label, key]) => ({ label, value: String(payload[key]) }));
}
