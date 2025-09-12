import { NextResponse } from "next/server";
import { put, del } from "@vercel/blob";

// Optional: run on edge for lower latency
export const runtime = "edge";

// Very lightweight in-memory rate limiter per IP (best-effort only).
const lastRequestByIp = new Map<string, number>();
const MIN_INTERVAL_MS = 3000; // 3s between uploads per IP

const ALLOWED_MIME = new Set([
	"image/png",
	"image/jpeg",
	"image/webp",
	"application/pdf",
]);
const MAX_BYTES = 5 * 1024 * 1024; // 5MB

function getClientIp(req: Request) {
	const fwd = req.headers.get("x-forwarded-for");
	if (fwd) return fwd.split(",")[0]?.trim() || "unknown";
	return req.headers.get("x-real-ip") || "unknown";
}

function isVercelBlobUrl(urlStr: string) {
	try {
		const u = new URL(urlStr);
		return u.host.endsWith("vercel-storage.com");
	} catch {
		return false;
	}
}

export async function POST(req: Request) {
	// Rate limit (best-effort)
	const ip = getClientIp(req);
	const now = Date.now();
	const last = lastRequestByIp.get(ip) || 0;
	if (now - last < MIN_INTERVAL_MS) {
		return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
	}
	lastRequestByIp.set(ip, now);

	if (!process.env.BLOB_READ_WRITE_TOKEN) {
		return NextResponse.json({ error: "Server not configured for Blob uploads." }, { status: 500 });
	}

	const form = await req.formData();
	const file = form.get("file");
	if (!(file instanceof File)) {
		return NextResponse.json({ error: "Missing file" }, { status: 400 });
	}

	// Validate size and type
	if (file.size > MAX_BYTES) {
		return NextResponse.json({ error: `File too large. Max ${Math.floor(MAX_BYTES / (1024 * 1024))}MB` }, { status: 413 });
	}
	if (!ALLOWED_MIME.has(file.type)) {
		return NextResponse.json({ error: "Unsupported file type" }, { status: 415 });
	}

	const ext = (() => {
		const fromName = file.name?.split(".").pop()?.toLowerCase();
		if (fromName) return fromName;
		if (file.type === "image/png") return "png";
		if (file.type === "image/jpeg") return "jpg";
		if (file.type === "image/webp") return "webp";
		if (file.type === "application/pdf") return "pdf";
		return "bin";
	})();

	const filename = `uploads/${crypto.randomUUID()}.${ext}`;

	try {
		const blob = await put(filename, file, {
			access: "public",
			contentType: file.type,
			token: process.env.BLOB_READ_WRITE_TOKEN,
			addRandomSuffix: false,
		});
		return NextResponse.json({ url: blob.url }, { status: 201 });
		} catch {
		return NextResponse.json({ error: "Upload failed" }, { status: 500 });
	}
}

export async function DELETE(req: Request) {
	if (!process.env.BLOB_READ_WRITE_TOKEN) {
		return NextResponse.json({ error: "Server not configured for Blob deletes." }, { status: 500 });
	}
	const { searchParams } = new URL(req.url);
	const url = searchParams.get("url");
	if (!url || !isVercelBlobUrl(url)) {
		return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
	}
	try {
		await del(url, { token: process.env.BLOB_READ_WRITE_TOKEN });
		return NextResponse.json({ ok: true });
		} catch {
		return NextResponse.json({ error: "Delete failed" }, { status: 500 });
	}
}

