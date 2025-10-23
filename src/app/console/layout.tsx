export default function Layout({children}: {children: React.ReactNode}) {
	return (
		<div className="bg-zinc-900 flex grow min-h-dvh text-zinc-50">
			{children}
		</div>
	)
}