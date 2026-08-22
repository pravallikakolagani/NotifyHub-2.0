import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        const { data, error } = await supabase
          .from("announcements")
          .select("*")
          .order("id", { ascending: false });

        if (error) throw error;
        setAnnouncements(data || []);
      } catch (error) {
        console.error("Failed to load announcements:", error);
      }
    };

    loadAnnouncements();
  }, []);

  const filteredAnnouncements = announcements.filter((item) =>
    `${item.title} ${item.category} ${item.description}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="page">

      <div className="page-header">

        <div className="page-label">
          📢 COLLEGE UPDATES
        </div>

        <h1>
          Latest <span>Announcements</span>
        </h1>

        <p>
          Stay informed about everything important happening around your
          college.
        </p>

      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="🔎 Search announcements..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredAnnouncements.length === 0 ? (

        <div className="glass-card empty-state">

          <div className="empty-icon">📭</div>

          <h2>No announcements yet</h2>

          <p>
            New college announcements will appear here as soon as they
            are published.
          </p>

        </div>

      ) : (

        <div className="card-grid">

          {filteredAnnouncements.map((item) => (

            <div
              className="glass-card announcement-card"
              key={item.id}
            >

              <div className="announcement-top">

                <span className="category-badge">
                  {item.category || "General"}
                </span>

                <span className="card-date">
                  📅 {item.date}
                </span>

              </div>

              <h2>{item.title}</h2>

              <p>{item.description}</p>

              <div className="card-date">
                🔔 Stay updated
              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Announcements;