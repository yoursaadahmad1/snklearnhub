import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function getAuth() {
  const supabase = createServerComponentClient({ cookies })
  return await supabase.auth.getSession()
}