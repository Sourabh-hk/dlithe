import { useEffect, useState } from 'react';
import { adminService } from '../../api/services';
import { Card, StatusBadge, Button, Select, Modal, ConfirmModal, EmptyState, Skeleton, PageHeader } from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { Users, Pencil } from 'lucide-react';

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({ role: '', isActive: true });

  const fetchUsers = () => {
    adminService.getAllUsers()
      .then((res) => setUsers(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const openEdit = (u) => {
    setEditForm({ role: u.role, isActive: u.isActive });
    setEditModal(u);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminService.updateUser(editModal._id, editForm);
      toast.success('User updated');
      setEditModal(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user');
    } finally { setSaving(false); }
  };

  return (
    <div className="p-6">
      <PageHeader title="Users" subtitle="Manage user accounts and roles" />

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 rounded-lg" />)}</div>
      ) : users.length === 0 ? (
        <EmptyState icon={Users} title="No users found" />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Name', 'Email', 'Phone', 'Role', 'Status', 'Bookings', 'Joined', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900">{u.name}</td>
                    <td className="px-4 py-3 text-slate-600">{u.email}</td>
                    <td className="px-4 py-3 text-slate-600">{u.phone || '—'}</td>
                    <td className="px-4 py-3"><StatusBadge status={u.role} /></td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${u.isActive ? 'text-green-600' : 'text-red-600'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{u.bookingCount}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => openEdit(u)} className="p-1.5 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal isOpen={!!editModal} onClose={() => setEditModal(null)} title={`Edit: ${editModal?.name}`} size="sm">
        {editModal && (
          <div className="space-y-4">
            {editModal._id === currentUser._id && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700">
                You are editing your own account. Some changes may be restricted.
              </div>
            )}
            <Select label="Role" value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </Select>
            <Select label="Account Status" value={editForm.isActive ? 'true' : 'false'} onChange={(e) => setEditForm({ ...editForm, isActive: e.target.value === 'true' })}>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </Select>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setEditModal(null)}>Cancel</Button>
              <Button onClick={handleSave} loading={saving}>Save Changes</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminUsers;
