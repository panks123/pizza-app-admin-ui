export const UserRole = {
    MANAGER: "manager",
    ADMIN: "admin",
    CUSTOMER: "customer"
}

export const PER_PAGE = 6;

export const orderStatusColors = {
    received: "gold",
    confirmed: "warning",
    prepared: "blue",
    out_for_delivery: "violet",
    delivered: "success",
    cancelled: "error",
} as const;