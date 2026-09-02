import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { OrderStatus, PlacedOrder } from '../../types';

type PaymentStatus = PlacedOrder['paymentStatus'];

const ORDER_STATUSES: OrderStatus[] = [
  'pending_payment',
  'payment_under_review',
  'confirmed',
  'allocated',
  'picking',
  'packed',
  'shipped',
  'delivered',
  'completed',
  'cancelled',
  'refunded',
  'rma_requested'
];

const PAYMENT_STATUSES: PaymentStatus[] = ['verifying', 'confirmed', 'processing', 'dispatched', 'delivered'];

interface AdminOrderEditModalProps {
  order: PlacedOrder;
  onClose: () => void;
  onSave: (orderNumber: string, updates: Partial<PlacedOrder>) => void;
}

export const AdminOrderEditModal: React.FC<AdminOrderEditModalProps> = ({ order, onClose, onSave }) => {
  const [form, setForm] = useState({
    firstName: order.customer.firstName,
    lastName: order.customer.lastName,
    email: order.customer.email,
    phone: order.customer.phone,
    street: order.shippingAddress.street,
    postalCode: order.shippingAddress.postalCode,
    city: order.shippingAddress.city,
    countryCode: order.shippingAddress.countryCode,
    status: order.status ?? 'confirmed',
    paymentStatus: order.paymentStatus,
    totalEur: order.totalEur,
    trackingToken: order.trackingToken,
    trackingNumber: order.tracking?.trackingNumber ?? ''
  });

  useEffect(() => {
    setForm({
      firstName: order.customer.firstName,
      lastName: order.customer.lastName,
      email: order.customer.email,
      phone: order.customer.phone,
      street: order.shippingAddress.street,
      postalCode: order.shippingAddress.postalCode,
      city: order.shippingAddress.city,
      countryCode: order.shippingAddress.countryCode,
      status: order.status ?? 'confirmed',
      paymentStatus: order.paymentStatus,
      totalEur: order.totalEur,
      trackingToken: order.trackingToken,
      trackingNumber: order.tracking?.trackingNumber ?? ''
    });
  }, [order]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    onSave(order.orderNumber, {
      customer: {
        ...order.customer,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim()
      },
      shippingAddress: {
        ...order.shippingAddress,
        street: form.street.trim(),
        postalCode: form.postalCode.trim(),
        city: form.city.trim(),
        countryCode: form.countryCode.trim().toUpperCase()
      },
      status: form.status as OrderStatus,
      paymentStatus: form.paymentStatus as PaymentStatus,
      totalEur: Number(form.totalEur),
      trackingToken: form.trackingToken.trim(),
      tracking: order.tracking
        ? { ...order.tracking, trackingNumber: form.trackingNumber.trim() }
        : form.trackingNumber.trim()
          ? {
              carrier: 'DHL',
              trackingNumber: form.trackingNumber.trim(),
              status: 'payment_verifying' as const,
              estimatedDelivery: '',
              currentLocation: '',
              events: []
            }
          : undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">Edit order</h2>
            <p className="text-xs text-gray-500 font-mono mt-0.5">{order.orderNumber}</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={submit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs font-semibold text-gray-600">
              First name
              <input
                required
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
              />
            </label>
            <label className="text-xs font-semibold text-gray-600">
              Last name
              <input
                required
                value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
              />
            </label>
          </div>

          <label className="block text-xs font-semibold text-gray-600">
            Email
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
            />
          </label>

          <label className="block text-xs font-semibold text-gray-600">
            Phone
            <input
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
            />
          </label>

          <label className="block text-xs font-semibold text-gray-600">
            Street
            <input
              required
              value={form.street}
              onChange={(e) => setForm((f) => ({ ...f, street: e.target.value }))}
              className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
            />
          </label>

          <div className="grid grid-cols-3 gap-3">
            <label className="text-xs font-semibold text-gray-600 col-span-1">
              Postal
              <input
                required
                value={form.postalCode}
                onChange={(e) => setForm((f) => ({ ...f, postalCode: e.target.value }))}
                className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
              />
            </label>
            <label className="text-xs font-semibold text-gray-600 col-span-2">
              City
              <input
                required
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
              />
            </label>
          </div>

          <label className="block text-xs font-semibold text-gray-600">
            Country code
            <input
              required
              maxLength={2}
              value={form.countryCode}
              onChange={(e) => setForm((f) => ({ ...f, countryCode: e.target.value.toUpperCase() }))}
              className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-200 text-sm uppercase"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs font-semibold text-gray-600">
              Order status
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as OrderStatus }))}
                className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs font-semibold text-gray-600">
              Payment status
              <select
                value={form.paymentStatus}
                onChange={(e) => setForm((f) => ({ ...f, paymentStatus: e.target.value as PaymentStatus }))}
                className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
              >
                {PAYMENT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block text-xs font-semibold text-gray-600">
            Total (EUR)
            <input
              type="number"
              min={0}
              step={0.01}
              required
              value={form.totalEur}
              onChange={(e) => setForm((f) => ({ ...f, totalEur: Number(e.target.value) }))}
              className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
            />
          </label>

          <label className="block text-xs font-semibold text-gray-600">
            Tracking token
            <input
              value={form.trackingToken}
              onChange={(e) => setForm((f) => ({ ...f, trackingToken: e.target.value }))}
              className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-mono"
            />
          </label>

          <label className="block text-xs font-semibold text-gray-600">
            Carrier tracking number
            <input
              value={form.trackingNumber}
              onChange={(e) => setForm((f) => ({ ...f, trackingNumber: e.target.value }))}
              className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-mono"
            />
          </label>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-sm font-bold bg-[#E30613] text-white hover:bg-[#c5050f]"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
