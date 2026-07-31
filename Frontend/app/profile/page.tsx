'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { Camera, Save, User, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { cn, getInitials, getAvatarColor } from '@/lib/utils';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Financial enthusiast focused on achieving financial independence.',
    currency: 'USD',
    language: 'English',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSuccessMessage('');

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSaving(false);
    setIsEditing(false);
    setSuccessMessage('Profile updated successfully!');

    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            Profile
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Manage your personal information and preferences
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <Alert variant="success" onClose={() => setSuccessMessage('')}>
            {successMessage}
          </Alert>
        )}

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your profile details</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Avatar Section */}
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-neutral-200 dark:border-neutral-800">
              <div className="relative">
                <div
                  className={cn(
                    'w-24 h-24 rounded-2xl flex items-center justify-center text-white text-3xl font-bold',
                    getAvatarColor(formData.name)
                  )}
                >
                  {getInitials(formData.name)}
                </div>
                <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center transition-colors shadow-lg">
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                  {formData.name}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-3">
                  {formData.email}
                </p>
                <Button variant="outline" size="sm" leftIcon={<Camera className="w-4 h-4" />}>
                  Change Photo
                </Button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  leftIcon={<User className="w-4 h-4" />}
                  disabled={!isEditing}
                  fullWidth
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  leftIcon={<Mail className="w-4 h-4" />}
                  disabled={!isEditing}
                  fullWidth
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  leftIcon={<Phone className="w-4 h-4" />}
                  disabled={!isEditing}
                  fullWidth
                />
                <Input
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  leftIcon={<MapPin className="w-4 h-4" />}
                  disabled={!isEditing}
                  fullWidth
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4">
                {isEditing ? (
                  <>
                    <Button
                      variant="primary"
                      onClick={handleSave}
                      isLoading={isSaving}
                      leftIcon={<Save className="w-4 h-4" />}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button variant="primary" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Account Statistics</CardTitle>
            <CardDescription>Your activity summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  1,234
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Total Transactions
                </p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                  8
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Active Accounts
                </p>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                  245
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Days Active
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Membership details and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-neutral-200 dark:border-neutral-800">
                <div>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">
                    Member Since
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Your account creation date
                  </p>
                </div>
                <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                  <Calendar className="w-4 h-4" />
                  <span>January 15, 2024</span>
                </div>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-neutral-200 dark:border-neutral-800">
                <div>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">
                    Default Currency
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Primary currency for transactions
                  </p>
                </div>
                <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                  USD ($)
                </span>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">
                    Language
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Interface language
                  </p>
                </div>
                <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                  English (US)
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
            <CardDescription>Irreversible account actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-xl">
                <div>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">
                    Delete Account
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button variant="danger" size="sm">
                  Delete Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
