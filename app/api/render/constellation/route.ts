import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const profileId = searchParams.get("profileId");

  if (!profileId) {
    return NextResponse.json({ error: "profileId is required" }, { status: 400 });
  }

  // Create a simple SVG constellation as a placeholder
  const svg = `
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#000000"/>
      <g stroke="#ffffff" stroke-width="2" fill="none">
        <circle cx="100" cy="100" r="3" fill="#ffffff"/>
        <circle cx="200" cy="150" r="3" fill="#ffffff"/>
        <circle cx="150" cy="250" r="3" fill="#ffffff"/>
        <circle cx="300" cy="200" r="3" fill="#ffffff"/>
        <circle cx="250" cy="300" r="3" fill="#ffffff"/>
        <line x1="100" y1="100" x2="200" y2="150"/>
        <line x1="200" y1="150" x2="150" y2="250"/>
        <line x1="150" y1="250" x2="300" y2="200"/>
        <line x1="300" y1="200" x2="250" y2="300"/>
      </g>
      <text x="200" y="350" text-anchor="middle" fill="#ffffff" font-family="Arial" font-size="16">
        ${profileId}'s Constellation
      </text>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}