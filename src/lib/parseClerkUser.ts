type ClerkUserData = {
  id: string;
  email_addresses: { email_address: string }[];
  username?: string | null;
  first_name?: string | null;
  last_name?: string | null;
};

export function parseClerkUser(data: ClerkUserData) {
  const email = data.email_addresses?.[0]?.email_address ?? "";
  const username = data.username ?? email.split("@")[0];
  const fullName = [data.first_name, data.last_name].filter(Boolean).join(" ");

  return {
    id: data.id,
    email,
    username,
    name: fullName,
  };
}
