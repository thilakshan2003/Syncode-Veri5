import ProtectedRoute from '@/components/ProtectedRoute';

export default function TestingLayout({ children }) {
    return <ProtectedRoute>{children}</ProtectedRoute>;
}
