import createClient from "edgedb";
import Link from "next/link";
import e from "~/edgeql-js";

const client = createClient();

export default async function HomePage() {
  const selectPosts = e.select(e.BlogPost, () => ({
    id: true,
    title: true,
    content: true,
  }));
  const posts = await selectPosts.run(client);

  return (
    <div className="container mx-auto bg-black p-4 text-white">
      <h1 className="mb-4 text-3xl font-bold">Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id} className="mb-4">
            <Link href={`/post/${post.id}`} className="text-blue-500">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
