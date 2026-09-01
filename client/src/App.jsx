import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { StatsCards } from './components/StatsCards';
import { DueTodaySection } from './components/DueTodaySection';
import { CustomerTable } from './components/CustomerTable';
import { CustomerModal } from './components/CustomerModal';
import { DeleteModal } from './components/DeleteModal';
import { Toast } from './components/Toast';
import { customerService } from './services/api';
import { Sparkles, Users, RefreshCw } from 'lucide-react';

export function App() {
  const [customers, setCustomers] = useState([]);
  const [dueCustomers, setDueCustomers] = useState([]);
  const [overdueCustomers, setOverdueCustomers] = useState([]);
  const [metrics, setMetrics] = useState({ total: 0, dueToday: 0, overdue: 0, upcoming: 0 });
  
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('nextFollowUpDate');

  // Modals state
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingCustomer, setDeletingCustomer] = useState(null);

  // Operation states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [contactingId, setContactingId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Fetch all customers & separate due lists
  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Fetch filtered list for table
      const res = await customerService.getCustomers({
        search: searchQuery,
        status: statusFilter,
        sortBy,
      });

      if (res.success) {
        setCustomers(res.data || []);
        if (res.metrics) {
          setMetrics(res.metrics);
        }
      }

      // 2. Fetch Due & Overdue customers for priority actionable section
      const dueRes = await customerService.getDueCustomers();
      if (dueRes.success) {
        setDueCustomers(dueRes.dueToday?.customers || []);
        setOverdueCustomers(dueRes.overdue?.customers || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      showToast(
        error.response?.data?.message || 'Failed to connect to backend server. Make sure server is running.',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, statusFilter, sortBy]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Handle Mark as Contacted
  const handleMarkContacted = async (customerId) => {
    setContactingId(customerId);
    try {
      const res = await customerService.markContacted(customerId);
      if (res.success) {
        showToast(res.message || 'Marked customer as contacted!', 'success');
        // Refresh data to update Due list, All list, and Metrics
        await fetchDashboardData();
      }
    } catch (error) {
      console.error('Error recording contact:', error);
      showToast(error.response?.data?.message || 'Failed to mark as contacted', 'error');
    } finally {
      setContactingId(null);
    }
  };

  // Handle Add / Edit Customer submit
  const handleSaveCustomer = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingCustomer) {
        const customerId = editingCustomer._id || editingCustomer.id;
        const res = await customerService.updateCustomer(customerId, formData);
        if (res.success) {
          showToast(`Updated "${formData.name}" successfully!`, 'success');
          setIsCustomerModalOpen(false);
          setEditingCustomer(null);
          await fetchDashboardData();
        }
      } else {
        const res = await customerService.createCustomer(formData);
        if (res.success) {
          showToast(`Added "${formData.name}" to follow-up schedule!`, 'success');
          setIsCustomerModalOpen(false);
          await fetchDashboardData();
        }
      }
    } catch (error) {
      console.error('Error saving customer:', error);
      const msg = error.response?.data?.errors?.join(', ') || error.response?.data?.message || 'Failed to save customer';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete confirmation
  const handleConfirmDelete = async () => {
    if (!deletingCustomer) return;
    setIsDeleting(true);
    try {
      const customerId = deletingCustomer._id || deletingCustomer.id;
      const res = await customerService.deleteCustomer(customerId);
      if (res.success) {
        showToast(res.message || 'Customer deleted', 'info');
        setIsDeleteModalOpen(false);
        setDeletingCustomer(null);
        await fetchDashboardData();
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      showToast(error.response?.data?.message || 'Failed to delete customer', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Inter',sans-serif]">
      {/* Navigation Header */}
      <Navbar
        onAddCustomer={() => {
          setEditingCustomer(null);
          setIsCustomerModalOpen(true);
        }}
        onRefresh={fetchDashboardData}
        isLoading={isLoading}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Quick Stats Grid */}
        <section>
          <StatsCards
            metrics={metrics}
            activeFilter={statusFilter}
            onSelectFilter={(filterId) => setStatusFilter(filterId)}
          />
        </section>

        {/* Priority Action: Due Today & Overdue Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Priority Action Board
              </h2>
              <p className="text-xs text-slate-400">
                Customers due for outreach today or needing immediate attention
              </p>
            </div>
          </div>

          <DueTodaySection
            dueCustomers={dueCustomers}
            overdueCustomers={overdueCustomers}
            onMarkContacted={handleMarkContacted}
            onAddCustomer={() => {
              setEditingCustomer(null);
              setIsCustomerModalOpen(true);
            }}
            contactingId={contactingId}
          />
        </section>

        {/* Complete Customer Directory */}
        <section className="pt-4 border-t border-slate-800">
          <CustomerTable
            customers={customers}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onEditCustomer={(customer) => {
              setEditingCustomer(customer);
              setIsCustomerModalOpen(true);
            }}
            onDeleteCustomer={(customer) => {
              setDeletingCustomer(customer);
              setIsDeleteModalOpen(true);
            }}
            onMarkContacted={handleMarkContacted}
            onAddCustomer={() => {
              setEditingCustomer(null);
              setIsCustomerModalOpen(true);
            }}
            contactingId={contactingId}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>Customer Follow-up Tracker &bull; Dynamic Follow-up Scheduling Engine</p>
      </footer>

      {/* Modals & Notifications */}
      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => {
          setIsCustomerModalOpen(false);
          setEditingCustomer(null);
        }}
        onSave={handleSaveCustomer}
        initialData={editingCustomer}
        isSubmitting={isSubmitting}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingCustomer(null);
        }}
        onConfirm={handleConfirmDelete}
        customer={deletingCustomer}
        isDeleting={isDeleting}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default App;
