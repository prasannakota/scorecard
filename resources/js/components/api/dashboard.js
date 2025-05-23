
export async function getUser() {
  const res = await fetch("/api/user");
  if (!res.ok) throw new Error("Failed to fetch user");
  return await res.json();
}

export async function getRecentAssessments() {
  const res = await fetch("/api/assessments/recent");
  if (!res.ok) throw new Error("Failed to fetch assessments");
  return await res.json();
}
