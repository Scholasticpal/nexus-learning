import { Category, Course } from '@prisma/client'

import { CourseCard } from '@/components/course-card'
import { BookOpen } from 'lucide-react'

type CourseWithProgressWithCategory = Course & {
  category: Category | null
  chapters: { id: string }[]
  progress: number | null
  purchases: { id: string }[]
}

interface CoursesListProps {
  items: CourseWithProgressWithCategory[]
}

export const CoursesList = ({ items }: CoursesListProps) => {
  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <CourseCard
            key={item.id}
            id={item.id}
            title={item.title}
            imageUrl={item.imageUrl!}
            chaptersLength={item.chapters.length}
            price={item.price!}
            progress={item.progress}
            category={item?.category?.name!}
            isPurchased={item.purchases.length > 0}
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10 flex flex-col items-center justify-center space-y-2">
          <BookOpen className="h-10 w-10 text-slate-300" />
          <p>No courses found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
