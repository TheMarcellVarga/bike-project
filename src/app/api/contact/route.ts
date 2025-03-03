import { NextResponse } from "next/server";

// This is a simple mock implementation
// In a real app, you would send emails, store in database, etc.
export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { name, email, subject, message } = body;
    
    // Validate the required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Send an email notification
    // 2. Store the contact request in a database
    // 3. Maybe send a confirmation email to the user
    
    console.log("Contact form submission:", { name, email, subject, message });
    
    // Return a success response
    return NextResponse.json(
      { 
        success: true, 
        message: "Thank you for contacting us! We'll get back to you soon." 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Failed to process contact form submission" },
      { status: 500 }
    );
  }
} 