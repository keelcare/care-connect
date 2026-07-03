import ClientPage from './ClientPage';

export function generateStaticParams() {
  return [{ bookingId: '1' }];
}

export default function Page() {
  return <ClientPage />;
}
