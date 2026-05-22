/**
 * Administrative Layout Segment — app/admin/layout.js
 * =====================================================
 * Wraps dashboard routes in a style-isolated wrapper.
 * Provides custom background coloring and minimal layouts to contain
 * administrative forms and data grids.
 */

/**
 * Metadata configuration for administrative pages.
 * Overrides the default root document headers for better administrative indexing control.
 */
export const metadata = {
  title: 'Admin Dashboard | Thabo.Portfolio',
};

/**
 * AdminLayout Component
 * Configures the viewport wrappers for the portfolio administration section.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Dashboard screens and login routes
 */
export default function AdminLayout({ children }) {
  return (
    <div className="admin-wrapper" style={{ minHeight: '100vh', background: '#0a0c10' }}>
      {children}
    </div>
  );
}

