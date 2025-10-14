"use client"
import { userSearch } from "@/app/actions";
import { PrismaClient } from "@prisma/client";
import { Suspense, useEffect, useState } from "react";

export default function Page() {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
            const fetchUsers = async () => {
            const res = await userSearch(search);
            if (!res) return
            // const data = await res.json();
            setUsers(res);
            };
            fetchUsers();
        }, [search]);

    function Users() {

        return (
            <div className="grid gap-2">
            {users.map((user) => (
                <div key={user.id}>
                    <div className="cursor-pointer rounded-xl border border-gray-200 bg-white p-2 shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-200">
                        <h3 className="font-semibold text-gray-800">{user.name}</h3>
                        <p className="text-xs">{user.id}</p>
                    </div>
                </div>
            ))}
            </div>
        );
    }

    // async function GetUsers() {
    //   const prisma = new PrismaClient();
    //   const users = await prisma.user.findMany();
    //   return users;
    // }

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