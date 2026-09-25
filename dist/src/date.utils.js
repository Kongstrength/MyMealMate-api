"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatBangkokDateKey = formatBangkokDateKey;
exports.parseDateOnly = parseDateOnly;
exports.formatDateOnly = formatDateOnly;
function formatBangkokDateKey(date = new Date()) {
    const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Bangkok',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(date);
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return `${values.year}-${values.month}-${values.day}`;
}
function parseDateOnly(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value))
        return null;
    const date = new Date(`${value}T00:00:00.000Z`);
    if (Number.isNaN(date.getTime()) || formatDateOnly(date) !== value) {
        return null;
    }
    return date;
}
function formatDateOnly(date) {
    return date.toISOString().slice(0, 10);
}
//# sourceMappingURL=date.utils.js.map