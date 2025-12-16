import { NextRequest, NextResponse } from 'next/server';
import { getExperiences, createExperience, updateExperience, deleteExperience } from '@/lib/db';

// GET all experiences
export async function GET() {
  try {
    const experiences = await getExperiences();
    return NextResponse.json(experiences);
  } catch (error) {
    console.error('Get experiences error:', error);
    return NextResponse.json({ error: 'Failed to read experiences' }, { status: 500 });
  }
}

// POST new experience
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newExperience = await createExperience(body);
    return NextResponse.json(newExperience, { status: 201 });
  } catch (error) {
    console.error('Create experience error:', error);
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 });
  }
}

// PUT update experience
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const experience = await updateExperience(body.id, body);
    
    if (!experience) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }
    
    return NextResponse.json(experience);
  } catch (error) {
    console.error('Update experience error:', error);
    return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 });
  }
}

// DELETE experience
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const success = await deleteExperience(id);

    if (!success) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete experience error:', error);
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 });
  }
}
