"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PASSWORD_REQUIREMENTS_MESSAGE = exports.PASSWORD_PATTERN = void 0;
exports.PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\p{L}\p{N}\s]).{8,64}$/u;
exports.PASSWORD_REQUIREMENTS_MESSAGE = 'รหัสผ่านต้องมี 8–64 ตัว และประกอบด้วยตัวพิมพ์เล็ก ตัวพิมพ์ใหญ่ ตัวเลข และอักขระพิเศษ';
//# sourceMappingURL=password-policy.js.map