import Loader from "@/components/loader/loading";

export default function Loading() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center overflow-x-auto p-14 gap-5">
      <Loader />
    </div>
  );
}
