import CreatePostScreen from "@/screen/blog/create/create-post-screen";

export default function CreatePost() {
  return (
    <div className="min-w-[280px] w-full h-full flex flex-col justify-start items-start p-3 md:p-10 lg:p-20 gap-5 box-border scroll-smooth">
      <CreatePostScreen />
    </div>
  );
}
