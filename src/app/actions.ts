"use server";

import { type Prisma, PrismaClient, UserRole } from "@prisma/client";
import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { auth } from "@/lib/auth"; // your Better Auth instance

const prisma = new PrismaClient({});

export async function isSuperAdmin(): Promise<boolean> {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) {
		return false;
	}

	const user = await prisma.user.findUnique({
		where: {
			id: session.user.id,
		},
	});

	if (!user) return false;

	return user.role === UserRole.ADMIN;
	// Used to be SUPERADMIN
}

export async function isAdmin(hackathonId: string): Promise<boolean> {
	if (await isSuperAdmin()) return true;
	return false;
	// TODO
	// const session = await auth.api.getSession({ headers: await headers() });

	// if (!session) {
	// 	return false;
	// }

	// const hackathon_participant = await prisma.hackathonsRole.findFirst({
	// 	where: {
	// 		hackathon_participantId: session.user.id,
	// 		hackathonId: hackathonId,
	// 	},
	// });

	// if (!hackathon_participant) return false;

	// return hackathon_participant.role === Role.ADMIN;
}

export async function isJudge(hackathonId: string): Promise<boolean> {
	return false;
	// TODO
	// const session = await auth.api.getSession({ headers: await headers() });

	// if (!session) {
	// 	return false;
	// }

	// const hackathon_participant = await prisma.hackathonsRole.findFirst({
	// 	where: {
	// 		hackathon_participantId: session.user.id,
	// 		hackathonId: hackathonId,
	// 	},
	// });

	// if (!hackathon_participant) return false;

	// return hackathon_participant.role === Role.JUDGE;
}

// Return true if user is logged in and a part of the given team. Otherwise, returns false
export async function isTeamMember(teamId: string): Promise<boolean> {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) {
		return false;
	}

	const team = await prisma.team.findUnique({
		where: {
			id: teamId,
		},
		include: {
			team_member: {
				include: {
					hackathon_participant: {
						include: {
							user: true,
						},
					},
				},
			},
		},
	});

	if (!team) {
		return false;
	}

	return team.team_member.some(
		(ut) => ut.hackathon_participant.userId === session.user.id,
	);
}

// Return true if successful. Otherwise, return false
export async function createHackathonParticipant(
	hackathonId: string,
): Promise<boolean> {
	try {
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session) {
			return false;
		}

		await prisma.hackathon_participant.create({
			data: {
				id: randomUUID(),
				userId: session.user.id,
				hackathonId: hackathonId,
			},
		});

		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}

// Return teamId if successful. false if unsucessful
export async function createTeam(
	teamData: any,
	addSelf: boolean = false,
): Promise<string | false> {
	try {
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session) {
			return false;
		}

		const userId = session.user.id;

		const existingTeam = await prisma.team.findFirst({
			where: {
				team_member: {
					some: {
						hackathon_participant: {
							userId: userId,
						},
					},
				},
			},
		});

		if (existingTeam) {
			return false;
		}

		// const data = {
		// 	name: teamData.name,
		// 	description: teamData.description,
		// 	lookingForTeammates: teamData.lft,
		// 	contact: teamData.contact,
		// 	// leader: { connect: { userId: session?.user.id } },
		// };

		teamData.id = randomUUID()
		teamData.creatorId = session.user.id
		// teamData.hackathon = "2026" // TODO
		teamData.updatedAt = new Date();

		const newTeam = await prisma.team.create({
			data: teamData,
		});

		// Add leader

		// TODO
		// await prisma.team.update({
		// 	data: {
		// 		leader: { connect: { userId: session?.user.id } },
		// 	},
		// 	where: {
		// 		teamId: newTeam.teamId,
		// 	},
		// });

		// if (addSelf) {
		// 	if (userId == null) {
		// 		return false;
		// 	}

		// 	await prisma.usersToTeams.create({
		// 		data: {
		// 			hackathon_participantId: userId,
		// 			teamId: newTeam.teamId,
		// 		},
		// 	});
		// }

		return newTeam.id;
	} catch (error) {
		console.error(error);
		return false;
	}
}

// Return true if successful. Otherwise, return false
// Return false if user is not a member of the given team
export async function updateTeam(
	teamId: string,
	teamData: Prisma.teamUpdateInput,
): Promise<boolean> {
	try {
		if (!(await isTeamMember(teamId))) {
			return false;
		}

		await prisma.team.update({
			data: teamData,
			where: { id: teamId },
			include: {
				team_member: {
					include: { hackathon_participant: { include: { user: true } } },
				},
			},
		});

		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}

// Return teamId if successful. Otherwise, return false
// Return false if user is not logged in
export async function joinTeam(inviteCode: string): Promise<string | false> {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) {
		return false;
	}

	const team = await prisma.team.findFirst({
		where: {
			invite: {
				some: {
					code: inviteCode,
				},
			},
		},
		include: {
			team_member: true,
		},
	});

	if (!team) {
		return false;
	}
	if (team.team_member.length >= 4) {
		return false;
	}
	try {
		const connection = await prisma.team.update({
			where: {
				id: team.id,
			},
			data: {
				team_member: {
					connect: {
						id: session.user.id,
					},
				},
			},
		});

		if (connection) {
			return team.id;
		} else {
			return false;
		}
	} catch (error) {
		console.error(error);
		return false;
	}
}

// Return partial team object if successful. Otherwise, return null
export async function getTeamInfo(id: string) {
	const team = await prisma.team.findUnique({
		where: { id },
		select: {
			id: true,
			name: true,
			description: true,
			lookingForTeammates: true,
			contact: true,
			creatorId: true,
			team_member: {
				select: {
					id: true,
					hackathon_participant: {
						select: {
							user: {
								select: {
									name: true,
								},
							},
						},
					},
				},
			},
		},
	});

	if (!team) {
		return null;
	}

	return team;
}

export async function userSearch(search: string) {
	if (!isSuperAdmin()) return false;

	const users = await prisma.user.findMany({
		where: {
			OR: [
				{
					name: {
						contains: search,
						mode: "insensitive",
					},
				},
				{
					id: {
						contains: search,
						mode: "insensitive",
					},
				},
				{
					email: {
						contains: search,
						mode: "insensitive",
					},
				},
			],
		},
		select: {
			name: true,
			id: true,
			email: true,
			role: true,
		},
	});

	if (!users) {
		return null;
	}

	return users;
}

// Returns true if successful. Otherwise, return false
// Return false if user is not a member of the given team
export async function removeUserToTeams(
	hackathon_participantId: string,
	teamId: string,
): Promise<boolean> {
	try {
		const session = await auth.api.getSession({ headers: await headers() });

		const team = await prisma.team.findUnique({
			where: {
				id: teamId,
			},
		});

		if (
			!team || false
			// (team.leaderId !== session?.user.id &&
			// 	hackathon_participantId !== session?.user.id)
			// TODO
		) {
			// Cope
			return false;
		}

		await prisma.team.update({
			where: { id: teamId },
			data: {
				team_member: {
				disconnect: { id: hackathon_participantId },
				},
			},
		});

		const newTeam = await prisma.team.findUnique({
			where: {
				id: teamId,
			},
			select: {
				team_member: true,
			},
		});

		if (newTeam == null) {
			// Cry like a baby
			return false;
		}

		// Delete team if no members left
		if (newTeam.team_member.length === 0) {
			await prisma.invite.deleteMany({
				where: {
					teamId: teamId,
				},
			});

			await prisma.team.delete({
				where: {
					id: teamId,
				},
			});
			// Replace leader if necessary
		}
		// TODO
		// else if (team.leaderId === hackathon_participantId) {
		// 	await prisma.teams.update({
		// 		data: {
		// 			leaderId: newTeam.users[0].hackathon_participantId,
		// 		},
		// 		where: {
		// 			teamId: teamId,
		// 		},
		// 	});
		// }

		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}

// Return invite code if successful. Otherwise, return false
// Return false if user is not a member of the given team
export async function getInviteCode(teamId: string): Promise<string | false> {
	if (!(await isTeamMember(teamId))) {
		return false;
	}

	let invite = await prisma.invite.findFirst({
		where: {
			teamId: teamId,
		},
	});

	if (!invite) {
		invite = await prisma.invite.create({
			data: {
				id: randomUUID(),
				code: randomUUID(),
				teamId: teamId,
			},
		});
	}
	return invite.code;
}

// Return teamId if successful. Otherwise, return false
export async function getTeamIdFromInvite(
	inviteCode: string,
): Promise<string | false> {
	const team = await prisma.team.findFirst({
		where: {
			invite: {
				some: {
					code: inviteCode,
				},
			},
		},
	});

	if (team) {
		return team.id;
	}

	return false;
}

export async function resetInviteCode(inviteCode: string): Promise<boolean> {
	const teamId = await getTeamIdFromInvite(inviteCode);

	if (!teamId) return false;
	if (!(await isTeamMember(teamId))) return false;

	try {
		await prisma.invite.delete({
			where: {
				code: inviteCode,
			},
		});
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}

// TODO
export async function removeUser(
	id: string,
): Promise<boolean> {
	// Require superadmin
	return false;
}

export async function addPermissions(
	hackathon_participantId: string,
	permissionLevel: string,
	hackathonId: string = "",
): Promise<boolean> {
	// TODO
	// switch (permissionLevel) {
	// 	case "judge":
	// 		// requires admin and hackathonId input
	// 		if ((await isAdmin(hackathonId)) && hackathonId !== "") {
	// 			const res = await prisma.hackathonsRole.create({
	// 				data: {
	// 					hackathonId: hackathonId,
	// 					hackathon_participantId: hackathon_participantId,
	// 					role: Role.JUDGE,
	// 				},
	// 			});

	// 			if (!res) {
	// 				return false;
	// 			}
	// 		} else {
	// 			return false;
	// 		}
	// 		break;
	// 	case "admin":
	// 		// requires superadmin and hackathonId input
	// 		if ((await isSuperAdmin()) && hackathonId !== "") {
	// 			const res = await prisma.hackathonsRole.create({
	// 				data: {
	// 					hackathonId: hackathonId,
	// 					hackathon_participantId: hackathon_participantId,
	// 					role: Role.ADMIN,
	// 				},
	// 			});

	// 			if (!res) {
	// 				return false;
	// 			}
	// 		} else {
	// 			return false;
	// 		}
	// 		break;
	// 	case "superadmin":
	// 		if (await isSuperAdmin()) {
	// 			const res = await prisma.hackathon_participant.update({
	// 				data: {
	// 					superAdmin: true,
	// 				},
	// 				where: {
	// 					userId: hackathon_participantId,
	// 				},
	// 			});

	// 			if (!res) {
	// 				return false;
	// 			}
	// 		} else {
	// 			return false;
	// 		}
	// 		break;
	// 	default:
	// 		return false;
	// }

	return true;
}

export async function removePermissions(
	hackathon_participantId: string,
	permissionLevel: string,
	hackathonId: string = "",
): Promise<boolean> {
	// TODO
	// switch (permissionLevel) {
	// 	case "judge":
	// 		// requires admin and hackathonId input
	// 		if ((await isAdmin(hackathonId)) && hackathonId !== "") {
	// 			const res = await prisma.hackathonsRole.deleteMany({
	// 				where: {
	// 					hackathonId: hackathonId,
	// 					hackathon_participantId: hackathon_participantId,
	// 					role: Role.JUDGE,
	// 				},
	// 			});

	// 			if (!res) {
	// 				return false;
	// 			}
	// 		} else {
	// 			return false;
	// 		}
	// 		break;
	// 	case "admin":
	// 		// requires superadmin and hackathonId input
	// 		if ((await isSuperAdmin()) && hackathonId !== "") {
	// 			const res = await prisma.hackathonsRole.deleteMany({
	// 				where: {
	// 					hackathonId: hackathonId,
	// 					hackathon_participantId: hackathon_participantId,
	// 					role: Role.ADMIN,
	// 				},
	// 			});

	// 			if (!res) {
	// 				return false;
	// 			}
	// 		} else {
	// 			return false;
	// 		}
	// 		break;
	// 	case "superadmin":
	// 		if (await isSuperAdmin()) {
	// 			const res = await prisma.hackathon_participant.update({
	// 				data: {
	// 					superAdmin: false,
	// 				},
	// 				where: {
	// 					userId: hackathon_participantId,
	// 				},
	// 			});

	// 			if (!res) {
	// 				return false;
	// 			}
	// 		}
	// 		break;
	// 	default:
	// 		return false;
	// }

	return true;
}
