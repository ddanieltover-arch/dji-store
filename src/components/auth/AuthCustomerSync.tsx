import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';

/** Keeps CRM mock customer selection aligned with the signed-in account email. */
export function AuthCustomerSync() {
  const { user } = useAuth();
  const { customers, setCurrentCustomerId } = useStore();

  useEffect(() => {
    if (!user) return;
    const match = customers.find((c) => c.email.toLowerCase() === user.email.toLowerCase());
    if (match) setCurrentCustomerId(match.id);
  }, [user, customers, setCurrentCustomerId]);

  return null;
}
