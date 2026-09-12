import { useEffect, useState } from 'react';
import { adminService } from '../../api/services';
import { Card, StatusBadge, Button, Input, Select, Textarea, Modal, ConfirmModal, EmptyState, Skeleton, PageHeader } from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import { RESOURCE_TYPES } from '../../utils/helpers';
import { Plus, Pencil, Trash2, Building2, MapPin, Users } from 'lucide-react';

const defaultForm = { name: '', type: 'Meeting Room', description: '', location: '', capacity: '', features: '', image: '', status: 'AVAILABLE' };

const ResourceForm = ({ initial, onSave, onCancel, loading }) => {
  const [form, setForm] = useState(initial || defaultForm);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.location.trim()) e.location = 'Location is required';
    if (!form.capacity || Number(form.capacity) < 1) e.capacity = 'Valid capacity is required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const features = typeof form.features === 'string'
      ? form.features.split(',').map((f) => f.trim()).filter(Boolean)
      : form.features;
    onSave({ ...form, capacity: Number(form.capacity), features });
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><Input label="Resource Name *" value={form.name} onChange={set('name')} error={errors.name} /></div>
        <Select label="Type *" value={form.type} onChange={set('type')}>
          {RESOURCE_TYPES.map((t) => <option key={t}>{t}</option>)}
        </Select>
        <Select label="Status" value={form.status} onChange={set('status')}>
          <option value="AVAILABLE">Available</option>
          <option value="MAINTENANCE">Maintenance</option>
          <option value="INACTIVE">Inactive</option>
        </Select>
        <div className="col-span-2"><Textarea label="Description *" value={form.description} onChange={set('description')} error={errors.description} rows={2} /></div>
        <Input label="Location *" value={form.location} onChange={set('location')} error={errors.location} placeholder="Building 1 · Floor 3" />
        <Input label="Capacity *" type="number" min="1" value={form.capacity} onChange={set('capacity')} error={errors.capacity} />
        <div className="col-span-2">
          <Input label="Features (comma-separated)" value={typeof form.features === 'string' ? form.features : form.features?.join(', ')} onChange={set('features')} placeholder="Projector, Whiteboard, Wi-Fi" />
        </div>
        <div className="col-span-2"><Input label="Image URL" value={form.image} onChange={set('image')} placeholder="https://..." /></div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" onClick={onCancel} type="button">Cancel</Button>
        <Button type="submit" loading={loading}>Save Resource</Button>
      </div>
    </form>
  );
};

const AdminResources = () => {
  const { toast } = useToast();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formModal, setFormModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchResources = () => {
    adminService.getAllResources()
      .then((res) => setResources(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchResources(); }, []);

  const openCreate = () => { setEditing(null); setFormModal(true); };
  const openEdit = (r) => {
    setEditing({ ...r, features: r.features?.join(', ') });
    setFormModal(true);
  };

  const handleSave = async (data) => {
    setSaving(true);
    try {
      if (editing) {
        await adminService.updateResource(editing._id, data);
        toast.success('Resource updated');
      } else {
        await adminService.createResource(data);
        toast.success('Resource created');
      }
      setFormModal(false);
      fetchResources();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminService.deleteResource(deleteModal._id);
      toast.success('Resource deactivated');
      setDeleteModal(null);
      fetchResources();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Resources"
        subtitle="Manage all bookable resources"
        actions={<Button onClick={openCreate}><Plus className="w-4 h-4" /> Add Resource</Button>}
      />

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)}</div>
      ) : resources.length === 0 ? (
        <EmptyState icon={Building2} title="No resources" description="Create your first resource." action={<Button onClick={openCreate}><Plus className="w-4 h-4" /> Add Resource</Button>} />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Name', 'Type', 'Location', 'Capacity', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {resources.map((r) => (
                  <tr key={r._id} className={`hover:bg-slate-50 transition-colors ${!r.isActive ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{r.name}</p>
                      {!r.isActive && <span className="text-xs text-red-500">Deactivated</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{r.type}</td>
                    <td className="px-4 py-3 text-slate-600">{r.location}</td>
                    <td className="px-4 py-3 text-slate-600">{r.capacity}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(r)} className="p-1.5 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        {r.isActive && (
                          <button onClick={() => setDeleteModal(r)} className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-red-50">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal isOpen={formModal} onClose={() => setFormModal(false)} title={editing ? 'Edit Resource' : 'Add Resource'} size="lg">
        <ResourceForm initial={editing} onSave={handleSave} onCancel={() => setFormModal(false)} loading={saving} />
      </Modal>

      <ConfirmModal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={handleDelete}
        title={`Deactivate ${deleteModal?.name}?`}
        message="This resource will be deactivated and hidden from users. Existing booking history will be preserved."
        confirmLabel="Deactivate Resource"
        loading={deleting}
      />
    </div>
  );
};

export default AdminResources;
