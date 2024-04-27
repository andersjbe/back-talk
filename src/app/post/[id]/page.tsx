import createClient from "edgedb";
import Link from "next/link";
import e from "~/edgeql-js";

const client = createClient();

export default async function BlogPage({ params }: { params: { id: string } }) {
  const post = await e
    .select(e.BlogPost, (p) => ({
      id: true,
      title: true,
      content: true,
      filter_single: e.op(p.id, "=", e.uuid(params.id)),
    }))
    .run(client);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="container mx-auto bg-black p-4 text-white">
      <nav>
        <Link href="/" className="mb-4 block text-blue-500" replace>
          Back to List
        </Link>
      </nav>
      <h1 className="mb-4 text-3xl font-bold">{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}
