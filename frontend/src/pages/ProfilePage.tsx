import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ui/Toast';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { User as UserIcon, Mail, Lock, Globe, Heart, Shield, Check, Save } from 'lucide-react';
import { Category, Language } from '../types';

export const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const normalizeInterests = (interests?: (Category | string)[]): string[] => {
    if (!interests) return [];
    return interests.map((i) => (typeof i === 'string' ? i : i._id || i.id || ''));
  };

  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [preferredLanguage, setPreferredLanguage] = useState(user?.preferredLanguage || 'en');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(normalizeInterests(user?.interests));

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Sync state when user object loads
  useEffect(() => {
    if (user) {
      setName(user.name);
      setAvatar(user.avatar || '');
      setPreferredLanguage(user.preferredLanguage || 'en');
      setSelectedInterests(normalizeInterests(user.interests));
    }
  }, [user]);

  // Fetch available languages
  const { data: languages = [] } = useQuery<Language[]>({
    queryKey: ['languages'],
    queryFn: () => apiClient.getLanguages()
  });

  // Fetch available categories for interests
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => apiClient.getCategories()
  });

  // Profile update mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: { name?: string; avatar?: string; preferredLanguage?: string; interests?: string[] }) =>
      apiClient.updateProfile(data),
    onSuccess: (updatedUser) => {
      showToast('Profile updated successfully!', 'success');
      refreshUser();
      queryClient.setQueryData(['currentUser'], updatedUser);
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      showToast(message, 'error');
    }
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Name is required', 'error');
      return;
    }
    updateProfileMutation.mutate({
      name: name.trim(),
      avatar: avatar.trim() || undefined,
      preferredLanguage,
      interests: selectedInterests
    });
  };

  const handleToggleInterest = (categoryId: string) => {
    setSelectedInterests((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showToast('Please fill in both current and new password', 'error');
      return;
    }
    if (newPassword.length < 8) {
      showToast('New password must be at least 8 characters', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    setIsChangingPassword(true);
    try {
      await apiClient.changePassword(currentPassword, newPassword);
      showToast('Password changed successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to change password';
      showToast(message, 'error');
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-navy-750 mb-8">
        <div className="flex items-center gap-4">
          <Avatar name={user.name} src={avatar || user.avatar} size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                {user.name}
              </h1>
              <Badge variant={user.role === 'admin' ? 'danger' : 'secondary'} size="sm">
                {user.role.toUpperCase()}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" size="sm" className="capitalize">
            Status: {user.status}
          </Badge>
          <span className="text-xs text-slate-400">
            Joined {new Date(user.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 bg-white dark:bg-navy-850 border-slate-200 dark:border-navy-700">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-editorial-red" />
              <span>Personal Information</span>
            </h2>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                leftIcon={<UserIcon className="w-4 h-4" />}
              />

              <Input
                label="Email Address"
                value={user.email}
                disabled
                helperText="Email cannot be changed directly in this phase."
                leftIcon={<Mail className="w-4 h-4" />}
              />

              <Input
                label="Avatar URL (Optional)"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                helperText="Link to a public portrait image."
              />

              {/* Preferred Language */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-editorial-red" />
                  <span>Preferred Reading Language</span>
                </label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-editorial-red"
                >
                  {languages.length > 0 ? (
                    languages.map((lang) => (
                      <option key={lang._id} value={lang.code}>
                        {lang.name} ({lang.code.toUpperCase()}) {lang.isDefault ? '— Default' : ''}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="en">English (EN)</option>
                      <option value="te">Telugu (TE)</option>
                      <option value="hi">Hindi (HI)</option>
                    </>
                  )}
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  Default language for your personalized news view and notifications.
                </p>
              </div>

              {/* User Interests Foundation */}
              <div className="pt-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-editorial-red" />
                  <span>Topic Interests</span>
                </label>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                  Select categories you follow to tailor your editorial dossier in future releases.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categories.map((cat) => {
                    const catId = cat._id || cat.id || '';
                    const isSelected = selectedInterests.includes(catId);
                    return (
                      <button
                        key={catId}
                        type="button"
                        onClick={() => handleToggleInterest(catId)}
                        className={`flex items-center justify-between px-3 py-2 rounded text-xs font-semibold border transition-all text-left ${
                          isSelected
                            ? 'bg-editorial-red text-white border-editorial-red shadow-sm'
                            : 'bg-slate-50 dark:bg-navy-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-navy-750 hover:border-slate-300 dark:hover:border-navy-600'
                        }`}
                      >
                        <span className="truncate">{cat.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-navy-750 flex justify-end">
                <Button
                  type="submit"
                  isLoading={updateProfileMutation.isPending}
                  leftIcon={<Save className="w-4 h-4" />}
                >
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Security & Password Card */}
        <div className="space-y-6">
          <Card className="p-6 bg-white dark:bg-navy-850 border-slate-200 dark:border-navy-700">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-editorial-red" />
              <span>Change Password</span>
            </h2>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
                disabled={isChangingPassword}
              />

              <Input
                label="New Password"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                leftIcon={<Lock className="w-4 h-4" />}
                disabled={isChangingPassword}
              />

              <Input
                label="Confirm New Password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                leftIcon={<Lock className="w-4 h-4" />}
                disabled={isChangingPassword}
              />

              <Button
                type="submit"
                variant="outline"
                className="w-full"
                isLoading={isChangingPassword}
              >
                Update Password
              </Button>
            </form>
          </Card>

          {/* Account Overview Box */}
          <Card className="p-5 bg-slate-50 dark:bg-navy-900 border-slate-200 dark:border-navy-750 text-xs space-y-2.5">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              Account Credentials
            </h3>
            <div className="flex justify-between py-1 border-b border-slate-200 dark:border-navy-800">
              <span className="text-slate-500">Access Level</span>
              <span className="font-bold uppercase text-slate-800 dark:text-slate-200">{user.role}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200 dark:border-navy-800">
              <span className="text-slate-500">Account Status</span>
              <span className="font-bold uppercase text-emerald-600 dark:text-emerald-400">{user.status}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Security Model</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">JWT + Bcrypt (12 Rounds)</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
