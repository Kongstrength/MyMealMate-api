export const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\p{L}\p{N}\s]).{8,64}$/u;

export const PASSWORD_REQUIREMENTS_MESSAGE =
  'รหัสผ่านต้องมี 8–64 ตัว และประกอบด้วยตัวพิมพ์เล็ก ตัวพิมพ์ใหญ่ ตัวเลข และอักขระพิเศษ';
