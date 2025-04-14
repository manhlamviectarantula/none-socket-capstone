const formatBirthDate = (dateString) => {
    if (!dateString || typeof dateString !== "string") return "";
    const parts = dateString.split("-");
    if (parts.length !== 3) return dateString;
    const [year, month, day] = parts;
    return `${parseInt(day, 10)}/${parseInt(month, 10)}/${year}`;
};

const formatDatetime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    }).replace(',', '');
};

const formatShowtimeDate = (dateString) => {
    if (!dateString || typeof dateString !== "string") return "";
    const parts = dateString.split("-");
    if (parts.length !== 3) return dateString;
    const [year, month, day] = parts;
    return `${parseInt(day, 10)}/${parseInt(month, 10)}`;
};

// Named exports
export {
    formatBirthDate,
    formatDatetime,
    formatShowtimeDate
};
