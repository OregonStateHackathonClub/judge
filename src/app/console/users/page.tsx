"use client"
import { removeUser, updatePermissions, userSearch } from "@/app/actions";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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

    async function modifyPermissions(judgeProfileId: string, permissionLevel: string) {
        const res = await updatePermissions(judgeProfileId, permissionLevel)
        if (!res) {
            toast.error("Failed to change permissions to " + permissionLevel + ".")
        }
    }

    function Users() {

        return (
            <div className="grid gap-2">
            {users.map((user) => {
                const [open, setOpen] = useState(false);
                return (
                    <div key={user.id}>
                        <div className="flex justify-between items-center gap-3 cursor-pointer rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
                            <div>
                                <h3 className="font-semibold text-gray-800">{user.name}</h3>
                                <p className="text-xs">{user.id}</p>
                            </div>
                            <div className="flex justify-between gap-3">
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="rounded-xl">
                                            Change Permissions
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80 relative">
                                        <p>hello</p>
                                    </PopoverContent>
                                </Popover>
                                <Button variant="outline" className="rounded-xl" onClick={() => deleteUser(user.id)}>
                                    Delete User
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            })}
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