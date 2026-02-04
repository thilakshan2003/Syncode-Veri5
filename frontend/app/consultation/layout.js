import ProtectedRoute from '@/components/ProtectedRoute';

export default function ConsultationLayout({ children }) {
    return <ProtectedRoute>{children}</ProtectedRoute>;
}
