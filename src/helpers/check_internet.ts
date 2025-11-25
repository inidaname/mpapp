export async function checkInternet() {
  try {
    const res = await fetch("https://www.apple.com", { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
}
