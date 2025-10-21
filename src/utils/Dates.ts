
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
    const diffMs = date.getTime() - now.getTime();
    const isFuture = diffMs > 0;

<<<<<<< HEAD:frontend/src/utils/Dates.ts
    const diff = Math.abs(diffMs);

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);  // rough approximation
    const years = Math.floor(months / 12);

    let ret = "";

    if (years > 0) {
        ret = `${years} year${years !== 1 ? "s" : ""}`;
    } else if (months > 0) {
        ret = `${months} month${months !== 1 ? "s" : ""}`;
    } else if (days > 0) {
        ret = `${days} day${days !== 1 ? "s" : ""}`;
    } else if (hours > 0) {
        ret = `${hours} hour${hours !== 1 ? "s" : ""}`;
    } else if (minutes > 0) {
        ret = `${minutes} minute${minutes !== 1 ? "s" : ""}`;
    } else {
        ret = `${seconds} second${seconds !== 1 ? "s" : ""}`;
    }

    return isFuture ? `In ${ret}` : `${ret} ago`;
}
=======
    const delta_y = now.getFullYear() - date.getFullYear();
    const delta_m = now.getMonth() - date.getMonth();
    const delta_d = now.getDate() - date.getDate();
    const delta_h = now.getHours() - date.getHours();
    const delta_s = now.getSeconds() - date.getSeconds();
    if (delta_y > 0) {
        return `${delta_y} year${delta_y > 1 && 's'} ago`
    } else if (delta_m > 0) {
        return `${delta_m} month${delta_m > 1 && 's'} ago`
    } else if (delta_d > 0) {
        return `${delta_d} day${delta_d > 1 && 's'} ago`
    } else if (delta_h > 0) {
        return `${delta_h} hour${delta_h > 1 && 's'} ago`
    } else if (delta_s >= 0) {
        return `${delta_s} second${delta_s > 1 && 's'} ago`
    }

    return 'Invalid Timestamp';
}
>>>>>>> c29d814841113d07348cf79ac3f7cdf60ee63221:src/utils/Dates.ts
