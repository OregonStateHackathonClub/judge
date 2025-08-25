import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// do not do this in production- always add a fallback with suspense or a loading.tsx when using an async component
export default async function Page(props: { params: Promise<{ year: string }> }) {
  const data = ["thing 1", "thing 2", "thing 3"];
  const params = await props.params

  return (
    <div className="">
      <div className="h-48 bg-blue-500 flex items-center justify-center">
        <h1 className="text-white font-bold text-5xl">
          { params.year } Hackathon!
        </h1>
      </div>
      <div className="flex flex-col">
        {data.map((thing) => (
          <Card key={thing}>
            <CardHeader>
              <CardTitle>{thing}</CardTitle>
              <CardDescription>Card Description</CardDescription>
              <CardAction>Card Action</CardAction>
            </CardHeader>
            <CardContent>
              <p>Card Content</p>
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
