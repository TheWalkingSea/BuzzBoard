
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

export function get_relative_timestamp(timestamp: number): string {
    return get_relative_date(new Date(timestamp));
}

export function get_relative_date(date: Date): string {
    const now = new Date();

    const delta_y = now.getFullYear() - date.getFullYear();
    const delta_m = now.getMonth() - date.getMonth();
    const delta_d = now.getDate() - date.getDate();
    const delta_h = now.getHours() - date.getHours();
    const delta_s = now.getSeconds() - date.getSeconds();

    const isFuture = date.getTime() > now.getTime();

    let ret = "";

    if (delta_y !== 0) {
        const value = Math.abs(delta_y);
        ret = `${value} year${value !== 1 ? 's' : ''}`;
    } else if (delta_m !== 0) {
        const value = Math.abs(delta_m);
        ret = `${value} month${value !== 1 ? 's' : ''}`;
    } else if (delta_d !== 0) {
        const value = Math.abs(delta_d);
        ret = `${value} day${value !== 1 ? 's' : ''}`;
    } else if (delta_h !== 0) {
        const value = Math.abs(delta_h);
        ret = `${value} hour${value !== 1 ? 's' : ''}`;
    } else if (delta_s !== 0) {
        const value = Math.abs(delta_s);
        ret = `${value} second${value !== 1 ? 's' : ''}`;
    }

    if (isFuture) {
        return "In " + ret;
    } else {
        return ret + " ago";
    }
}
