import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { Header } from "@/components/layout/Header";
import { UsersClient } from "./UsersClient";

async function getUsers() {
  await connectDB();
  const users = await User.find()
    .sort({ createdAt: -1 })
    .select("name email role isPremium emailVerified createdAt")
    .lean();

  return users.map((u) => ({
    id: u._id.toString(),
    name: u.name as string,
    email: u.email as string,
    role: u.role as string,
    isPremium: u.isPremium as boolean,
    emailVerified: u.emailVerified ? true : false,
    createdAt: new Date(u.createdAt).toLocaleDateString("fr-FR"),
  }));
}

export default async function UsersPage() {
  const users = await getUsers();
  return (
    <div className="pb-32">
      <Header title="Utilisateurs" />
      <UsersClient users={users} />
    </div>
  );
}