'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Shield,
  Ban,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Calendar,
  MoreVertical,
  Loader2,
  UserCheck,
  Trash2,
  Eye,
  AlertCircle
} from "lucide-react"
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface User {
  _id: string
  name: string
  email: string
  phone: string
  role: 'user' | 'admin'
  isActive: boolean
  createdAt: string
  bookingsCount: number
  cancelledCount: number
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      
      if (data.success) {
        setUsers(data.users)
      } else {
        console.error('Error:', data.error)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  async function toggleUserStatus(userId: string, currentStatus: boolean) {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      })
      
      const data = await res.json()
      if (data.success) {
        setUsers(users.map(user => 
          user._id === userId ? { ...user, isActive: !currentStatus } : user
        ))
      }
    } catch (error) {
      console.error('Error toggling user status:', error)
    }
  }

  async function toggleUserRole(userId: string, currentRole: string) {
    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin'
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      })
      
      const data = await res.json()
      if (data.success) {
        setUsers(users.map(user => 
          user._id === userId ? { ...user, role: newRole } : user
        ))
      }
    } catch (error) {
      console.error('Error toggling user role:', error)
    }
  }

  async function deleteUser(userId: string) {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      })
      
      const data = await res.json()
      if (data.success) {
        setUsers(users.filter(user => user._id !== userId))
        setShowDeleteDialog(false)
        setSelectedUser(null)
      }
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.includes(searchTerm) || 
                         user.email?.includes(searchTerm) ||
                         user.phone?.includes(searchTerm)
    
    if (filter === 'all') return matchesSearch
    if (filter === 'active') return matchesSearch && user.isActive
    if (filter === 'inactive') return matchesSearch && !user.isActive
    if (filter === 'admin') return matchesSearch && user.role === 'admin'
    
    return matchesSearch
  })

  const stats = {
    total: users.length,
    active: users.filter(u => u.isActive).length,
    inactive: users.filter(u => !u.isActive).length,
    admins: users.filter(u => u.role === 'admin').length,
    totalBookings: users.reduce((acc, u) => acc + (u.bookingsCount || 0), 0),
    totalCancelled: users.reduce((acc, u) => acc + (u.cancelledCount || 0), 0)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-500">جاري تحميل المستخدمين...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">إدارة المستخدمين</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            <p className="text-sm text-gray-600">إجمالي المستخدمين</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            <p className="text-sm text-gray-600">نشط</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
            <p className="text-sm text-gray-600">محظور</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{stats.admins}</p>
            <p className="text-sm text-gray-600">مشرفين</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">{stats.totalBookings}</p>
            <p className="text-sm text-gray-600">إجمالي الحجوزات</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">{stats.totalCancelled}</p>
            <p className="text-sm text-gray-600">حجوزات ملغية</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="ابحث بالاسم أو البريد أو الهاتف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-9"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="تصفية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل المستخدمين</SelectItem>
                <SelectItem value="active">النشط فقط</SelectItem>
                <SelectItem value="inactive">المحظورين</SelectItem>
                <SelectItem value="admin">المشرفين</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">👥</div>
              <p className="text-gray-500 text-lg">لا يوجد مستخدمين</p>
              <p className="text-gray-400 text-sm mt-2">حاول تغيير معايير البحث</p>
            </CardContent>
          </Card>
        ) : (
          filteredUsers.map((user) => (
            <Card key={user._id} className="hover:shadow-md transition">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <h3 className="text-lg font-bold">{user.name}</h3>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role === 'admin' ? 'مشرف' : 'مستخدم'}
                      </Badge>
                      <Badge variant={user.isActive ? 'success' : 'destructive'}>
                        {user.isActive ? (
                          <><CheckCircle className="w-3 h-3 ml-1" /> نشط</>
                        ) : (
                          <><XCircle className="w-3 h-3 ml-1" /> محظور</>
                        )}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <span dir="ltr">{user.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span>انضم: {new Date(user.createdAt).toLocaleDateString('ar-EG')}</span>
                      </div>
                    </div>

                    {/* Booking Stats */}
                    <div className="flex gap-4 mt-3 text-sm">
                      <span className="text-gray-600">
                        <span className="font-bold text-blue-600">{user.bookingsCount || 0}</span> حجز
                      </span>
                      {user.cancelledCount > 0 && (
                        <span className="text-gray-600">
                          <span className="font-bold text-red-600">{user.cancelledCount}</span> ملغي
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user)
                        setShowDetailsDialog(true)
                      }}
                    >
                      <Eye className="w-4 h-4 ml-2" />
                      تفاصيل
                    </Button>

                    {user.role !== 'admin' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleUserRole(user._id, user.role)}
                      >
                        <Shield className="w-4 h-4 ml-2" />
                        {/* @ts-expect-error - role can be 'admin' or 'user' from API */}
{user.role === 'admin' ? 'إزالة صلاحية' : 'ترقية لمشرف'}
                       
                      </Button>
                    )}
                    
                    <Button
                      variant={user.isActive ? 'destructive' : 'outline'}
                      size="sm"
                      onClick={() => toggleUserStatus(user._id, user.isActive)}
                    >
                      {user.isActive ? (
                        <>
                          <Ban className="w-4 h-4 ml-2" />
                          حظر
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-4 h-4 ml-2" />
                          إلغاء الحظر
                        </>
                      )}
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedUser(user)
                            setShowDetailsDialog(true)
                          }}
                        >
                          <Eye className="w-4 h-4 ml-2" />
                          عرض التفاصيل
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => {
                            setSelectedUser(user)
                            setShowDeleteDialog(true)
                          }}
                        >
                          <Trash2 className="w-4 h-4 ml-2" />
                          حذف المستخدم
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              تأكيد الحذف
            </DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف المستخدم "{selectedUser?.name}"؟
              <br />
              هذا الإجراء لا يمكن التراجع عنه.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              إلغاء
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => selectedUser && deleteUser(selectedUser._id)}
            >
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تفاصيل المستخدم</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">الاسم</p>
                  <p className="font-bold">{selectedUser.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                  <p className="font-bold">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">الهاتف</p>
                  <p className="font-bold" dir="ltr">{selectedUser.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">نوع الحساب</p>
                  <Badge variant={selectedUser.role === 'admin' ? 'default' : 'secondary'}>
                    {selectedUser.role === 'admin' ? 'مشرف' : 'مستخدم'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">الحالة</p>
                  <Badge variant={selectedUser.isActive ? 'success' : 'destructive'}>
                    {selectedUser.isActive ? 'نشط' : 'محظور'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">تاريخ الانضمام</p>
                  <p>{new Date(selectedUser.createdAt).toLocaleDateString('ar-EG')}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-bold mb-3">إحصائيات الحجوزات</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{selectedUser.bookingsCount || 0}</p>
                    <p className="text-sm text-gray-600">إجمالي الحجوزات</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {(selectedUser.bookingsCount || 0) - (selectedUser.cancelledCount || 0)}
                    </p>
                    <p className="text-sm text-gray-600">حجوزات مكتملة</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{selectedUser.cancelledCount || 0}</p>
                    <p className="text-sm text-gray-600">حجوزات ملغية</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}