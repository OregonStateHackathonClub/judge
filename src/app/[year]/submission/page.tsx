import { Suspense } from "react";

const fetchUserWithDelay = () =>
  new Promise((res) =>
    setTimeout(
      async () => res(await (await fetch("https://randomuser.me/api/")).json()),
      2000
    )
  );

export default function Page({ params }: { params: { year: string } }) {
	const year = params.year;
  const write = async () => {
    "use server";

    console.log("test");
  };

  return (
    <>
      <button onClick={write}>test server action</button>
      <Suspense fallback={"Loading..."}>
        <PeopleData />
      </Suspense>
			{year}
    </>
  );
}

async function PeopleData() {
  const data = await fetchUserWithDelay();
  return <div>{JSON.stringify(data)}</div>;
}