"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TimeSlotPicker from "@/components/booking/TimeSlotPicker";
import AvailabilityCalendar from "@/components/booking/AvailabilityCalendar";
import {
  Loader2, Users, Shield, AlertCircle, Calendar,
  MapPin, Star, Wifi, Coffee, Car, ChevronRight
} from "lucide-react";

export default function FieldDetailsPage() {
  const params = useParams();
  const fieldId = params.id as string;
  const router = useRouter();

  const [field, setField] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [bookedSlotsForDay, setBookedSlotsForDay] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<{
    start: string;
    end: string;
    duration: number;
  } | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) setUser(JSON.parse(userStr));
  }, []);

  useEffect(() => {
    if (fieldId) loadField();
  }, [fieldId]);

  useEffect(() => {
    setSelectedTime(null);
  }, [selectedDate]);

  async function loadField() {
    try {
      setLoading(true);
      const data = await api.getField(fieldId);
      if (data?.field) {
        setField(data.field);
      } else {
        setError("الملعب غير موجود");
      }
    } catch (err: any) {
      setError(err.message || "حدث خطأ في جلب بيانات الملعب");
    } finally {
      setLoading(false);
    }
  }

  function handleDateSelect(date: Date) {
    setSelectedDate(date);
    setBookedSlotsForDay([]);
  }

  function handleTimeSelect(start: string, end: string, duration: number) {
    setSelectedTime({ start, end, duration });
  }

  function handleBookedSlotsUpdate(bookedSlots: string[]) {
    setBookedSlotsForDay(bookedSlots);
  }

  function handleBooking() {
    if (!selectedTime || !field) return;

    // ✅ استخدم التاريخ المحلي مش UTC
    const d = selectedDate;
    const dateStr = [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, '0'),
      String(d.getDate()).padStart(2, '0'),
    ].join('-');

    const bookingData = {
      fieldId: field._id,
      fieldName: field.name,
      date: dateStr,
      startTime: selectedTime.start,
      endTime: selectedTime.end,
      duration: selectedTime.duration,
    };

    localStorage.setItem("pendingBooking", JSON.stringify(bookingData));
    router.push("/bookings/new");
  }

  function handleCreateMatch() {
    if (!selectedTime || !field) return;

    const d = selectedDate;
    const dateStr = [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, '0'),
      String(d.getDate()).padStart(2, '0'),
    ].join('-');

    const matchData = {
      fieldId: field._id,
      fieldName: field.name,
      fieldLocation: field.location,
      date: dateStr,
      startTime: selectedTime.start,
      endTime: selectedTime.end,
      duration: selectedTime.duration,
    };

    localStorage.setItem("pendingMatch", JSON.stringify(matchData));
    router.push("/matches/create");
  }

  const amenitiesIcons: Record<string, { icon: React.ReactNode; label: string }> = {
    wifi:    { icon: <Wifi    className="w-5 h-5" />, label: "واي فاي"       },
    cafe:    { icon: <Coffee  className="w-5 h-5" />, label: "كافيتريا"      },
    parking: { icon: <Car     className="w-5 h-5" />, label: "موقف سيارات"  },
    secure:  { icon: <Shield  className="w-5 h-5" />, label: "أمان"          },
  };

  const isAdmin = user?.role === 'admin';

  // ✅ الأدمن يقدر يحجز أي عدد ساعات (24 = اليوم كله)
  const maxDuration = isAdmin ? 24 : 3;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل بيانات الملعب...</p>
        </div>
      </div>
    );
  }

  if (error || !field) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-red-50 p-8 rounded-2xl max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4 text-lg">{error || "الملعب غير موجود"}</p>
          <Link href="/fields"><Button>العودة للملاعب</Button></Link>
        </div>
      </div>
    );
  }

  const totalPrice = selectedTime ? field.price * selectedTime.duration : null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">الرئيسية</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/fields" className="hover:text-blue-600">الملاعب</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 font-medium">{field.name}</span>
      </div>

      {/* Admin Banner */}
      {isAdmin && (
        <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600" />
            <span className="text-purple-800 font-medium">
              وضع الإدارة — يمكنك الحجز بأي عدد ساعات وعرض جميع الحجوزات
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/admin/bookings')}
            className="border-purple-300 text-purple-700"
          >
            إدارة الحجوزات
          </Button>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          <div className="h-80 bg-gradient-to-br from-green-100 via-blue-50 to-green-200 rounded-2xl relative flex items-center justify-center overflow-hidden">
            <span className="text-6xl">⚽</span>
            <div className="absolute top-4 left-4">
              <Badge className="text-base bg-white text-blue-700 shadow">
                {field.price} ج/ساعة
              </Badge>
            </div>
            <div className="absolute top-4 right-4">
              <Badge variant={field.status === 'active' ? 'default' : 'destructive'}>
                {field.status === 'active' ? '● نشط' : '● مغلق'}
              </Badge>
            </div>
          </div>

          {/* Field Info */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{field.name}</h1>
                  <div className="flex flex-wrap gap-4 text-gray-600 text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <span>{field.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{field.rating || 4.5} ({field.reviews || 0} تقييم)</span>
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {field.type}
                </Badge>
              </div>

              <p className="text-gray-600 leading-relaxed mb-6">
                {field.description || "ملعب كرة قدم متميز بأعلى المواصفات"}
              </p>

              {field.amenities?.length > 0 && (
                <div>
                  <h3 className="font-bold mb-3 text-gray-800">المرافق والخدمات</h3>
                  <div className="flex flex-wrap gap-3">
                    {field.amenities.map((amenity: string) => (
                      <div key={amenity} className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl text-sm">
                        {amenitiesIcons[amenity]?.icon}
                        <span>{amenitiesIcons[amenity]?.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-5">احجز الآن</h2>

              <Tabs defaultValue="calendar" className="space-y-4">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="calendar">📅 اختر اليوم</TabsTrigger>
                  <TabsTrigger value="slots">🕐 اختر الوقت</TabsTrigger>
                </TabsList>

                <TabsContent value="calendar">
                  <AvailabilityCalendar
                    fieldId={fieldId}
                    selectedDate={selectedDate}
                    onDateSelect={handleDateSelect}
                  />
                </TabsContent>

                <TabsContent value="slots">
                  <TimeSlotPicker
                    selectedDate={selectedDate}
                    fieldId={fieldId}
                    onSelectTime={handleTimeSelect}
                    maxDuration={maxDuration}
                    isAdmin={isAdmin}
                    onBookedSlotsUpdate={handleBookedSlotsUpdate}
                  />
                </TabsContent>
              </Tabs>

              {/* ملخص الحجز */}
              {selectedTime && (
                <div className="mt-5 space-y-3">
                  <div className="bg-gradient-to-br from-blue-50 to-green-50 border border-blue-200 rounded-2xl p-4">
                    <h3 className="font-bold text-gray-800 mb-3">ملخص الحجز</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">اليوم:</span>
                        <span className="font-medium">
                          {selectedDate.toLocaleDateString("ar-EG", {
                            weekday: 'short', month: 'short', day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">الوقت:</span>
                        <span className="font-medium">{selectedTime.start} - {selectedTime.end}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">المدة:</span>
                        <span className="font-medium">{selectedTime.duration} ساعة</span>
                      </div>
                      <div className="flex justify-between border-t pt-2 mt-2">
                        <span className="text-gray-700 font-medium">الإجمالي:</span>
                        <span className="text-xl font-black text-blue-600">{totalPrice} ج</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-l from-blue-600 to-green-600 text-white font-bold py-3"
                    onClick={handleBooking}
                    disabled={!user}
                  >
                    <Calendar className="w-4 h-4 ml-2" />
                    {user ? 'تأكيد الحجز' : 'سجل دخول للحجز'}
                  </Button>

                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={handleCreateMatch}
                    disabled={!user}
                  >
                    <Users className="w-4 h-4 ml-2" />
                    إنشاء مباراة مع لاعبين
                  </Button>

                  {!user && (
                    <p className="text-center text-sm text-gray-500">
                      <Link href={`/login?redirect=/fields/${fieldId}`} className="text-blue-600 hover:underline">
                        سجل الدخول
                      </Link>
                      {' '}لتتمكن من الحجز
                    </p>
                  )}
                </div>
              )}

              {!selectedTime && (
                <div className="mt-4 text-center text-sm text-gray-400 bg-gray-50 rounded-xl p-4">
                  <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  اختر يوم ووقت للحجز
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}