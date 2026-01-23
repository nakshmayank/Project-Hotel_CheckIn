const MemberSkeleton = () => {
  return (
    <div className="bg-gray-100/70 p-4 rounded-2xl shadow-md animate-pulse">
      <div className="space-y-3">
        <div className="h-3 w-3/4 bg-gray-300/80 rounded-full"></div>
        <div className="h-3 w-1/2 bg-gray-300/80 rounded-full"></div>
        <div className="h-3 w-2/3 bg-gray-300/80 rounded-full"></div>
        <div className="h-3 w-1/3 bg-gray-300/80 rounded-full"></div>
        <div className="h-3 w-2/5 bg-gray-300/80 rounded-full"></div>
      </div>
    </div>
  );
};

export default MemberSkeleton;
