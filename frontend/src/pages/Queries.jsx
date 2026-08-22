import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

function Queries({ session, profile }) {
  const [query, setQuery] = useState("");
  const [queries, setQueries] = useState([]);

  // Load queries from Supabase
  useEffect(() => {
    const loadQueries = async () => {
      if (!session?.user) return;
      try {
        const { data, error } = await supabase
          .from("queries")
          .select("*")
          .eq("student_id", session.user.id)
          .order("id", { ascending: false });

        if (error) throw error;
        setQueries(data || []);
      } catch (error) {
        console.error("Failed to load queries:", error);
      }
    };

    loadQueries();
  }, [session]);

  // Submit query to Supabase
  const submitQuery = async () => {
    if (!query.trim()) {
      alert("Please enter your query.");
      return;
    }

    try {
      const date = new Date().toLocaleDateString();

      const { data, error } = await supabase
        .from("queries")
        .insert([
          { 
            text: query.trim(), 
            status: "Pending", 
            date,
            student_id: session.user.id,
            student_name: profile?.name || session.user.email,
            student_roll_id: profile?.roll_id || "N/A"
          }
        ])
        .select();

      if (error) throw error;

      // Add the new query to the screen
      setQueries((previous) => [data[0], ...previous]);

      setQuery("");

      alert("Query submitted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to submit query: " + error.message);
    }
  };

  return (
    <div className="page">

      {/* PAGE HEADER */}

      <div className="page-header">

        <div className="page-label">
          💬 STUDENT SUPPORT
        </div>

        <h1>
          Ask Your <span>Questions</span>
        </h1>

        <p>
          Have a question? Send it here and keep track of your queries.
        </p>

      </div>

      {/* QUERY FORM */}

      <div className="glass-card query-form">

        <h2>📝 Submit a Query</h2>

        <p>
          Tell us what you need help with.
        </p>

        <textarea
          placeholder="Write your query here..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button
          className="primary-btn"
          onClick={submitQuery}
        >
          🚀 Submit Query
        </button>

      </div>

      {/* MY QUERIES */}

      <div
        className="page-header"
        style={{ marginBottom: "25px" }}
      >

        <h2 style={{ fontSize: "32px" }}>
          My <span>Queries</span>
        </h2>

      </div>

      {queries.length === 0 ? (

        <div className="glass-card empty-state">

          <div className="empty-icon">
            💭
          </div>

          <h2>No queries yet</h2>

          <p>
            Your submitted questions will appear here.
          </p>

        </div>

      ) : (

        <div>

          {queries.map((item) => (

            <div
              className="glass-card query-card"
              key={item.id}
            >

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "15px",
                  alignItems: "center",
                }}
              >

                <h3 style={{ margin: 0 }}>
                  Query #{item.id}
                </h3>

                <span className="query-status">
                  {item.status}
                </span>

              </div>

              <p>
                {item.text}
              </p>

              <small style={{ color: "#69728b" }}>
                📅 {item.date}
              </small>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Queries;