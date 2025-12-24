import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { getBlogsAsync, createBlog } from '@/lib/data';

export async function GET() {
  try {
    const blogs = await getBlogsAsync();
    return NextResponse.json(blogs);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const blog = await createBlog(data);
    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    );
  }
}

