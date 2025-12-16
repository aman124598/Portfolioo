import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const experiencesFile = path.join(dataDir, 'experiences.json');

// Ensure data directory and file exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(experiencesFile)) {
  fs.writeFileSync(experiencesFile, '[]');
}

// GET all experiences
export async function GET() {
  try {
    const data = fs.readFileSync(experiencesFile, 'utf-8');
    const experiences = JSON.parse(data);
    
    // Sort by current first, then by start date (latest first)
    experiences.sort((a: any, b: any) => {
      if (a.current && !b.current) return -1;
      if (!a.current && b.current) return 1;
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });
    
    return NextResponse.json(experiences);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read experiences' }, { status: 500 });
  }
}

// POST new experience
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = fs.readFileSync(experiencesFile, 'utf-8');
    const experiences = JSON.parse(data);

    const newExperience = {
      ...body,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    experiences.push(newExperience);
    fs.writeFileSync(experiencesFile, JSON.stringify(experiences, null, 2));

    return NextResponse.json(newExperience, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 });
  }
}

// PUT update experience
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const data = fs.readFileSync(experiencesFile, 'utf-8');
    const experiences = JSON.parse(data);

    const index = experiences.findIndex((e: any) => e.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }

    experiences[index] = {
      ...experiences[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    fs.writeFileSync(experiencesFile, JSON.stringify(experiences, null, 2));
    return NextResponse.json(experiences[index]);
  } catch (error) {
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

    const data = fs.readFileSync(experiencesFile, 'utf-8');
    const experiences = JSON.parse(data);

    const filteredExperiences = experiences.filter((e: any) => e.id !== id);

    if (filteredExperiences.length === experiences.length) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }

    fs.writeFileSync(experiencesFile, JSON.stringify(filteredExperiences, null, 2));
    return NextResponse.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 });
  }
}
