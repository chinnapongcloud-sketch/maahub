export function jwtDecode(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return { userId: payload.userId, username: payload.username, role: payload.role, name: payload.name };
  } catch {
    return null;
  }
}
