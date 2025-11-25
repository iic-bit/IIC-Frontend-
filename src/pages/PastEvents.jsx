// src/pages/PastEvents.jsx
import React from "react";
import EventCard from "../Components/EventCard.jsx"; // default export expected
import EventDetailModal from "../Components/EventDetailModal.jsx"; // default export expected

// attempt to load images from src/assets/events folder
let eventImages = {};
try {
  const req = require.context("../assets/events", false, /\.(png|jpe?g|svg)$/);
  req.keys().forEach((k) => {
    const name = k.replace(/^\.\//, "");
    eventImages[name] = req(k);
  });
} catch (err) {
  eventImages = {};
}

function getImage(fileName) {
  if (!fileName) return null;
  if (eventImages[fileName]) return eventImages[fileName];
  const found = Object.keys(eventImages).find((k) => k.toLowerCase() === fileName.toLowerCase());
  return found ? eventImages[found] : null;
}

/* ---------------- Mock events (full list) ----------------
   Update/replace this array with your real data or extend it.
*/
const mockEvents = [
  {
    id: "1",
    name: "Smart India Hackathon (SIH)",
    date: "Sept 26, 2025",
    venue: "TSEC Campus",
    shortDescription: "A dynamic SIH event where students collaborated to solve real-world problems through innovation and creative technical solutions.",
    fullDescription:
      "The Smart India Hackathon (SIH) event brought students together to work on practical, real-world problem statements using creativity and technology. It aimed to enhance innovation, teamwork, and critical thinking while preparing participants for national-level challenges.",
    thumbnailFile: "sih1.jpg",
    galleryFiles: ["sih1.jpg", "sih2.jpg", "sih3.jpg"],
    highlights: ["Problem-Solving Sessions", "Team Collaboration", "Mentor Guidance", "Prototype Demonstrations"],
    category: "Technology",
  },
  {
    id: "2",
    name: "Hackspark-1.0",
    date: "Mar 15-16, 2025",
    venue: "TSEC Campus",
    shortDescription: "HackSpark was an intense 24-hour hackathon where students built innovative tech solutions under time pressure and teamwork.",
    fullDescription: "HackSpark, a 24-hour hackathon, challenged participants to brainstorm, prototype, and develop creative technological solutions within a limited time frame. It fostered collaboration, innovation, and hands-on problem-solving.",
    thumbnailFile: "hack1.jpg",
    galleryFiles: ["hack1.jpg", "hack2.jpg", "hack3.jpg"],
    highlights: ["24-Hour Coding Sprint", "Real-world Problem Statements", "Mentor Support", "Innovative Solutions"],
    category: "Technology",
  },
  // {
  //   id: "3",
  //   name: "Master & Miss Fiesta 2024",
  //   date: "Feb 20, 2024",
  //   venue: "Innovation Lab, TSEC",
  //   shortDescription: "Personality contest with interactive rounds and fun tasks.",
  //   fullDescription:
  //     "Master & Miss Fiesta aimed to identify and honor students who showcased exceptional confidence, intelligence, and stage presence.",
  //   thumbnailFile: "M1.jpg",
  //   galleryFiles: ["M1.jpg", "M2.jpg"],
  //   highlights: ["Talent Round", "Q&A Session", "Crowning Moment"],
  //   category: "Technology",
  // },
  {
    id: "4",
    name: "Master & Miss Fiesta 2024",
    date: "Jan 30, 2025",
    venue: "Ground Floor Stage, TSEC",
    shortDescription: "Personality contest with interactive rounds and fun tasks.",
    fullDescription:
      "Master & Miss Fiesta aimed to identify and honor students who showcased exceptional confidence, intelligence, and stage presence.",
    thumbnailFile: "M1.jpg",
    galleryFiles: ["M1.jpg", "M2.jpg"],
    highlights: ["Talent Round", "Q&A Session", "Crowning Moment"],
    category: "Entrepreneurship",
  },
  {
    id: "5",
    name: "Business Fair 24-25",
    date: "Jan 29-30, 2025",
    venue: "Ground Floor, TSEC",
    shortDescription: "A vibrant business fair where students showcased creative products and entrepreneurial ideas through interactive stalls.",
    fullDescription: "The Business Fair provided a hands-on platform for students to present their innovative products and business concepts. It encouraged entrepreneurship, marketing skills, and real-world customer interaction.   ",
    thumbnailFile: "Bus1.jpg",
    galleryFiles: ["Bus1.jpg", "Bus2.jpg", "Bus3.jpg"],
    highlights: ["Student-led Stalls", "Entrepreneurial Experience", "Creative Displays", "Active Crowds & Interaction"],
    category: "Entrepreneurship",
  },
  {
    id: "6",
    name: "Mock Interview",
    date: "Jan 30, 2025",
    venue: "Tpoly Classrooms",
    shortDescription: "A mock interview session designed to help students practice, improve, and gain confidence in real interview scenarios.",
    fullDescription: "The mock interview session provided students with a real-time interview experience to enhance their communication, preparedness, and confidence. It offered valuable feedback to help participants refine their skills for future placements and professional opportunities.",
    thumbnailFile: "Moc1.jpg",
    galleryFiles: ["Moc1.jpg", "Moc2.jpg", "Moc3.jpg", "Moc4.jpg"],
    highlights: ["Realistic Interview Rounds", "Expert Feedback", "Skill Building", "Confidence Enhancement"],
    category: "Entrepreneurship",
  },
  {
    id: "7",
    name: "Circuit Mosaic 2025",
    date: "Sep 12, 2025",
    venue: "Electronics Lab, TSEC",
    shortDescription: "Circuit Mosaic was a three-stage electronics challenge testing strategy, circuit design skills, and hands-on implementation.",
    fullDescription:
      "Circuit Mosaic challenged participants through bidding, designing diagrams and building working circuits.",
    thumbnailFile: "CM1.jpg",
    galleryFiles: ["CM1.jpg", "CM2.jpg", "CM3.jpg"],
    highlights: ["Strategic Bidding", "Circuit Designing", "Hands-on Implementation"],
    category: "Competition",
  },
  {
    id: "8",
    name: "Elocution Competition 24-25",
    date: "Jan 29, 2025",
    venue: "Language Lab 4th Floor, TSEC",
    shortDescription: "An elocution competition where students showcased their speaking skills by delivering powerful and expressive speeches.",
    fullDescription:
      "The elocution competition provided a platform for students to articulate their thoughts confidently on diverse topics. It aimed to enhance communication skills, critical thinking, and stage presence among participants.",
    thumbnailFile: "Ele_1.jpg",
    galleryFiles: ["Ele_1.jpg", "Ele_2.jpg"],
    highlights: ["Engaging Speeches", "Skill Enhancement", "Expert Judging", "Active Participation"],
    category: "Competition",
  },
  {
    id: "9",
    name: "Mystery Event",
    date: "Jan 30, 2025",
    venue: "Language Lab 4th Floor, TSEC",
    shortDescription: "A pitching event where participants presented innovative business ideas to showcase creativity, clarity, and entrepreneurial insight.",
    fullDescription:
      "The Business Idea Pitching event allowed students to present their startup concepts with structured pitches focused on innovation, feasibility, and market impact. It aimed to develop confidence, communication, and real-world entrepreneurial thinking.",
    thumbnailFile: "Mys1.jpg",
    galleryFiles: ["Mys1.jpg", "Mys2.jpg", "Mys3.jpg", "Mys4.jpg"],
    highlights: ["Structured Pitches", "Expert Evaluation", "Creative Concepts", "Feedback & Guidance"],
    category: "Competition",
  },
  {
    id: "10",
    name: "My Story-Motivational session by Successful Innovators",
    date: "July 18, 2025",
    venue: "CO Classroom, TSEC",
    shortDescription: "A motivational seminar where innovators shared their journeys to inspire students toward innovation.",
    fullDescription: "The seminar “My Story- Motivational Session by Successful Innovators” featured inspiring journeys of achievers who shared their experiences, challenges, and success stories. It aimed to motivate students to pursue innovation with passion and perseverance.",
    thumbnailFile: "Sem1_1.jpg",
    galleryFiles: ["Sem1_1.jpg", "Sem1_2.jpg","Sem1_3.jpg"],
    highlights: ["Inspiring Journeys", "Interactive Q&A", "Innovation Insights", "Motivational Takeaways"],
    category: "Seminars",
  },
  {
    id: "11",
    name: "Basics of Intellectual Property Rights and it's Importance for Innovators and Entrepreneurs",
    date: "July 18, 2025",
    venue: "IT Classroom, TSEC",
    shortDescription: "A seminar on the basics of IPR and their role in protecting innovation and entrepreneurship.",
    fullDescription: "The seminar focused on creating awareness about the basics of Intellectual Property Rights (IPR) and their importance for innovators and entrepreneurs. It emphasized how safeguarding ideas through IPR fosters creativity, growth, and sustainable innovation.",
    thumbnailFile: "Sem2_1.jpg",
    galleryFiles: ["Sem2_1.jpg", "Sem2_2.jpg", "Sem2_3.jpg"],
    highlights: ["Insightful Session", "Real-world Applications", "Expert Guidance", "Interactive Discussion"],
    category: "Seminars",
  },
  {
    id: "12",
    name: "Business Model Canvas",
    date: "July 18, 2025",
    venue: "AI&ML Classroom, TSEC",
    shortDescription: "A seminar introducing the concept of the Business Model Canvas and its use in developing effective startup and innovation strategies.",
    fullDescription: "The session focused on understanding the Business Model Canvas, a strategic tool that helps visualize, design, and refine business ideas. It guided participants in building strong, sustainable models for their entrepreneurial ventures.",
    thumbnailFile: "Sem3_1.jpg",
    galleryFiles: ["Sem3_1.jpg", "Sem3_2.jpg"],
    highlights: ["Concept Overview", "Hands-on Activity", "Expert Insights", "Entrepreneurial Learning"],
    category: "Seminars",
  },
  {
    id: "13",
    name: "Learn StartUp and minimum Viable Product/Business",
    date: "July 18, 2025",
    venue: "ECE Classroom, TSEC",
    shortDescription: "A seminar focused on understanding startups and developing a Minimum Viable Product (MVP) to validate business ideas effectively.",
    fullDescription: "The session introduced participants to the fundamentals of startups and the concept of a Minimum Viable Product (MVP). It emphasized how testing early versions of a product helps refine ideas and reduce market risks for entrepreneurs.",
    thumbnailFile: "Sem4_1.jpg",
    galleryFiles: ["Sem4_1.jpg", "Sem4_2.jpg"],
    highlights: ["Startup Basics", "MVP Concept", "Real-world Examples", "Interactive Discussion"],
    category: "Seminars",
  },
  {
    id: "14",
    name: "Innovation/Prototype Validation- Converting Innovation into a StartUp",
    date: "July 18, 2025",
    venue: "ME Classroom, TSEC",
    shortDescription: "A seminar on transforming innovative ideas and validated prototypes into successful startup ventures.",
    fullDescription: "The session focused on the process of innovation and prototype validation, guiding participants on how to refine their ideas and convert them into viable startups. It emphasized real-world testing, market validation, and entrepreneurial execution.",
    thumbnailFile: "Sem5_1.jpg",
    galleryFiles: ["Sem5_1.jpg", "Sem5_2.jpg", "Sem5_3.jpg"],
    highlights: ["Idea to Startup Journey", "Prototype Validation", "Expert Mentorship", "Entrepreneurial Guidance"],
    category: "Seminars",
  },
  {
    id: "15",
    name: "Angel Investment Opportunities for Early-Stage Entrepreneurs",
    date: "Aug 1, 2025",
    venue: "ECE Classroom, TSEC",
    shortDescription: "A seminar introducing Angel and VC funding, helping students understand how startups secure early-stage investment.",
    fullDescription: "The session explained the concepts of Angel and Venture Capital funding, guiding participants on how investors evaluate and support promising startups. It highlighted the funding process, pitch essentials, and strategies to attract the right investors.",
    thumbnailFile: "Sem6_1.jpg",
    galleryFiles: ["Sem6_1.jpg", "Sem6_2.jpg"],
    highlights: ["Funding Basics", "Investor Perspective", "Pitch Preparation", "Q&A and Guidance"],
    category: "Seminars",
  },

  // add more events if needed
];

const categories = ["All", "Technology", "Entrepreneurship", "Competition", "Seminars"];

export default function PastEvents() {
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [selectedEvent, setSelectedEvent] = React.useState(null);

  const filtered = selectedCategory === "All" ? mockEvents : mockEvents.filter((e) => e.category === selectedCategory);

  // build image paths for filtered events
  const eventsWithImages = filtered.map((e) => {
    const thumb = getImage(e.thumbnailFile);
    const gallery = (e.galleryFiles || []).map((f) => getImage(f)).filter(Boolean);
    return { ...e, thumbnailImage: thumb || null, galleryImages: gallery };
  });

  return (
    <div style={{ minHeight: "calc(100vh - 100px)", background: "#f7fafc", color: "#111" }}>
      {/* Page header (only once — navbar is outside this page) */}
      <div style={{ maxWidth: 1100, margin: "24px auto 8px", padding: "0 16px" }}>
        <h1 style={{ fontSize: 32, margin: 0, fontWeight: 700 }}>Past Events</h1>
        <p style={{ color: "#6b7280", marginTop: 6 }}>
          Browse past events organized by IIC — workshops, hackathons, seminars and more.
        </p>
      </div>

      {/* Category selector placed under the title */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 8, marginBottom: 18 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          {categories.map((cat) => {
            const active = cat === selectedCategory;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: "8px 14px",
                  borderRadius: 999,
                  border: active ? "1px solid #0ea5a0" : "1px solid #e5e7eb",
                  background: active ? "#ecfeff" : "#fff",
                  color: active ? "#064e3b" : "#374151",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cards grid */}
      <section style={{ maxWidth: 1100, margin: "0 auto 40px", padding: "0 16px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 20,
            alignItems: "start",
          }}
        >
          {eventsWithImages.length > 0 ? (
            eventsWithImages.map((ev) => {
              // Use your EventCard component (expecting props like { event, onClick })
              try {
                return <EventCard key={ev.id} event={ev} onClick={() => setSelectedEvent(ev)} />;
              } catch (err) {
                // fallback card if EventCard errors
                return (
                  <div key={ev.id} style={{ background: "#fff", borderRadius: 8, padding: 14, boxShadow: "0 6px 18px rgba(0,0,0,0.04)" }}>
                    <div style={{ height: 160, background: "#f3f4f6", borderRadius: 6, marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                      {ev.thumbnailImage ? <img src={ev.thumbnailImage} alt={ev.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ color: "#9ca3af" }}>Image</div>}
                    </div>
                    <h3 style={{ margin: "6px 0", fontSize: 18 }}>{ev.name}</h3>
                    <div style={{ color: "#6b7280", marginBottom: 10 }}>{ev.date} • {ev.venue}</div>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <button onClick={() => setSelectedEvent(ev)} style={{ background: "#10b981", color: "#fff", border: "none", padding: "8px 12px", borderRadius: 8, cursor: "pointer" }}>View details</button>
                    </div>
                  </div>
                );
              }
            })
          ) : (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", color: "#6b7280", padding: 40 }}>No events found for this category.</div>
          )}
        </div>
      </section>

      {/* Modal: use EventDetailModal if available (default export), else fallback */}
      {selectedEvent && (
        <>
          {typeof EventDetailModal === "function" ? (
            <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
          ) : (
            <div
              role="dialog"
              aria-modal="true"
              style={{
                position: "fixed",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,0,0,0.45)",
                zIndex: 9999,
              }}
            >
              <div style={{ width: "min(900px, 96%)", background: "#fff", borderRadius: 8, padding: 20 }}>
                <button onClick={() => setSelectedEvent(null)} style={{ float: "right", background: "transparent", border: "none", fontSize: 18, cursor: "pointer" }}>✕</button>
                <h2 style={{ marginTop: 2 }}>{selectedEvent.name}</h2>
                <p style={{ color: "#6b7280" }}>{selectedEvent.date} • {selectedEvent.venue}</p>
                <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                  {(selectedEvent.galleryImages && selectedEvent.galleryImages.length > 0) ? (
                    selectedEvent.galleryImages.map((g, i) => <img key={i} src={g} alt={`gallery-${i}`} style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 6 }} />)
                  ) : (
                    <div style={{ height: 100, width: 200, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", borderRadius: 6 }}>No images</div>
                  )}
                </div>
                <p style={{ marginTop: 16 }}>{selectedEvent.fullDescription || selectedEvent.shortDescription}</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
