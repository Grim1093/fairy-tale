export async function fetchStatus(id: string) {
  const res = await fetch(`/api/yakoa/status/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error('Failed to fetch status');
  return await res.json();
}