import { useAppContext } from "../../context/AppContext";

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
  const { axios } = useAppContext();

  const viewId = async () => {
    try {
      const { data } = await axios.get(`/api/v1/Hotel/mf/${member.IDFilename}`, {
        responseType: "blob",
      });

      const blob = new Blob([data], { type: "application/pdf" });

      const url = window.URL.createObjectURL(blob);

      // Step 4: Create <a> tag and trigger download
      const link = document.createElement("a");
      link.href = url;
      // link.setAttribute("download", `${file}`); // filename
      link.setAttribute("target", "_blank");
      document.body.appendChild(link);
      link.click();

      // Step 5: Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-gray-100/70 text-sm p-4 mb-3 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
      <p>
        <b>Name:</b> {member.name}
      </p>
      <p>
        <b>Age:</b> {member.age}
      </p>
      <p>
        <b>Gender:</b> {Gender[member.gender]}
      </p>
      <p>
        <b>Mobile:</b> {member.mobile}
      </p>
      <p>
        <b>ID Type:</b> {ID_TYPE[member.IDType]}
      </p>

      <p className="flex gap-1">
        <b>ID File:</b>
        {member.IDFilename && (
          <button
            onClick={viewId}
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
