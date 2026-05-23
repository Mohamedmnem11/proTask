"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  User,
  Mail,
  Phone,
  Lock,
  Save,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // بيانات النموذج
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // تغيير كلمة السر
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    // جلب المستخدم من localStorage
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/login");
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      setUser(userData);
      setName(userData.name || "");
      setPhone(userData.phone || "");
    } catch (e) {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      // تحديث البيانات في API
      const response = await api.updateUser(user._id || user.id, {
        name,
        phone,
      });

      // تحديث localStorage
      const updatedUser = { ...user, name, phone };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      setSuccess("تم تحديث البيانات بنجاح");
    } catch (err: any) {
      setError(err.message || "حدث خطأ في تحديث البيانات");
    } finally {
      setSaving(false);
    }
  };

 const handleChangePassword = async (e: React.FormEvent) => {
  e.preventDefault()
  setSaving(true)
  setError('')
  setSuccess('')

  // التحقق من أن كل الحقول مليانة
  if (!currentPassword || !newPassword || !confirmPassword) {
    setError('جميع الحقول مطلوبة')
    setSaving(false)
    return
  }

  // التحقق من تطابق كلمة السر
  if (newPassword !== confirmPassword) {
    setError('كلمتا المرور غير متطابقتين')
    setSaving(false)
    return
  }

  // التحقق من طول كلمة السر
  if (newPassword.length < 6) {
    setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
    setSaving(false)
    return
  }

  // التحقق من قوة كلمة السر
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
  if (!passwordRegex.test(newPassword)) {
    setError('كلمة المرور يجب أن تحتوي على حرف كبير وصغير ورقم')
    setSaving(false)
    return
  }

  try {
    const response = await fetch(`/api/users/${user._id || user.id}/password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentPassword,
        newPassword
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'حدث خطأ في تغيير كلمة المرور')
    }

    setSuccess('تم تغيير كلمة المرور بنجاح')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')

  } catch (err: any) {
    setError(err.message || 'حدث خطأ في تغيير كلمة المرور')
  } finally {
    setSaving(false)
  }
}

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-blue-600">
          الرئيسية
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">الملف الشخصي</span>
      </div>

      <h1 className="text-3xl font-bold mb-8">الملف الشخصي</h1>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">البيانات الشخصية</TabsTrigger>
          <TabsTrigger value="password">تغيير كلمة السر</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>البيانات الشخصية</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm">
                    {success}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      value={user?.email}
                      disabled
                      className="pr-9 bg-gray-50"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    لا يمكن تغيير البريد الإلكتروني
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">الاسم الكامل</Label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pr-9"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pr-9"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    رجوع
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        جاري الحفظ...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        حفظ التغييرات
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>تغيير كلمة السر</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-6">
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm">
                    {success}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="currentPassword"
                      type={showCurrent ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="pr-9"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showCurrent ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="newPassword"
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pr-9"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showNew ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pr-9"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showConfirm ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    رجوع
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        جاري التغيير...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        تغيير كلمة السر
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
