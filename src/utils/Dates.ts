
const TIMEZONE_OFFSET = 5; // 5 hour offset from EST -> UTC
const SEMESTER_START = Date.UTC(2025, 7, 18, TIMEZONE_OFFSET);
const SEMESTER_END = Date.UTC(2025, 11, 12, TIMEZONE_OFFSET);

const SEMESTER_LENGTH = SEMESTER_END - SEMESTER_START;
const ONE_PERCENT_SECONDS = SEMESTER_LENGTH / 100;

export function get_ms_next_percent(): number {
    const semester_passed: number = Date.now() - SEMESTER_START;
    return ONE_PERCENT_SECONDS - (semester_passed % ONE_PERCENT_SECONDS);
}

export function get_ms_until_midnight(): number {
    const now: Date = new Date();
    const midnight: Date = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0, 0, 0, 0
    )

    return midnight.getTime() - now.getTime();
}

export function get_days_remaining(): number {
    return Math.floor((SEMESTER_END - Date.now()) / (1000 * 60 * 60 * 24));
}

export function get_percentage(): number {
    return (Date.now() - SEMESTER_START) / (SEMESTER_LENGTH)
}