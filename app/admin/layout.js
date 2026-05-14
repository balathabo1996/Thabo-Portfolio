export const metadata = {
  title: 'Admin Dashboard | Thabo.Portfolio',
};

export default function AdminLayout({ children }) {
  return (
    <div className="admin-wrapper" style={{ minHeight: '100vh', background: '#0a0c10' }}>
      {children}
    </div>
  );
}
