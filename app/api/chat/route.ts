import { NextResponse } from "next/server";

// Mock LMS data (replace with your actual course details if needed)
const lmsData = {
  courses: [
    { name: "Python Basics", description: "Learn Python programming fundamentals", duration: "8 weeks" },
    { name: "Web Development", description: "Build web apps with HTML, CSS, JavaScript", duration: "12 weeks" },
    { name: "Data Science", description: "Introduction to data analysis with Python", duration: "10 weeks" },
    { name: "MERN", description: "Introduction to MERN full stack", duration: "10 weeks" },
    { name: "PhotoGraphy", description: "Introduction to Photography", duration: "10 weeks" },
    { name: "Fitness", description: "Fit & fine ", duration: "10 weeks" },
    { name: "Data Structure", description: "Introduction to data structure using java", duration: "10 weeks" },
    { name: "Accountancy", description: "Introduction to Accounts", duration: "10 weeks" },
    { name: "Java Programming", description: "Learn Java for backend development", duration: "10 weeks" },
    { name: "AI Basics", description: "Introduction to artificial intelligence", duration: "6 weeks" },
  ],
  helpDocs: {
    "reset password": "Go to LMS Settings > Account > Reset Password to reset your password.",
    "submit assignment": "Navigate to the course page, find the assignment, and click 'Submit'.",
    "access course": "Go to the Dashboard, select 'My Courses', and click on the course name.",
  },
};

// Helper to classify query intent (simple keyword-based)
function classifyIntent(query: string): string {
  const lowerQuery = query.toLowerCase();
  // Teacher course idea
  if (
    lowerQuery.includes("course idea") ||
    lowerQuery.includes("suggest course") ||
    lowerQuery.includes("new course") ||
    lowerQuery.includes("teacher") ||
    lowerQuery.includes("create course")
  ) {
    return "course_idea";
  }
  // Topic overview
  if (
    lowerQuery.startsWith("what is ") ||
    lowerQuery.startsWith("tell me about ") ||
    lowerQuery.startsWith("explain ") ||
    lowerQuery.match(/(java|python|mern|photography|fitness|accountancy|ai|data science|data structure)/)
  ) {
    return "topic_overview";
  }
  if (lowerQuery.includes("course") || lowerQuery.includes("syllabus") || lowerQuery.includes("learn")) {
    return "course";
  }
  if (lowerQuery.includes("password") || lowerQuery.includes("submit") || lowerQuery.includes("access")) {
    return "lms_help";
  }
  return "general";
}

// Helper to find relevant courses for a topic
function findRelevantCourses(topic: string) {
  const lowerTopic = topic.toLowerCase();
  return lmsData.courses.filter(course =>
    course.name.toLowerCase().includes(lowerTopic) ||
    course.description.toLowerCase().includes(lowerTopic)
  );
}

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: { message: "Please provide a message" } },
        { status: 400 }
      );
    }

    console.log(`API call made at ${new Date().toISOString()} with message: ${message}`);

    // Classify query intent
    const intent = classifyIntent(message);

    // Craft prompt based on intent
    let prompt = "";
    switch (intent) {
      case "course":
        prompt = `
          You are a chatbot for an LMS platform. Your role is to guide students on course selection and provide course information.
          Available courses: ${JSON.stringify(lmsData.courses)}.
          Provide clear and concise guidance based on the query: "${message}"
        `;
        break;
      case "lms_help":
        prompt = `
          You are a chatbot for an LMS platform. Use the following help documentation to assist with LMS-related queries:
          ${JSON.stringify(lmsData.helpDocs)}.
          Respond concisely to the query: "${message}"
        `;
        break;
      case "topic_overview": {
        // Extract topic from message
        let topic = message;
        const topicMatch = message.match(/about (.+)$/i) || message.match(/what is (.+)$/i) || message.match(/explain (.+)$/i);
        if (topicMatch && topicMatch[1]) {
          topic = topicMatch[1].trim();
        }
        const relevantCourses = findRelevantCourses(topic);
        prompt = `
          You are a helpful LMS chatbot. Give a brief, beginner-friendly overview of the topic "${topic}" (max 3 sentences).
          Then, if any relevant courses are available, recommend them from this list: ${JSON.stringify(relevantCourses.length ? relevantCourses : lmsData.courses)}.
          Query: "${message}"
        `;
        break;
      }
      case "course_idea":
        prompt = `
          You are an LMS assistant for teachers. The teacher is looking for creative new course ideas.
          Suggest 2-3 innovative course ideas (with a short description for each) that could be added to the LMS platform.
          Query: "${message}"
        `;
        break;
      case "general":
        prompt = `
          You are a chatbot for an LMS platform. Answer the student's general academic or LMS-related doubt clearly and concisely.
          If relevant, use this course information for context: ${JSON.stringify(lmsData.courses)}.
          Query: "${message}"
        `;
        break;
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: intent === "course" || intent === "course_idea" ? 0.8 : 0.7,
            maxOutputTokens: intent === "lms_help" ? 50 : 150,
          },
        }),
      }
    );

    const data = await response.json();

    if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return NextResponse.json({ text: data.candidates[0].content.parts[0].text });
    } else {
      return NextResponse.json(
        { error: { message: data.error?.message || "No response from Gemini API" } },
        { status: response.status }
      );
    }
  } catch (err) {
    console.error("Error calling Gemini API:", err);
    return NextResponse.json(
      { error: { message: "Something went wrong. Please try again." } },
      { status: 500 }
    );
  }
}