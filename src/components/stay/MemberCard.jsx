const Gender = {
  M: "Male",
  F: "Female",
  O: "Other",
};

const ID_TYPE = {
  1: "Aadhaar Card",
  2: "Passport",
  3: "Driving License",
  4: "Voter ID",
  5: "PAN Card",
};

const MemberCard = ({ member }) => {
  return (
    <div className="bg-gray-100/70 text-sm p-4 mb-3 rounded-3xl shadow-md hover:shadow-lg transition-shadow">
      <p><b>Name:</b> {member.name}</p>
      <p><b>Age:</b> {member.age}</p>
      <p><b>Gender:</b> {Gender[member.gender]}</p>
      <p><b>Mobile:</b> {member.mobile}</p>
      <p><b>ID Type:</b> {ID_TYPE[member.IDType]}</p>

      <p className="flex gap-1">
        <b>ID File:</b>
        {member.IDFilename && (
          <button
            onClick={() =>
              window.open(
                `https://api.careersphare.com/memersidphoto/${member.IDFilename}`,
                "_blank"
              )
            }
            className="text-orange-500 text-sm font-medium hover:underline"
          >
            View ID
          </button>
        )}
      </p>
    </div>
  );
};

export default MemberCard;
