import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

function Home() {
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: announcementData, error: annError } = await supabase
          .from("announcements")
          .select("*")
          .order("id", { ascending: false });

        if (annError) throw annError;
        setAnnouncements(announcementData || []);
      } catch (error) {
        console.error("Failed to load announcements:", error);
      }

      try {
        const { data: eventData, error: eventError } = await supabase
          .from("events")
          .select("*")
          .order("id", { ascending: false });

        if (eventError) throw eventError;
        setEvents(eventData || []);
      } catch (error) {
        console.error("Failed to load events:", error);
      }
    };

    fetchData();
  }, []);

  const latestAnnouncement = announcements[0];
  const latestEvent = events[0];

  return (
    <div className="new-home">

      {/* ================= HERO ================= */}

      <section className="new-hero">

        <div className="hero-content-new">

          <div className="college-badge">
            🎓 <span>Your College Information Hub</span>
          </div>

          <h1>
            Welcome to
            <span>NotifyHub</span>
          </h1>

          <div className="hero-line"></div>

          <p>
            Stay connected with everything happening in your college.
            Get important announcements, upcoming events and answers
            to your questions — all in one place.
          </p>

          <div className="hero-buttons-new">

            <button
              className="announcement-btn"
              onClick={() => {
                window.location.href = "/announcements";
              }}
            >
              📢 View Announcements
            </button>

            <button
              className="events-btn"
              onClick={() => {
                window.location.href = "/events";
              }}
            >
              🗓️ Explore Events
            </button>

          </div>

        </div>

        {/* Notification visual */}

        <div className="notification-visual">

          <div className="notification-glow"></div>

          <div className="notification-card-new">

            <div className="bell-new">
              🔔
              <span className="notification-number">
                {announcements.length}
              </span>
            </div>

            <div className="signal-new">
              ))) 
            </div>

            <h2>Stay in the Loop</h2>

            <p>
              Your college updates,
              <br />
              right when you need them.
            </p>

            <div className="live-update">
              <span>●</span> LIVE UPDATES
            </div>

          </div>

        </div>

      </section>


      {/* ================= ANNOUNCEMENTS ================= */}

      <section className="home-section announcements-section">

        <div className="section-heading-row">

          <div className="section-title-area">

            <div className="section-icon purple-icon">
              📢
            </div>

            <div>
              <div className="section-label purple-text">
                📢 COLLEGE UPDATES
              </div>

              <h2>
                Latest <span>Announcements</span>
              </h2>
            </div>

          </div>

          <button
            className="view-all purple-outline"
            onClick={() => {
              window.location.href = "/announcements";
            }}
          >
            View All →
          </button>

        </div>


        {latestAnnouncement ? (

          <div className="announcement-home-card">

            <div className="announcement-icon-large">
              📣
            </div>

            <div className="announcement-main">

              <div className="announcement-category">
                {latestAnnouncement.category}
              </div>

              <h3>
                {latestAnnouncement.title}
              </h3>

              <p>
                {latestAnnouncement.description}
              </p>

            </div>

            <div className="announcement-date">
              <span>📅</span>
              <strong>
                {latestAnnouncement.date}
              </strong>
            </div>

          </div>

        ) : (

          <div className="empty-home-card">
            <div>📢</div>
            <h3>No announcements yet</h3>
            <p>New college announcements will appear here.</p>
          </div>

        )}

        {announcements.length > 1 && (
          <div className="slider-dots">
            <span className="active"></span>
            <span></span>
            <span></span>
          </div>
        )}

      </section>


      {/* ================= EVENTS ================= */}

      <section className="home-section events-section">

        <div className="section-heading-row">

          <div className="section-title-area">

            <div className="section-icon green-icon">
              🗓️
            </div>

            <div>
              <div className="section-label green-text">
                🎉 CAMPUS ACTIVITIES
              </div>

              <h2>
                Upcoming <span>Events</span>
              </h2>
            </div>

          </div>

          <button
            className="view-all green-outline"
            onClick={() => {
              window.location.href = "/events";
            }}
          >
            View All →
          </button>

        </div>


        {latestEvent ? (

          <div className="event-home-card">

            <div className="event-image-placeholder">
              🎓
              <div className="confetti">✦</div>
              <div className="confetti two">✦</div>
              <div className="confetti three">✦</div>
            </div>

            <div className="event-home-content">

              <div className="event-category">
                {latestEvent.category}
              </div>

              <h3>
                {latestEvent.title}
              </h3>

              <p>
                {latestEvent.description}
              </p>

              <div className="event-details">

                <div>
                  <span className="detail-icon">📅</span>
                  <div>
                    <small>DATE</small>
                    <strong>{latestEvent.date}</strong>
                  </div>
                </div>

                <div>
                  <span className="detail-icon">◷</span>
                  <div>
                    <small>TIME</small>
                    <strong>
                      {latestEvent.time || "TBA"}
                    </strong>
                  </div>
                </div>

                <div>
                  <span className="detail-icon">📍</span>
                  <div>
                    <small>LOCATION</small>
                    <strong>
                      {latestEvent.location || "TBA"}
                    </strong>
                  </div>
                </div>

              </div>

            </div>

          </div>

        ) : (

          <div className="empty-home-card">
            <div>🎉</div>
            <h3>No upcoming events</h3>
            <p>New college events will appear here.</p>
          </div>

        )}

      </section>


      {/* ================= FEATURES ================= */}

      <section className="home-features-new">

        <div className="feature-card feature-purple">
          <div className="feature-icon">🔔</div>
          <div>
            <h3>Real-time Updates</h3>
            <p>Get instant notifications about important updates.</p>
          </div>
        </div>

        <div className="feature-card feature-blue">
          <div className="feature-icon">🗓️</div>
          <div>
            <h3>Event Reminder</h3>
            <p>Never miss an important college event.</p>
          </div>
        </div>

        <div className="feature-card feature-green">
          <div className="feature-icon">❓</div>
          <div>
            <h3>Ask Questions</h3>
            <p>Get your queries answered by the right people.</p>
          </div>
        </div>

        <div className="feature-card feature-orange">
          <div className="feature-icon">🛡️</div>
          <div>
            <h3>Trusted Information</h3>
            <p>Official updates from your college.</p>
          </div>
        </div>

      </section>

    </div>
  );
}

export default Home;