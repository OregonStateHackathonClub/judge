"use client"
import { removeUser, updatePermissions, userSearch } from "@/app/actions";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ButtonGroup } from "@/components/ui/button-group";

export default function Page() {
    const [search, setSearch] = useState("")
    const [users, setUsers] = useState<any[]>([])
    const [page, setPage] = useState(1)


    useEffect(() => {
            const fetchUsers = async () => {
            const res = await userSearch(search)
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

        const usersPerPage = 10
        const totalPages = Math.ceil(users.length / usersPerPage)

        const startIndex = (page - 1) * usersPerPage
        const endIndex = startIndex + usersPerPage
        const currentUsers = users.slice(startIndex, endIndex)

        return (
            <div>
                <div className="grid gap-2">
                    {currentUsers.map((user) => {
                        const [open, setOpen] = useState(false);
                        return (
                            <div key={user.id}>
                                <div className="flex justify-between items-center gap-3 cursor-pointer rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{user.name}</h3>
                                        <p className="text-xs">{user.id}</p>
                                    </div>
                                    <ButtonGroup>
                                        { true &&
                                            <Button variant="outline" className="rounded-xl" onClick={() => modifyPermissions(user.id, "user")}>
                                                Promote to SuperUser
                                            </Button>
                                        }

                                        { false &&
                                            <Button variant="outline" className="rounded-xl" onClick={() => modifyPermissions(user.id, "user")}>
                                                Demote to User
                                            </Button>
                                        }
                                        <Button variant="outline" className="rounded-xl" onClick={() => deleteUser(user.id)}>
                                            Delete User
                                        </Button>
                                    </ButtonGroup>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <Pages totalPages={totalPages} />
            </div>
        )
    }

    function Pages({ totalPages }: { totalPages: number }) {
        return (
            <Pagination className="pt-2">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                        />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((pageNum) => {
                        // Always show first & last page
                        if (pageNum === 1 || pageNum === totalPages) return true;
                        // Show a range around the current page
                        if (Math.abs(pageNum - page) <= 2) return true;
                        return false;
                    })
                    .map((pageNum, idx, arr) => {
                        // Insert ellipses where there's a gap
                        const prev = arr[idx - 1];
                        const showEllipsis = prev && pageNum - prev > 1;

                        return (
                        <React.Fragment key={pageNum}>
                            {showEllipsis && (
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                            )}
                            <PaginationItem>
                            <PaginationLink
                                onClick={() => setPage(pageNum)}
                                isActive={page === pageNum}
                            >
                                {pageNum}
                            </PaginationLink>
                            </PaginationItem>
                        </React.Fragment>
                        );
                    })}

                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        )
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