"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Edit, 
  Trash2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock as ClockIcon
} from "lucide-react"
import { cn } from "@/lib/utils"

interface BookingCardProps {
  booking: {
    id: number
    fieldName: string
    fieldLocation: string
    date: string
    startTime: string
    endTime: string
    status: "confirmed" | "cancelled" | "completed" | "pending"
    playersNeeded?: number
    playersJoined?: number
    canCancel?: boolean
    canEdit?: boolean
  }
  onCancel?: (id: number) => void
  onEdit?: (id: number) => void
}

const BookingCard = ({ booking, onCancel, onEdit }: BookingCardProps) => {
  const statusConfig = {
    confirmed: {
      label: "مؤكد",
      color: "bg-green-100 text-green-800",
      icon: CheckCircle
    },
    pending: {
      label: "قيد الانتظار",
      color: "bg-yellow-100 text-yellow-800",
      icon: ClockIcon
    },
    cancelled: {
      label: "ملغي",
      color: "bg-red-100 text-red-800",
      icon: XCircle
    },
    completed: {
      label: "منتهي",
      color: "bg-gray-100 text-gray-800",
      icon: CheckCircle
    }
  }

  const StatusIcon = statusConfig[booking.status].icon

  return (
    <Card className="hover:shadow-lg transition overflow-hidden">
      <div className={cn(
        "h-1",
        booking.status === "confirmed" && "bg-green-500",
        booking.status === "pending" && "bg-yellow-500",
        booking.status === "cancelled" && "bg-red-500",
        booking.status === "completed" && "bg-gray-500"
      )} />
      
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Main Info */}
          <div className="space-y-3 flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold mb-1">{booking.fieldName}</h3>
                <div className="flex items-center gap-1 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{booking.fieldLocation}</span>
                </div>
              </div>
              <Badge className={cn("gap-1", statusConfig[booking.status].color)}>
                <StatusIcon className="w-3 h-3" />
                {statusConfig[booking.status].label}
              </Badge>
            </div>

            {/* Date & Time */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{booking.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{booking.startTime} - {booking.endTime}</span>
              </div>
            </div>

            {/* Players Info (if needed) */}
            {booking.playersNeeded && booking.playersNeeded > 0 && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-sm">
                  {booking.playersJoined || 0}/{booking.playersNeeded} لاعبين
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          {(booking.status === "confirmed" || booking.status === "pending") && (
            <div className="flex gap-2 md:flex-col">
              {booking.canEdit && onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(booking.id)}
                  className="gap-2"
                >
                  <Edit className="w-4 h-4" />
                  تعديل
                </Button>
              )}
              {booking.canCancel && onCancel && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onCancel(booking.id)}
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  إلغاء
                </Button>
              )}
            </div>
          )}

          {/* View Details Link */}
          <Link 
            href={`/bookings/${booking.id}`}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium whitespace-nowrap"
          >
            عرض التفاصيل ←
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default BookingCard