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

const BASE_URL = "https://api.inndez.com/memersidphoto/";

const MemberCard = ({ member }) => {

  const getIdFiles = () => {
    if (!member.IDFilename) return [];
    return member.IDFilename.split(",").map(f => f.trim()).filter(Boolean);
  };

  const viewFile = (fileName) => {
  const url = BASE_URL + fileName;

  const a = document.createElement("a");
  a.href = url;
  a.setAttribute("download", fileName); // force download
  a.setAttribute("target", "_blank");   // fallback open
  document.body.appendChild(a);
  a.click();
  a.remove();
};


  const handleViewIds = async () => {
  const files = getIdFiles();

  for (const file of files) {
    viewFile(file);
    await new Promise(r => setTimeout(r, 500)); // 0.5 sec gap
  }
};


  return (
    <div className="bg-gray-100/70 text-sm p-4 mb-3 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
      <p><b>Name:</b> {member.name}</p>
      <p><b>Age:</b> {member.age}</p>
      <p><b>Gender:</b> {Gender[member.gender]}</p>
      <p><b>Mobile:</b> {member.mobile}</p>
      <p><b>ID Type:</b> {ID_TYPE[member.IDType]}</p>

      <p className="flex gap-1">
        <b>ID File:</b>
        {member.IDFilename && (
          <button
            onClick={handleViewIds}
            className="text-primary-500 text-sm font-medium hover:underline"
          >
            View ID
          </button>
        )}
      </p>
    </div>
  );
};

export default MemberCard;
