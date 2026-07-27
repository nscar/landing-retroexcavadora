import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export async function sendContactEmail({ name, phone, date }) {
  const response = await emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    { name, phone, date },
    PUBLIC_KEY,
  );
  return response;
}
