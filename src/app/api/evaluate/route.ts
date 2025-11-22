import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // We expect the incoming request to be FormData
    const formData = await request.formData();

    // Create a new FormData object to forward to the external API
    const externalFormData = new FormData();

    // Append files from the incoming request to the new FormData
    const files = formData.getAll('files'); // 'files' is the key used in the client component
    files.forEach(file => {
      if (file instanceof File) {
        externalFormData.append('files', file, file.name);
      }
    });

    // Append rubrics (which is a string in this simplified example)
    const rubrics = formData.get('rubrics');
    if (rubrics) {
      externalFormData.append('rubrics', rubrics.toString());
    }

    // Forward the request to your actual backend
    const backendResponse = await fetch('https://navanihk-wemakedev.hf.space/evaluate', {
      method: 'POST',
      body: externalFormData, // No need to set Content-Type; FormData handles it
    });

    // Handle response from your backend
    if (backendResponse.ok) {
      const data = await backendResponse.json();
      return NextResponse.json(data, { status: 200 });
    } else {
      const errorText = await backendResponse.text();
      return NextResponse.json(
        { message: `External backend error: ${errorText || backendResponse.statusText}` },
        { status: backendResponse.status }
      );
    }
  } catch (error: any) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { message: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}