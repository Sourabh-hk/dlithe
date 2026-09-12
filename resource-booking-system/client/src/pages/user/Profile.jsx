import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../api/services';
import { useToast } from '../../context/ToastContext';
import { Card, Input, Button, PageHeader, StatusBadge } from '../../components/ui';
import { User, Shield } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const res = await authService.updateProfile(form);
      updateUser(res.data.user);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <PageHeader title="Profile" subtitle="View and update your account information" />

      <div className="space-y-4">
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-xl font-bold text-blue-700">{user?.name?.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <p className="font-semibold text-slate-900">{user?.name}</p>
              <p className="text-sm text-slate-500">{user?.email}</p>
              <div className="mt-1"><StatusBadge status={user?.role} /></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={errors.name}
            />
            <Input
              label="Email address"
              value={user?.email}
              disabled
              className="bg-slate-50 text-slate-500 cursor-not-allowed"
            />
            <Input
              label="Phone number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-md border border-slate-200 text-xs text-slate-500">
              <Shield className="w-3.5 h-3.5" />
              Your role ({user?.role}) cannot be changed here.
            </div>
            <Button type="submit" loading={saving}>Save Changes</Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
