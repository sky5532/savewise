"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSession, type User } from "./auth";

export function useUser() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace("/login");
      return;
    }
    setUser(session.user);
  }, [router]);

  return user;
}