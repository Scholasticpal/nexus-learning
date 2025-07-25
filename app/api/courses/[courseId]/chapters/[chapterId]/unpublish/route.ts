import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

import { db } from '@/lib/db'
import { isTeacher } from '@/lib/teacher'

export async function PATCH(
  req: Request,
  { params: paramsPromise }: { params: Promise<{ courseId: string; chapterId: string }> },
) {
  const params = await paramsPromise
  try {
    const { userId } = await auth()

    if (!userId || !isTeacher(userId)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const course = await db.course.findUnique({
      where: { id: params.courseId },
    })

    if (!course) {
      return new NextResponse('Not Found', { status: 404 })
    }

    if (course.userId !== userId && !(isTeacher(userId) && course.isPublished)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    const unpublishedChapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        isPublished: false,
      },
    })

    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true,
      },
    })

    if (!publishedChaptersInCourse.length) {
      await db.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false,
        },
      })
    }

    return NextResponse.json(unpublishedChapter)
  } catch (error) {
    console.log('[CHAPTER_UNPUBLISH]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
