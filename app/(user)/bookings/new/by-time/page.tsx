"use client";

import { useState, useMemo, useEffect } from "react";
import { format, addDays } from "date-fns";
import { ar } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { api } from '@/services/api';
import { Calendar, Clock, MapPin, Users, Bell, Check, X, Loader2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// توليد الأيام
const generateWeekDays = () => {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = addDays(today, i);
    let label = format(d, "EEEE, dd MMM", { locale: ar });

    if (i === 0) label = "اليوم";
    if (i === 1) label = "غدًا";

    return { label, date: d, fullDate: format(d, "yyyy-MM-dd") };
  });
};

// توليد الساعات (من 6 صباحاً لـ 2 صباحاً)
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 6; hour <= 26; hour++) {
    const displayHour = hour > 24 ? hour - 24 : hour;
    const period = hour >= 6 && hour < 12 ? "صباحاً" : 
                   hour >= 12 && hour < 18 ? "مساءً" : 
                   hour >= 18 && hour < 24 ? "ليلاً" : "صباحاً";
    
    slots.push({
      start: hour,
      display: `${displayHour}:00 ${period}`,
      fullDisplay: hour > 24 ? `${displayHour}:00 صباحاً (اليوم التالي)` : `${displayHour}:00 ${period}`,
      isNextDay: hour > 24
    });
  }
  return slots;
};

export default function QuickBookingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedDay, setSelectedDay] = useState(generateWeekDays()[0]);
  const [selectedStartHour, setSelectedStartHour] = useState<number | null>(null);
  const [duration, setDuration] = useState(1);
  const [allFields, setAllFields] = useState<any[]>([]);
  const [availableFields, setAvailableFields] = useState<any[]>([]);
  const [selectedField, setSelectedField] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [bookedSlots, setBookedSlots] = useState<Record<string, number[]>>({});

  const weekDays = useMemo(() => generateWeekDays(), []);
  const timeSlots = useMemo(() => generateTimeSlots(), []);

  // جلب المستخدم من localStorage
  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      setUser(JSON.parse(userStr))
    }
  }, [])

  // جلب كل الملاعب مرة واحدة عند تحميل الصفحة
  useEffect(() => {
    fetchAllFields();
  }, []);

  async function fetchAllFields() {
    try {
      const data = await api.getFields();
      setAllFields(data.fields || []);
    } catch (error) {
      console.error('Error fetching fields:', error);
    }
  }

  // جلب الحجوزات عند اختيار اليوم
  useEffect(() => {
    if (selectedDay) {
      fetchBookedSlots();
    }
  }, [selectedDay]);

  async function fetchBookedSlots() {
    try {
      const res = await fetch(`/api/bookings?date=${selectedDay.fullDate}`);
      const data = await res.json();
      
      // تجميع الأوقات المحجوزة لكل ملعب
      const booked: Record<string, number[]> = {};
      data.bookings?.forEach((booking: any) => {
        const startHour = parseInt(booking.startTime.split(':')[0]);
        if (!booked[booking.fieldId]) {
          booked[booking.fieldId] = [];
        }
        // إضافة كل ساعات الحجز
        for (let i = 0; i < booking.duration; i++) {
          booked[booking.fieldId].push(startHour + i);
        }
      });
      
      setBookedSlots(booked);
    } catch (error) {
      console.error('Error fetching booked slots:', error);
    }
  }

  // جلب الملاعب المتاحة عند اختيار الوقت
  useEffect(() => {
    if (selectedDay && selectedStartHour && allFields.length > 0) {
      filterAvailableFields();
    }
  }, [selectedDay, selectedStartHour, duration, allFields, bookedSlots]);

  function filterAvailableFields() {
    // فلترة الملاعب المتاحة
    const available = allFields.filter((field: any) => {
      const fieldBookedSlots = bookedSlots[field._id] || [];
      
      // التحقق من توفر كل ساعات المدة المختارة
      for (let i = 0; i < duration; i++) {
        const checkHour = selectedStartHour! + i;
        if (fieldBookedSlots.includes(checkHour)) {
          return false; // الساعة دي محجوزة
        }
      }
      return true; // كل الساعات متاحة
    });

    setAvailableFields(available);
  }

  const handleTimeSelect = (hour: number) => {
    setSelectedStartHour(hour);
    setStep(2);
  };

  const handleFieldSelect = (field: any) => {
    setSelectedField(field);
    setStep(3);
  };

  const handleConfirmBooking = async () => {
    if (!user) {
      router.push('/login?redirect=/bookings/quick');
      return;
    }

    try {
      const endHour = selectedStartHour! + duration;
      const endTime = endHour > 24 ? `${endHour - 24}:00` : `${endHour}:00`;
      
      const booking = {
        fieldId: selectedField._id,
        userId: user._id || user.id,
        date: selectedDay.fullDate,
        startTime: `${selectedStartHour}:00`,
        endTime: endTime,
        duration: duration,
        playersNeeded: 0,
        notes: 'حجز سريع'
      };

      await api.createBooking(booking);
      
      alert('✅ تم إنشاء الحجز بنجاح!');
      router.push('/my-bookings?success=true');
    } catch (error: any) {
      alert(error.message || 'حدث خطأ في إنشاء الحجز');
    }
  };

  const isTimeSlotAvailable = (hour: number) => {
    // لو مفيش ملاعب، الساعة مش متاحة
    if (allFields.length === 0) return false;
    
    // بنشوف هل في ملعب واحد على الأقل مش محجوز في الساعة دي
    return allFields.some(field => {
      const fieldBookedSlots = bookedSlots[field._id] || [];
      return !fieldBookedSlots.includes(hour);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24" dir="rtl">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button 
          onClick={() => step > 1 ? setStep(step - 1) : router.back()}
          className="text-2xl ml-4 hover:bg-gray-200 p-2 rounded-full transition"
        >
          ←
        </button>
        <h1 className="text-2xl font-bold">
          {step === 1 && "اختر الوقت المناسب"}
          {step === 2 && "اختر الملعب المتاح"}
          {step === 3 && "تأكيد الحجز"}
        </h1>
      </div>

      {/* Step 1: اختيار اليوم والوقت */}
      {step === 1 && (
        <>
          {/* Days Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {weekDays.map((day) => (
              <button
                key={day.label}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition
                  ${selectedDay.label === day.label
                    ? "bg-emerald-600 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100 border"}`}
              >
                {day.label}
              </button>
            ))}
          </div>

          {/* Time Slots */}
          <div className="space-y-2">
            {timeSlots.map((slot, idx) => {
              const isAvailable = isTimeSlotAvailable(slot.start);
              
              return (
                <button
                  key={idx}
                  onClick={() => isAvailable && handleTimeSelect(slot.start)}
                  disabled={!isAvailable}
                  className={`w-full p-4 rounded-xl flex items-center justify-between text-right transition
                    ${!isAvailable 
                      ? 'bg-red-50 text-gray-400 cursor-not-allowed' 
                      : selectedStartHour === slot.start
                      ? 'bg-emerald-600 text-white shadow-lg scale-[1.02]'
                      : 'bg-white hover:shadow-md border'}`}
                >
                  <div>
                    <Clock className={`w-5 h-5 inline ml-2 ${
                      !isAvailable ? 'text-red-300' : selectedStartHour === slot.start ? 'text-white' : 'text-gray-500'
                    }`} />
                    <span className="font-medium">{slot.fullDisplay}</span>
                    {slot.isNextDay && (
                      <Badge variant="outline" className="mr-2">اليوم التالي</Badge>
                    )}
                  </div>
                  
                  {!isAvailable && (
                    <Badge variant="destructive">محجوز</Badge>
                  )}
                  
                  {isAvailable && selectedStartHour === slot.start && (
                    <Check className="w-5 h-5" />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Step 2: عرض الملاعب المتاحة مع إمكانية اختيار المدة */}
      {step === 2 && (
        <>
          <div className="mb-4 p-4 bg-emerald-50 rounded-lg">
            <p className="text-emerald-800 font-medium">
              الوقت المختار: {selectedDay.label} - الساعة {selectedStartHour}:00
            </p>
            
            {/* اختيار المدة */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                مدة الحجز (حد أقصى 3 ساعات)
              </label>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDuration(Math.max(1, duration - 1))}
                  disabled={duration <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-xl font-bold w-12 text-center">{duration}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDuration(Math.min(3, duration + 1))}
                  disabled={duration >= 3}
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <span className="text-gray-600">ساعة</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                سيكون الحجز من {selectedStartHour}:00 إلى {selectedStartHour! + duration}:00
                {selectedStartHour! + duration > 24 && ' (اليوم التالي)'}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
          ) : availableFields.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">لا توجد ملاعب متاحة في هذا الوقت</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setStep(1)}
                >
                  اختيار وقت آخر
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {availableFields.map((field) => (
                <Card 
                  key={field._id} 
                  className="hover:shadow-lg transition cursor-pointer hover:border-emerald-500"
                  onClick={() => handleFieldSelect(field)}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold">{field.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <MapPin className="w-4 h-4" />
                          <span>{field.location}</span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-lg">
                        {field.price} ج/ساعة
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                        {field.type}
                      </span>
                      <span className="text-sm bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                        متاح {duration} ساعات
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Step 3: تأكيد الحجز */}
      {step === 3 && selectedField && (
        <>
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">ملخص الحجز</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-gray-600">الملعب:</span>
                  <span className="font-bold text-lg">{selectedField.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الموقع:</span>
                  <span>{selectedField.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">التاريخ:</span>
                  <span className="font-medium">{selectedDay.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الوقت:</span>
                  <span className="font-medium">
                    {selectedStartHour}:00 - {selectedStartHour! + duration}:00
                    {selectedStartHour! + duration > 24 && ' (اليوم التالي)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">المدة:</span>
                  <span>{duration} {duration === 1 ? 'ساعة' : 'ساعات'}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-gray-600">السعر الإجمالي:</span>
                  <span className="text-2xl font-bold text-emerald-600">
                    {selectedField.price * duration} ج
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {!user ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="mb-4">يجب تسجيل الدخول أولاً</p>
                <Link href="/login?redirect=/bookings/quick">
                  <Button className="w-full">تسجيل الدخول</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep(2)}
              >
                رجوع
              </Button>
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                onClick={handleConfirmBooking}
              >
                <Check className="w-4 h-4 ml-2" />
                تأكيد الحجز
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}