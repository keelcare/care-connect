import ClientPage from './ClientPage';

export function generateStaticParams() {
  return [{ nannyId: '1' }];
}

export default function Page() {
  return <ClientPage />;
}
