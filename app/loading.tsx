import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full h-[100vh] flex flex-col items-center  justify-center p-4">
      <Loader className="w-10 h-10" />
    </div>
  );
}
