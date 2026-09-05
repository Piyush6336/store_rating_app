import React from 'react';
import { CheckCircle2, CircleAlert, Info } from 'lucide-react';
export default function Message({ type = 'info', children }) {
  if (!children) {
    return null;
  }

  const Icon = type === 'success' ? CheckCircle2 : type === 'error' ? CircleAlert : Info;
  return <p className={`message ${type}`} role={type === 'error' ? 'alert' : 'status'}><Icon size={18} />{children}</p>;
}
