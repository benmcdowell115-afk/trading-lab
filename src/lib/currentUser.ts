/** Module-level user ID so non-React code (hook persist fns) can sync to Supabase */
let _userId: string | null = null

export const setCurrentUserId = (id: string | null) => { _userId = id }
export const getCurrentUserId = () => _userId
