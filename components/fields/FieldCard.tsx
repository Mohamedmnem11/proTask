"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Clock, Users, Wifi, Coffee, Car, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

interface FieldCardProps {
  field: {
    _id: string
    name: string
    location: string
    price: number
    rating?: number
    image?: string
    type: string
    reviews?: number
    amenities?: string[]
    isAvailable?: boolean
  }
  variant?: "default" | "compact"
}

const FieldCard = ({ field, variant = "default" }: FieldCardProps) => {
  const amenitiesIcons: Record<string, React.ReactNode> = {
    "wifi": <Wifi className="w-3 h-3" />,
    "cafe": <Coffee className="w-3 h-3" />,
    "parking": <Car className="w-3 h-3" />,
    "secure": <Shield className="w-3 h-3" />,
  }

  if (variant === "compact") {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition group">
        <div className="flex">
          <div className="w-24 h-24 bg-gray-200 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
          <CardContent className="flex-1 p-3">
            <h3 className="font-bold group-hover:text-blue-600 transition line-clamp-1">
              {field.name}
            </h3>
            <div className="flex items-center gap-1 text-gray-600 text-xs mb-1">
              <MapPin className="w-3 h-3" />
              <span className="line-clamp-1">{field.location}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-bold">{field.rating}</span>
              </div>
              <span className="text-sm font-bold text-blue-600">
                {field.price} ج
              </span>
            </div>
          </CardContent>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all group">
      <div className="relative h-48 bg-gray-200">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 z-20">
          <Badge variant="success" className="gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            {field.rating} ({field.reviews})
          </Badge>
        </div>

        {/* Type Badge */}
        <div className="absolute top-3 left-3 z-20">
          <Badge variant="secondary">{field.type}</Badge>
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-3 right-3 z-20">
          <div className="bg-blue-600 text-white px-3 py-1 rounded-lg font-bold">
            {field.price} ج/ساعة
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition line-clamp-1">
          {field.name}
        </h3>
        
        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="text-sm line-clamp-1">{field.location}</span>
        </div>

        {/* Amenities */}
        {field.amenities && field.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {field.amenities.map((amenity) => (
              <div
                key={amenity}
                className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md text-xs text-gray-600"
              >
                {amenitiesIcons[amenity]}
                <span>
                  {amenity === "wifi" && "واي فاي"}
                  {amenity === "cafe" && "كافيتريا"}
                  {amenity === "parking" && "موقف سيارات"}
                  {amenity === "secure" && "أمان"}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Availability Indicator */}
        <div className="flex items-center gap-2 mb-4">
          <div className={cn(
            "w-2 h-2 rounded-full",
            field.isAvailable ? "bg-green-500" : "bg-red-500"
          )} />
          <span className="text-sm text-gray-600">
            {field.isAvailable ? "متاح اليوم" : "محجوز بالكامل اليوم"}
          </span>
        </div>

        <Link href={`/fields/${field._id}`}>
          <Button className="w-full group">
            عرض التفاصيل
            <Clock className="w-4 h-4 mr-2 group-hover:translate-x-1 transition" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

export default FieldCard