import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Input, Button } from '../../components/ui';
import { Layers } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      toast.success('Account created successfully!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-slate-900 text-lg">BookSpace</span>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-8">
          <h1 className="text-xl font-bold text-slate-900 mb-1">Create an account</h1>
          <p className="text-sm text-slate-500 mb-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">Sign in</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input label="Full Name" placeholder="Your full name" value={form.name} onChange={set('name')} error={errors.name} autoComplete="name" />
            <Input label="Email address" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" />
            <Input label="Phone number" type="tel" placeholder="+91 98000 00000" value={form.phone} onChange={set('phone')} error={errors.phone} autoComplete="tel" />
            <Input label="Password" type="password" placeholder="At least 6 characters" value={form.password} onChange={set('password')} error={errors.password} autoComplete="new-password" />
            <Input label="Confirm password" type="password" placeholder="Repeat your password" value={form.confirmPassword} onChange={set('confirmPassword')} error={errors.confirmPassword} autoComplete="new-password" />
            <Button type="submit" className="w-full" loading={loading} size="lg">
              Create account
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
