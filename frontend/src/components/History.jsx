import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../api";

const History = () => {
  const [emails, setemails] = useState([]);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const fetchhistory = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.log("No login token found");
          setloading(false);
          return;
        }

        const response = await axios.get(
          `${API_URL}/emails`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("History response:", response.data);

        if (response.data.success) {
          setemails(response.data.emails || []);
        } else {
          setemails([]);
        }
      } catch (error) {
        console.error("History error:", error);
        console.error(
          "Backend error:",
          error.response?.data
        );

        setemails([]);
      } finally {
        setloading(false);
      }
    };

    fetchhistory();
  }, []);

  // LOADING
  if (loading) {
    return (
      <section className="min-h-screen bg-[#F7F5FC] px-4 py-10">
        <div className="mx-auto max-w-5xl rounded-2xl border border-[#E4DDF5] bg-white p-6 shadow-xl sm:p-8">
          <p className="text-sm text-[#756A8A]">
            Loading history...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#F7F5FC] px-4 py-10">

      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <div className="mb-8 rounded-2xl border border-[#E4DDF5] bg-white p-6 shadow-xl sm:p-8">

          <div className="border-b border-[#E8E2F3] pb-6">

            <h2 className="text-3xl font-bold text-[#34215C]">
              Email History
            </h2>

            <p className="mt-2 text-sm text-[#756A8A]">
              View your previously sent bulk emails.
            </p>

          </div>
        </div>

        {/* NO HISTORY */}
        {emails.length === 0 ? (
          <div className="rounded-2xl border border-[#E4DDF5] bg-white p-8 text-center shadow-xl">

            <p className="text-sm text-[#756A8A]">
              No email history found.
            </p>

          </div>
        ) : (

          /* HISTORY LIST */
          <div className="space-y-5">

            {emails.map((email) => (
              <div
                key={email._id}
                className="rounded-2xl border border-[#E4DDF5] bg-white p-6 shadow-xl"
              >

                {/* SUBJECT + DATE */}
                <div className="mb-4 border-b border-[#E8E2F3] pb-4">

                  <h3 className="text-xl font-bold text-[#34215C]">
                    {email.subject}
                  </h3>

                  <p className="mt-2 text-xs text-[#756A8A]">
                    {email.sentAt
                      ? new Date(
                        email.sentAt
                      ).toLocaleString()
                      : "Date not available"}
                  </p>

                </div>

                <div className="space-y-4">

                  {/* MESSAGE */}
                  <div>

                    <p className="mb-1 text-sm font-semibold text-[#49386B]">
                      Message
                    </p>

                    <p className="rounded-lg bg-[#FAF9FD] p-4 text-sm leading-6 text-[#5E5472]">
                      {email.body}
                    </p>

                  </div>

                  {/* RECIPIENTS */}
                  <div>

                    <p className="mb-1 text-sm font-semibold text-[#49386B]">
                      Recipients
                    </p>

                    <p className="rounded-lg bg-[#FAF9FD] p-4 text-sm leading-6 text-[#5E5472]">
                      {Array.isArray(email.recipients)
                        ? email.recipients.join(", ")
                        : email.recipients}
                    </p>

                  </div>

                  {/* STATUS */}
                  <div>

                    <p className="text-sm font-semibold text-[#49386B]">
                      Status
                    </p>

                    <span
                      className={`mt-2 inline-block rounded-lg px-3 py-2 text-xs font-semibold ${email.status === "success"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                        }`}
                    >
                      {email.status}
                    </span>

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </section>
  );
};

export default History;