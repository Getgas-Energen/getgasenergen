import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export interface AccessInfo {
  userId: string;
  email: string | null;
  fullName: string | null;
  isAdmin: boolean;
  isStaff: boolean;
}

export const getMyAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AccessInfo> => {
    const { supabase, userId, claims } = context;

    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", userId);
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", userId)
      .maybeSingle();

    const roleList = (roles ?? []).map((r) => r.role);

    return {
      userId,
      email: typeof claims["email"] === "string" ? (claims["email"] as string) : null,
      fullName: profile?.full_name ?? null,
      isAdmin: roleList.includes("admin"),
      isStaff: roleList.length > 0,
    };
  });
