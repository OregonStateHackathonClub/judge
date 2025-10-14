"use client"
import { removeUser, userSearch } from "@/app/actions";
import { PrismaClient } from "@prisma/client";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page() {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
            const fetchUsers = async () => {
            const res = await userSearch(search);
            if (!res) return
            setUsers(res);
            };
            fetchUsers();
        }, [search]);

    
    async function deleteUser(judgeProfileId: string) {
        const res = await removeUser(judgeProfileId)
        if (!res) {
            toast.error("Failed to delete user.")
        }
    }

    function Users() {

        return (
            <div className="grid gap-2">
            {users.map((user) => (
                <div key={user.id}>
                    <div className="flex justify-between items-center gap-3 cursor-pointer rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
                        <div>
                            <h3 className="font-semibold text-gray-800">{user.name}</h3>
                            <p className="text-xs">{user.id}</p>
                        </div>
                        <div
                            className="px-3 py-1 rounded-xl hover:shadow-md hover:bg-gray-100 transition-all duration-200"
                            onClick={() => deleteUser(user.id)}
                        >
                            Delete User
                        </div>
                    </div>
                </div>
            ))}
            </div>
        );
    }

  return (
    <div className="w-full max-w-3xl mx-auto pt-10" >
        <div className="flex justify-center">
            <div className="text-3xl font-bold">Users</div>
        </div>
        <div>
            <input
                type="text"
                placeholder="Search..."
                className="cursor-text rounded-xl border border-gray-200 bg-white p-2 mb-2 shadow-sm hover:shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 w-75"
                value = {search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
        {users ? <Users /> : <div>Loading...</div>}
    </div>
  )
}