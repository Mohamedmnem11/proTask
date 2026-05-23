"use client"

import { useState } from "react"

import FieldCard from "./FieldCard" 

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, SlidersHorizontal, X } from "lucide-react"

interface FieldGridProps {
  fields: any[]
}

const FieldGrid = ({ fields }: FieldGridProps) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("default")
  const [filterType, setFilterType] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  // تصفية الملاعب حسب البحث
  const filteredFields = fields.filter((field) => {
    const matchesSearch = field.name.includes(searchTerm) || 
                         field.location.includes(searchTerm)
    const matchesType = filterType === "all" || field.type === filterType
    return matchesSearch && matchesType
  })

  // ترتيب الملاعب
  const sortedFields = [...filteredFields].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price
    if (sortBy === "price-desc") return b.price - a.price
    if (sortBy === "rating") return b.rating - a.rating
    return 0
  })

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="ابحث عن ملعب..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-9"
            />
          </div>

          {/* Filter Button (Mobile) */}
          <Button
            variant="outline"
            className="lg:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-4 h-4 ml-2" />
            فلتر
          </Button>

          {/* Filters (Desktop) */}
          <div className="hidden lg:flex gap-4">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="نوع الملعب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                <SelectItem value="عشب طبيعي">عشب طبيعي</SelectItem>
                <SelectItem value="نجيل صناعي">نجيل صناعي</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="ترتيب حسب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">الأحدث</SelectItem>
                <SelectItem value="price-asc">السعر: من الأقل</SelectItem>
                <SelectItem value="price-desc">السعر: من الأعلى</SelectItem>
                <SelectItem value="rating">التقييم</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Mobile Filters */}
        {showFilters && (
          <div className="mt-4 lg:hidden space-y-4 pt-4 border-t">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="نوع الملعب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                <SelectItem value="عشب طبيعي">عشب طبيعي</SelectItem>
                <SelectItem value="نجيل صناعي">نجيل صناعي</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="ترتيب حسب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">الأحدث</SelectItem>
                <SelectItem value="price-asc">السعر: من الأقل</SelectItem>
                <SelectItem value="price-desc">السعر: من الأعلى</SelectItem>
                <SelectItem value="rating">التقييم</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          {sortedFields.length} ملعب متاح
          {searchTerm && ` مطابق لـ "${searchTerm}"`}
        </div>
      </div>

      {/* Fields Grid */}
      {sortedFields.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedFields.map((field) => (
            <FieldCard key={field._id} field={field} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg">
          <div className="text-gray-400 mb-4">🔍</div>
          <h3 className="text-xl font-bold mb-2">لا توجد نتائج</h3>
          <p className="text-gray-600">
            لم نجد أي ملاعب تطابق بحثك. جرب كلمات أخرى.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchTerm("")
              setFilterType("all")
              setSortBy("default")
            }}
          >
            <X className="w-4 h-4 ml-2" />
            إعادة ضبط الفلتر
          </Button>
        </div>
      )}
    </div>
  )
}

export default FieldGrid