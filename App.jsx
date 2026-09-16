import { useEffect, useState } from "react";
import Login from "./Login";
import "./App.css";

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [leads, setLeads] = useState([]);
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "New",
  });

  const [editingId, setEditingId] = useState(null);

  // =========================
  // GET ALL LEADS
  // =========================
  const fetchLeads = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/leads",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch leads");
      }

      setLeads(data);
    } catch (error) {
      alert("Lead backend connection error");
    }
  };

  // =========================
  // GET ALL DEALS
  // =========================
  const fetchDeals = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/deals",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch deals");
      }

      setDeals(data);
    } catch (error) {
      alert("Deal backend connection error");
    }
  };

  // =========================
  // GET ALL ACTIVITIES
  // =========================
  const fetchActivities = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/activities",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch activities"
        );
      }

      setActivities(data);
    } catch (error) {
      alert("Activity backend connection error");
    }
  };

  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {
    if (user) {
      fetchLeads();
      fetchDeals();
      fetchActivities();
    }
  }, [user]);

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // ADD / UPDATE LEAD
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingId
        ? `http://localhost:5000/api/leads/${editingId}`
        : "http://localhost:5000/api/leads";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      alert(
        editingId
          ? "Lead updated successfully"
          : "Lead added successfully"
      );

      setForm({
        name: "",
        email: "",
        phone: "",
        company: "",
        status: "New",
      });

      setEditingId(null);

      fetchLeads();
    } catch (error) {
      alert(error.message || "Backend connection error");
    }
  };

  // =========================
  // EDIT LEAD
  // =========================
  const editLead = (lead) => {
    setEditingId(lead._id);

    setForm({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company || "",
      status: lead.status || "New",
    });
  };

  // =========================
  // DELETE LEAD
  // =========================
  const deleteLead = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/leads/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      alert("Lead deleted successfully");

      fetchLeads();
    } catch (error) {
      alert(error.message || "Delete failed");
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // =========================
  // LOGIN PAGE
  // =========================
  if (!user) {
    return (
      <Login
        onLogin={(loggedInUser) => setUser(loggedInUser)}
      />
    );
  }

  return (
    <div className="crm-container">
      {/* =========================
          HEADER
      ========================= */}<div className="crm-layout">
  <aside className="crm-sidebar">
    <div className="sidebar-title">CRM MENU</div>

   <div
  className="sidebar-item"
  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
>
  Dashboard
</div>
    <div
  className="sidebar-item"
  onClick={() =>
    document.getElementById("leads-section")?.scrollIntoView({
      behavior: "smooth",
    })
  }
>
  Leads
</div>
    <div
  className="sidebar-item"
  onClick={() =>
    document.getElementById("deals-section")?.scrollIntoView({
      behavior: "smooth",
    })
  }
>
  Deals
</div>
   <div
  className="sidebar-item"
  onClick={() =>
    document.getElementById("activities-section")?.scrollIntoView({
      behavior: "smooth",
    })
  }
>
  Activities
</div>
  </aside>

  <main className="crm-content">

      
      <h1>Enterprise CRM System</h1>

      <div className="user-bar">
        <div>
          <strong>Welcome, {user.name}</strong>
          <span>Role: {user.role}</span>
        </div>

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* =========================
          SALES DASHBOARD
      ========================= */}
      <h2>Sales Dashboard</h2>

      <div className="dashboard">
        <div className="card">
          <h3>Total Leads</h3>
          <p>{leads.length}</p>
        </div>

        <div className="card">
          <h3>New Leads</h3>
          <p>
            {leads.filter(
              (lead) => lead.status === "New"
            ).length}
          </p>
        </div>

        <div className="card">
          <h3>Contacted</h3>
          <p>
            {leads.filter(
              (lead) => lead.status === "Contacted"
            ).length}
          </p>
        </div>

        <div className="card">
          <h3>Qualified</h3>
          <p>
            {leads.filter(
              (lead) => lead.status === "Qualified"
            ).length}
          </p>
        </div>

        <div className="card">
          <h3>Won</h3>
          <p>
            {leads.filter(
              (lead) => lead.status === "Won"
            ).length}
          </p>
        </div>

        <div className="card">
          <h3>Lost</h3>
          <p>
            {leads.filter(
              (lead) => lead.status === "Lost"
            ).length}
          </p>
        </div>
      </div>

      <hr />

      <p>
        Manage your leads, customers and sales.
      </p>

      <hr />

      {/* =========================
          ADD / EDIT LEAD
      ========================= */}
      <h2 id="leads-section">
        {editingId ? "Edit Lead" : "Add New Lead"}
      </h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <input
          name="company"
          placeholder="Company"
          value={form.company}
          onChange={handleChange}
        />

        <br />
        <br />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Won">Won</option>
          <option value="Lost">Lost</option>
        </select>

        <br />
        <br />

        <button type="submit">
          {editingId ? "Update Lead" : "Add Lead"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);

              setForm({
                name: "",
                email: "",
                phone: "",
                company: "",
                status: "New",
              });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* =========================
          LEAD LIST
      ========================= */}
      <h2>Lead List</h2>

      <table className="lead-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Company</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {leads.map((lead) => (
            <tr key={lead._id}>
              <td>{lead.name}</td>
              <td>{lead.email}</td>
              <td>{lead.phone}</td>
              <td>{lead.company}</td>
              <td>{lead.status}</td>

              <td>
                <button
                  onClick={() => editLead(lead)}
                >
                  Edit
                </button>

                {user.role === "Admin" && (
                  <button
                    onClick={() =>
                      deleteLead(lead._id)
                    }
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      {/* =========================
          ADD DEAL
      ========================= */}
      <h2>Add New Deal</h2>

      <form
        onSubmit={async (e) => {
          e.preventDefault();

          try {
            const response = await fetch(
              "http://localhost:5000/api/deals",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem(
                    "token"
                  )}`,
                },
                body: JSON.stringify({
                  leadName:
                    e.target.leadName.value,
                  company:
                    e.target.company.value,
                  value: Number(
                    e.target.value.value
                  ),
                  stage:
                    e.target.stage.value,
                }),
              }
            );

            const data = await response.json();

            if (!response.ok) {
              throw new Error(
                data.message ||
                  "Failed to create deal"
              );
            }

            alert(
              "Deal added successfully!"
            );

            e.target.reset();
            fetchDeals();
          } catch (error) {
            alert(
              error.message ||
                "Failed to add deal"
            );
          }
        }}
      >
        <input
          type="text"
          name="leadName"
          placeholder="Lead Name"
          required
        />

        <input
          type="text"
          name="company"
          placeholder="Company"
          required
        />

        <input
          type="number"
          name="value"
          placeholder="Deal Value"
          required
        />

        <select
          name="stage"
          defaultValue="New"
        >
          <option value="New">New</option>
          <option value="Contacted">
            Contacted
          </option>
          <option value="Qualified">
            Qualified
          </option>
          <option value="Won">Won</option>
          <option value="Lost">Lost</option>
        </select>

        <button type="submit">
          Add Deal
        </button>
      </form>

      <hr />

      {/* =========================
          DEAL PIPELINE TABLE
      ========================= */}
      <h2 id="deals-section">Deal Pipeline</h2>

      <table className="lead-table">
        <thead>
          <tr>
            <th>Lead Name</th>
            <th>Company</th>
            <th>Deal Value</th>
            <th>Stage</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {deals.map((deal) => (
            <tr key={deal._id}>
              <td>{deal.leadName}</td>
              <td>{deal.company}</td>
              <td>₹{deal.value}</td>

              <td>
                <select
                  value={deal.stage}
                  onChange={async (e) => {
                    try {
                      const response =
                        await fetch(
                          `http://localhost:5000/api/deals/${deal._id}`,
                          {
                            method: "PUT",
                            headers: {
                              "Content-Type":
                                "application/json",
                              Authorization: `Bearer ${localStorage.getItem(
                                "token"
                              )}`,
                            },
                            body: JSON.stringify({
                              stage:
                                e.target.value,
                            }),
                          }
                        );

                      const data =
                        await response.json();

                      if (!response.ok) {
                        throw new Error(
                          data.message ||
                            "Update failed"
                        );
                      }

                      fetchDeals();
                    } catch (error) {
                      alert(
                        error.message ||
                          "Stage update failed"
                      );
                    }
                  }}
                >
                  <option value="New">
                    New
                  </option>

                  <option value="Contacted">
                    Contacted
                  </option>

                  <option value="Qualified">
                    Qualified
                  </option>

                  <option value="Won">
                    Won
                  </option>

                  <option value="Lost">
                    Lost
                  </option>
                </select>
              </td>

              <td>
                {user.role === "Admin" && (
                  <button
                    onClick={async () => {
                      try {
                        const response =
                          await fetch(
                            `http://localhost:5000/api/deals/${deal._id}`,
                            {
                              method: "DELETE",
                              headers: {
                                Authorization: `Bearer ${localStorage.getItem(
                                  "token"
                                )}`,
                              },
                            }
                          );

                        const data =
                          await response.json();

                        if (!response.ok) {
                          throw new Error(
                            data.message ||
                              "Delete failed"
                          );
                        }

                        alert(
                          "Deal deleted successfully!"
                        );

                        fetchDeals();
                      } catch (error) {
                        alert(
                          error.message ||
                            "Delete failed"
                        );
                      }
                    }}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* =========================
          SALES PIPELINE
      ========================= */}
      <h2 id="deals-section">Sales Pipeline</h2>

      <div className="pipeline">
        {[
          "New",
          "Contacted",
          "Qualified",
          "Won",
          "Lost",
        ].map((stage) => (
          <div
            className="pipeline-column"
            key={stage}
          >
            <h3>{stage}</h3>

            {deals
              .filter(
                (deal) =>
                  deal.stage === stage
              )
              .map((deal) => (
                <div
                  className="deal-card"
                  key={deal._id}
                >
                  <h4>{deal.leadName}</h4>

                  <p>{deal.company}</p>

                  <strong>
                    ₹{deal.value}
                  </strong>
                </div>
              ))}
          </div>
        ))}
      </div>

      <hr />

      {/* =========================
          ACTIVITY & EMAIL LOGS
      ========================= */}
      <h2 id="activities-section">Activity & Email Logs</h2>

      <form
        onSubmit={async (e) => {
          e.preventDefault();

          try {
            const response = await fetch(
              "http://localhost:5000/api/activities",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem(
                    "token"
                  )}`,
                },
                body: JSON.stringify({
                  leadName:
                    e.target.leadName.value,
                  type:
                    e.target.type.value,
                  description:
                    e.target.description.value,
                }),
              }
            );

            const data = await response.json();

            if (!response.ok) {
              throw new Error(
                data.message ||
                  "Activity creation failed"
              );
            }

            alert(
              "Activity added successfully!"
            );

            e.target.reset();
            fetchActivities();
          } catch (error) {
            alert(
              error.message ||
                "Failed to add activity"
            );
          }
        }}
      >
        <input
          type="text"
          name="leadName"
          placeholder="Lead Name"
          required
        />

        <select
          name="type"
          defaultValue="Email"
        >
          <option value="Email">
            Email
          </option>

          <option value="Call">
            Call
          </option>

          <option value="Meeting">
            Meeting
          </option>

          <option value="Follow-up">
            Follow-up
          </option>
        </select>

        <input
          type="text"
          name="description"
          placeholder="Activity Description"
          required
        />

        <button type="submit">
          Add Activity
        </button>
      </form>

      {/* =========================
          RECENT ACTIVITIES
      ========================= */}
      <h3>Recent Activities</h3>

      <table className="lead-table">
        <thead>
          <tr>
            <th>Lead Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {activities.map((activity) => (
            <tr key={activity._id}>
              <td>{activity.leadName}</td>

              <td>{activity.type}</td>

              <td>
                {activity.description}
              </td>

              <td>
                {user.role === "Admin" && (
                  <button
                    onClick={async () => {
                      try {
                        const response =
                          await fetch(
                            `http://localhost:5000/api/activities/${activity._id}`,
                            {
                              method: "DELETE",
                              headers: {
                                Authorization: `Bearer ${localStorage.getItem(
                                  "token"
                                )}`,
                              },
                            }
                          );

                        const data =
                          await response.json();

                        if (!response.ok) {
                          throw new Error(
                            data.message ||
                              "Delete failed"
                          );
                        }

                        alert(
                          "Activity deleted successfully!"
                        );

                        fetchActivities();
                      } catch (error) {
                        alert(
                          error.message ||
                            "Delete failed"
                        );
                      }
                    }}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      {/* =========================
          LEADS SUMMARY
      ========================= */}
      <h2>Leads</h2>

      {leads.length === 0 ? (
        <p>No leads found</p>
      ) : (
        leads.map((lead) => (
          <div key={lead._id}>
            <h3>{lead.name}</h3>

            <p>
              Email: {lead.email}
            </p>

            <p>
              Phone: {lead.phone}
            </p>

            <p>
              Company: {lead.company}
            </p>

            <p>
              Status: {lead.status}
            </p>

            <button
              onClick={() =>
                editLead(lead)
              }
            >
              Edit
            </button>

           {user.role === "Admin" && (
  <button
    onClick={() => deleteLead(lead._id)}
  >
    Delete
  </button>
)}

            <hr />
          </div>
        ))
      )}
        </main>
      </div>
    </div>
  );
}

export default App;