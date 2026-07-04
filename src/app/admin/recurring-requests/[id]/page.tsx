import ClientPage from './ClientPage';

// Static export needs at least one param; the real id is resolved client-side
// via useParams(). See sibling bookings/[id] for the same SPA pattern.
export function generateStaticParams() {
    return [{ id: '1' }];
}

export default function Page() {
    return <ClientPage />;
}
