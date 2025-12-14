// app/api/chatbot/route.ts
import { NextResponse } from "next/server";
import { getCourses } from "@/actions/get-courses"; 

import { auth } from "@clerk/nextjs/server"; 

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: { message: "Please provide a valid message" } },
        { status: 400 }
      );
    }

    const { userId } = auth(); 

    if (!userId) {
      return NextResponse.json(
        { error: { message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const courses = await getCourses({
      userId,
    });

   
   const formattedCourses = courses.map((course) => ({
  id: course.id,
  title: course.title,
  description: course.description || "No description available.",
  category: course.category?.name || "Uncategorized",
  chapterCount: course.chapters.length,
  progress: course.progress !== null ? `${course.progress.toFixed(0)}%` : "Not started",
  isPurchased: course.progress !== null,
  price: typeof course.price === "number" ? course.price : 0,
  priceLabel: typeof course.price === "number" && course.price > 0
    ? `₹${course.price}`
    : "Free"
}));


    // Improved intent classification using real course titles
    const classifyIntent = (query: string): string => {
      const lowerQuery = query.toLowerCase();

      // Course idea for teachers
      if (/(course idea|suggest course|new course|create course|teacher)/i.test(lowerQuery)) {
        return "course_idea";
      }

      // Topic overview
      if (/^(what is|tell me about|explain)/i.test(lowerQuery)) {
        return "topic_overview";
      }

      // Specific course inquiry
      const matchedCourse = formattedCourses.find(
        (c) => c.title.toLowerCase().includes(lowerQuery) || lowerQuery.includes(c.title.toLowerCase())
      );
      if (matchedCourse || /course|syllabus|learn|chapter|progress/i.test(lowerQuery)) {
        return "course_inquiry";
      }

      // LMS navigation help
      if (/(password|login|submit|assignment|access|dashboard|profile)/i.test(lowerQuery)) {
        return "lms_help";
      }

      return "general";
    };

    const intent = classifyIntent(message);

    // Extract potential topic
    let topic = message;
    const topicMatch = message.match(/(?:what is|about|explain)\s+(.+)/i);
    if (topicMatch) topic = topicMatch[1].trim();

    // Find relevant courses
    const relevantCourses = formattedCourses.filter(
      (course) =>
        course.title.toLowerCase().includes(topic.toLowerCase()) ||
        course.description.toLowerCase().includes(topic.toLowerCase()) ||
        course.category.toLowerCase().includes(topic.toLowerCase())
    
    );

   const coursesToUse = (
  relevantCourses.length > 0 ? relevantCourses : formattedCourses
).slice(0, 5);


    let prompt = "";

    switch (intent) {
      case "course_inquiry":
        prompt = `
You are a friendly and helpful chatbot for an online learning platform (LMS).
Help the student find or learn about courses based on their query.

Available courses (with progress for this user):
${JSON.stringify(coursesToUse, null, 2)}

User query: "${message}"

Respond naturally and conversationally. 
-- Recommend relevant courses with title, description, category, price, chapter count, and progress.

- If they ask about a specific course, give details.
- Suggest alternatives if no exact match.
- Encourage enrollment if not purchased.
Keep response under 200 words.
        `;
        break;

      case "topic_overview":
        prompt = `
You are an educational assistant. 
Give a short, beginner-friendly explanation (2-3 sentences) of the topic: "${topic}"

Then, recommend relevant courses from this list (if any match):
${JSON.stringify(coursesToUse, null, 2)}

User asked: "${message}"
        `;
        break;

      case "lms_help":
        prompt = `
You are a support chatbot for the LMS platform.
Common help topics:
- Reset password: Go to Profile > Settings > Change Password
- Submit assignment: In course > chapter > assignment section > Upload
- Access courses: Go to Dashboard > My Courses
- View progress: On course page or dashboard

Answer the user's question clearly and step-by-step:
"${message}"
        `;
        break;

      case "course_idea":
        prompt = `
You are an expert curriculum designer helping teachers create new courses.
Suggest 3 creative, in-demand course ideas (title + short description) that would fit well on this LMS platform.
Consider current courses to avoid duplication:
${formattedCourses.map(c => c.title).join(", ")}

User query: "${message}"
        `;
        break;

      default:
        prompt = `
You are a helpful chatbot for an online learning platform.
Use the following course information to assist the student:
${JSON.stringify(coursesToUse.slice(0, 10), null, 2)}  

Answer clearly and friendly to: "${message}"
        `;
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY not set");
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" + GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: intent === "course_idea" ? 0.9 : 0.7,
            maxOutputTokens: 800,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);
      throw new Error(data.error?.message || "LLM API error");
    }

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a response right now.";

    return NextResponse.json({ text: text.trim() });

  } catch (error: any) {
    console.error("Chatbot error:", error);
    return NextResponse.json(
      { error: { message: "Something went wrong. Please try again later." } },
      { status: 500 }
    );
  }
}