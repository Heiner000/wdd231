// fetch members data
export async function fetchMembersData() {
    try {
        const response = await fetch("./data/members.json");
        if (!response.ok) {
            throw Error(`HTTP error! status: ${resonse.status}`);
        }
        const data = await response.json();
        return data;
    } catch (err) {
        console.error("Fetching member data error: ", err);
    }
}

// identify membership level
export function getMembershipLevel(level) {
    switch (level) {
        case 1:
            return "Member";
        case 2:
            return "Silver";
        case 3:
            return "Gold";
        default:
            return "Unknown";
    }
}
