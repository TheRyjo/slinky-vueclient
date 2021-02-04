
export function isValidHttpUrl(string) {
    let url;
    
    try {
        url = new URL(string);
    } catch (_) {
        return false;  
    }
    
    return url.protocol === "http:" || url.protocol === "https:";
}

export function normalizeHttpUrl(str) {
    if (!str || typeof str !== "string") {
        return str;
    }

    const prefixs = ["http://", "https://"];
    for (const pfx of prefixs) {
        if (str.substring(0, pfx.length) === pfx) {
            return str;
        }
    }

    return "http://" + str;
}
