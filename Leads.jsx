import { useEffect, useState } from "react";

function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/leads");

      if (!response.ok) {
        throw new Error("Failed to fetch leads");
      }

      const data = await response.json();
      setLeads(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  if (loading) {
    return <h2>Loading leads...</h2>;
  }

  return (
    <div>
      <h1>Leads</h1>

      {leads.length === 0 ? (
        <p>No leads found</p>
      ) : (
        leads.map((lead) => (
          <div key={lead._id}>
            <h3>{lead.name}</h3>
            <p>{lead.email}</p>
            <p>{lead.phone}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Leads;