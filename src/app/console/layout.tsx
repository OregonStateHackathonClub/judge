export default function Layout({children}: {children: React.ReactNode}) {
	return (
		<div className="bg-neutral-900 flex grow">
			{children}
		</div>
	)
}