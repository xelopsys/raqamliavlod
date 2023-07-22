import CreateForum from "@/screen/forum/create/create-forum-screen";

export default function Forum() {
  return (
    <div className="min-w-[280px] w-full border min-h-fit h-full flex flex-col justify-start items-start p-3 md:p-10 lg:p-20 gap-5 scrollbar-none box-border overflow-hidden">
      <CreateForum />
    </div>
  );
}
