import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

function Admin() {
  // =========================
  // ANNOUNCEMENT STATES
  // =========================

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [announcements, setAnnouncements] = useState([]);
  const [editingAnnouncementId, setEditingAnnouncementId] = useState(null);

  // =========================
  // EVENT STATES
  // =========================

  const [eventTitle, setEventTitle] = useState("");
  const [eventCategory, setEventCategory] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");

  const [events, setEvents] = useState([]);
  const [editingEventId, setEditingEventId] = useState(null);

  // =========================
  // QUERY STATES
  // =========================

  const [queries, setQueries] = useState([]);

  // =========================
  // LOAD ANNOUNCEMENTS
  // =========================

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

  // =========================
  // LOAD EVENTS
  // =========================

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("id", { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error("Failed to load events:", error);
    }
  };

  // =========================
  // LOAD QUERIES
  // =========================

  const loadQueries = async () => {
    try {
      const { data, error } = await supabase
        .from("queries")
        .select("*")
        .order("id", { ascending: false });

      if (error) throw error;
      setQueries(data || []);
    } catch (error) {
      console.error("Failed to load queries:", error);
    }
  };

  // =========================
  // LOAD ALL DATA
  // =========================

  useEffect(() => {
    loadAnnouncements();
    loadEvents();
    loadQueries();
  }, []);

  // =====================================================
  // ANNOUNCEMENT FUNCTIONS
  // =====================================================

  // =========================
  // ADD / UPDATE ANNOUNCEMENT
  // =========================

  const saveAnnouncement = async () => {
    if (!title || !category || !description) {
      alert("Please fill all announcement fields");
      return;
    }

    try {
      if (editingAnnouncementId) {
        // EDIT
        const { error } = await supabase
          .from("announcements")
          .update({ title, category, description })
          .eq("id", editingAnnouncementId);

        if (error) throw error;
        alert("Announcement updated successfully!");
      } else {
        // ADD
        const date = new Date().toLocaleDateString();
        const { error } = await supabase
          .from("announcements")
          .insert([{ title, category, description, date }]);

        if (error) throw error;
        alert("Announcement added successfully!");
      }

      // Clear form
      setTitle("");
      setCategory("");
      setDescription("");
      setEditingAnnouncementId(null);

      // Refresh announcements
      loadAnnouncements();
    } catch (error) {
      console.error(error);
      alert("Failed to save announcement: " + error.message);
    }
  };

  // =========================
  // EDIT ANNOUNCEMENT
  // =========================

  const editAnnouncement = (announcement) => {
    setEditingAnnouncementId(announcement.id);
    setTitle(announcement.title);
    setCategory(announcement.category);
    setDescription(announcement.description);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // DELETE ANNOUNCEMENT
  // =========================

  const deleteAnnouncement = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this announcement?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const { error } = await supabase
        .from("announcements")
        .delete()
        .eq("id", id);

      if (error) throw error;

      alert("Announcement deleted successfully!");

      loadAnnouncements();
    } catch (error) {
      console.error(error);
      alert("Failed to delete announcement: " + error.message);
    }
  };

  // =========================
  // CANCEL ANNOUNCEMENT EDIT
  // =========================

  const cancelAnnouncementEdit = () => {
    setEditingAnnouncementId(null);
    setTitle("");
    setCategory("");
    setDescription("");
  };

  // =====================================================
  // EVENT FUNCTIONS
  // =====================================================

  // =========================
  // ADD / UPDATE EVENT
  // =========================

  const saveEvent = async () => {
    if (
      !eventTitle ||
      !eventCategory ||
      !eventDescription ||
      !eventDate
    ) {
      alert("Please fill all required event fields");
      return;
    }

    try {
      const eventPayload = {
        title: eventTitle,
        category: eventCategory,
        description: eventDescription,
        date: eventDate,
        time: eventTime,
        location: eventLocation,
      };

      if (editingEventId) {
        // EDIT
        const { error } = await supabase
          .from("events")
          .update(eventPayload)
          .eq("id", editingEventId);

        if (error) throw error;
        alert("Event updated successfully!");
      } else {
        // ADD
        const { error } = await supabase
          .from("events")
          .insert([eventPayload]);

        if (error) throw error;
        alert("Event added successfully!");
      }

      // Clear form
      setEventTitle("");
      setEventCategory("");
      setEventDescription("");
      setEventDate("");
      setEventTime("");
      setEventLocation("");
      setEditingEventId(null);

      // Refresh events
      loadEvents();
    } catch (error) {
      console.error(error);
      alert("Failed to save event: " + error.message);
    }
  };

  // =========================
  // EDIT EVENT
  // =========================

  const editEvent = (event) => {
    setEditingEventId(event.id);

    setEventTitle(event.title);
    setEventCategory(event.category);
    setEventDescription(event.description);
    setEventDate(event.date);
    setEventTime(event.time || "");
    setEventLocation(event.location || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // DELETE EVENT
  // =========================

  const deleteEvent = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", id);

      if (error) throw error;

      alert("Event deleted successfully!");

      loadEvents();
    } catch (error) {
      console.error(error);
      alert("Failed to delete event: " + error.message);
    }
  };

  // =========================
  // CANCEL EVENT EDIT
  // =========================

  const cancelEventEdit = () => {
    setEditingEventId(null);
    setEventTitle("");
    setEventCategory("");
    setEventDescription("");
    setEventDate("");
    setEventTime("");
    setEventLocation("");
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="page">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="page-header">

        <div className="page-label">
          ⚙️ ADMIN PANEL
        </div>

        <h1>
          Manage <span>NotifyHub</span>
        </h1>

        <p>
          Publish announcements and events and manage student queries.
        </p>

      </div>

      {/* =====================================================
          ADD / EDIT ANNOUNCEMENT
      ===================================================== */}

      <div className="glass-card admin-card">

        <h2>
          {editingAnnouncementId
            ? "✏️ Edit Announcement"
            : "📢 Add Announcement"}
        </h2>

        <p>
          {editingAnnouncementId
            ? "Update the selected announcement."
            : "Publish important college updates."}
        </p>

        <br />

        <input
          type="text"
          placeholder="Announcement title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select category</option>
          <option value="Important">Important</option>
          <option value="Academic">Academic</option>
          <option value="Notice">Notice</option>
          <option value="Event">Event</option>
        </select>

        <textarea
          placeholder="Write announcement..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button onClick={saveAnnouncement}>
          {editingAnnouncementId
            ? "✏️ Update Announcement"
            : "📢 Publish Announcement"}
        </button>

        {editingAnnouncementId && (
          <button
            onClick={cancelAnnouncementEdit}
            style={{
              marginTop: "10px",
              background: "#ffffff",
              color: "#6c2cff",
              border: "1px solid #6c2cff",
            }}
          >
            Cancel Edit
          </button>
        )}

      </div>

      {/* =====================================================
          EXISTING ANNOUNCEMENTS
      ===================================================== */}

      <div className="glass-card admin-card">

        <h2>📋 Existing Announcements</h2>

        <p>
          Edit or delete announcements already published.
        </p>

        <br />

        {announcements.length === 0 ? (

          <div className="empty-state">

            <div className="empty-icon">
              📢
            </div>

            <h3>No announcements yet</h3>

            <p>
              Published announcements will appear here.
            </p>

          </div>

        ) : (

          <div>

            {announcements.map((announcement) => (

              <div
                className="glass-card query-card"
                key={announcement.id}
                style={{
                  marginBottom: "18px",
                }}
              >

                <span className="category-badge">
                  {announcement.category}
                </span>

                <h3>
                  {announcement.title}
                </h3>

                <p>
                  {announcement.description}
                </p>

                <small style={{ color: "#69728b" }}>
                  📅 {announcement.date}
                </small>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "15px",
                    flexWrap: "wrap",
                  }}
                >

                  <button
                    onClick={() =>
                      editAnnouncement(announcement)
                    }
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteAnnouncement(announcement.id)
                    }
                    style={{
                      background: "#ff4d6d",
                    }}
                  >
                    🗑️ Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* =====================================================
          ADD / EDIT EVENT
      ===================================================== */}

      <div className="glass-card admin-card">

        <h2>
          {editingEventId
            ? "✏️ Edit Event"
            : "🎉 Add Event"}
        </h2>

        <p>
          {editingEventId
            ? "Update the selected college event."
            : "Create an upcoming college event."}
        </p>

        <br />

        <input
          type="text"
          placeholder="Event title"
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
        />

        <select
          value={eventCategory}
          onChange={(e) => setEventCategory(e.target.value)}
        >
          <option value="">Select event category</option>
          <option value="Workshop">Workshop</option>
          <option value="Seminar">Seminar</option>
          <option value="Cultural">Cultural</option>
          <option value="Sports">Sports</option>
          <option value="Technical">Technical</option>
          <option value="Competition">Competition</option>
          <option value="Other">Other</option>
        </select>

        <textarea
          placeholder="Describe the event..."
          value={eventDescription}
          onChange={(e) =>
            setEventDescription(e.target.value)
          }
        />

        <input
          type="date"
          value={eventDate}
          onChange={(e) =>
            setEventDate(e.target.value)
          }
        />

        <input
          type="time"
          value={eventTime}
          onChange={(e) =>
            setEventTime(e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Event location"
          value={eventLocation}
          onChange={(e) =>
            setEventLocation(e.target.value)
          }
        />

        <button onClick={saveEvent}>
          {editingEventId
            ? "✏️ Update Event"
            : "🎉 Publish Event"}
        </button>

        {editingEventId && (
          <button
            onClick={cancelEventEdit}
            style={{
              marginTop: "10px",
              background: "#ffffff",
              color: "#6c2cff",
              border: "1px solid #6c2cff",
            }}
          >
            Cancel Edit
          </button>
        )}

      </div>

      {/* =====================================================
          EXISTING EVENTS
      ===================================================== */}

      <div className="glass-card admin-card">

        <h2>📋 Existing Events</h2>

        <p>
          Edit or delete events already published.
        </p>

        <br />

        {events.length === 0 ? (

          <div className="empty-state">

            <div className="empty-icon">
              🗓️
            </div>

            <h3>No events yet</h3>

            <p>
              Published events will appear here.
            </p>

          </div>

        ) : (

          <div>

            {events.map((event) => (

              <div
                className="glass-card query-card"
                key={event.id}
                style={{
                  marginBottom: "18px",
                }}
              >

                <span className="category-badge">
                  {event.category}
                </span>

                <h3>
                  {event.title}
                </h3>

                <p>
                  {event.description}
                </p>

                <div
                  style={{
                    marginTop: "10px",
                    lineHeight: "1.8",
                  }}
                >

                  <div>
                    📅 {event.date}
                  </div>

                  {event.time && (
                    <div>
                      ⏰ {event.time}
                    </div>
                  )}

                  {event.location && (
                    <div>
                      📍 {event.location}
                    </div>
                  )}

                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "15px",
                    flexWrap: "wrap",
                  }}
                >

                  <button
                    onClick={() =>
                      editEvent(event)
                    }
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteEvent(event.id)
                    }
                    style={{
                      background: "#ff4d6d",
                    }}
                  >
                    🗑️ Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* =====================================================
          STUDENT QUERIES
      ===================================================== */}

      <div className="glass-card admin-card">

        <h2>💬 Student Queries</h2>

        <p>
          View questions submitted by students.
        </p>

        <br />

        {queries.length === 0 ? (

          <div className="empty-state">

            <div className="empty-icon">
              💭
            </div>

            <h3>No student queries yet</h3>

            <p>
              Student questions will appear here.
            </p>

          </div>

        ) : (

          <div>

            {queries.map((item) => (

              <div
                className="glass-card query-card"
                key={item.id}
                style={{
                  marginBottom: "18px",
                }}
              >

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "15px",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >

                  <h3 style={{ margin: 0 }}>
                    Query #{item.id}
                  </h3>

                  <span className="query-status">
                    {item.status || "Pending"}
                  </span>

                </div>

                <p style={{ marginTop: "15px" }}>
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

    </div>
  );
}

export default Admin;