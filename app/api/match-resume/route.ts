export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // const supabase = await createClient();

  // const {
  //   data: { user },
  //   error: userError,
  // } = await supabase.auth.getUser();
  // if (userError) {
  //   console.error("Error fetching user:", userError);
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }
  // if (!user) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  const formData = await request.formData();
  const file = formData.get("resume") as File | null;
  const jobDescription = formData.get("job_description") as string;

  if (!file || !jobDescription) {
    return NextResponse.json(
      { error: "Resume file and job description are missing." },
      { status: 400 }
    );
  }

  try {
    const fileBuffer = await file.arrayBuffer();

    const aiResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an AI assistant that evaluates how well a resume matches a job description.
                    Return a score out of 100.
                    
                    Job Description:
                    ${jobDescription}
                    Resume (file content is attached):
                    
                    Make sure to analyze the resume content thoroughly and provide an accurate score based on the job description.
                    To make the score consistent with the job description and the resume content extract the keywords from the job description and match them with the resume content.
                    Only return the score as a number without any additional text. Do not include any explanations or comments.
                    `,
                },
                {
                  inlineData: {
                    mimeType: file.type,
                    data: Buffer.from(fileBuffer).toString("base64"),
                  },
                },
              ],
            },
          ],
        }),
      }
    );

    const aiData = await aiResponse.json();
    console.log("AI Response Data:", aiData);
    const resultText =
      aiData.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI model";
    console.log("AI Response:", resultText);
    return NextResponse.json({ result: resultText }, { status: 200 });
  } catch (error) {
    // console.error("AI Matching Error", error);
    return NextResponse.json(
      { error: "Failed to process the resume." },
      { status: 500 }
    );
  }
}
