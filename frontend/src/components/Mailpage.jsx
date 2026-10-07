import { useContext, useState } from "react";
import { Mailcontext } from "../context/Provider";
import * as XLSX from "xlsx";
import axios from "axios";
import API_URL from "../api";

const Mailpage = () => {
  const { maildata, handlechange, setmaildata } =
    useContext(Mailcontext);

  const [status, setstatus] = useState(false);

  // SEND EMAIL
  const handlesubmit = async (e) => {
    e.preventDefault();

    setstatus(true);

    // Manual emails
    const recipientlist = maildata.recipients
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean);

    // Combine manual + Excel emails
    const recipients = [
      ...recipientlist,
      ...maildata.filemails,
    ];

    console.log("Manual Emails:", recipientlist);
    console.log("Excel Emails:", maildata.filemails);
    console.log("Final Recipients:", recipients);
    console.log("Total Recipients:", recipients.length);

    // Check recipients
    if (recipients.length === 0) {
      alert("Please enter an email or upload an Excel file.");
      setstatus(false);
      return;
    }

    // Check subject
    if (!maildata.subject.trim()) {
      alert("Please enter an email subject.");
      setstatus(false);
      return;
    }

    // Check message
    if (!maildata.body.trim()) {
      alert("Please enter an email message.");
      setstatus(false);
      return;
    }

    try {
      // Get JWT token
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again.");
        setstatus(false);
        return;
      }

      // Send request to backend
      const response = await axios.post(
        `${API_URL}/sendmail`,
        {
          subject: maildata.subject,
          body: maildata.body,
          recipients: recipients,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Backend Response:", response.data);

      if (response.data.success) {
        alert("Mail sent successfully!");

        // Clear form after successful sending
        setmaildata((prev) => ({
          ...prev,
          subject: "",
          body: "",
          recipients: "",
          file: null,
          filemails: [],
        }));
      } else {
        alert(
          response.data.message || "Failed to send mail."
        );
      }
    } catch (error) {
      console.error("Send mail error:", error);
      console.error(
        "Backend error:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
        "Failed to send mail."
      );
    } finally {
      setstatus(false);
    }
  };

  // EXCEL FILE UPLOAD
  const handlefilechange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Check Excel file
    const fileName = file.name.toLowerCase();

    if (
      !fileName.endsWith(".xlsx") &&
      !fileName.endsWith(".xls")
    ) {
      alert(
        "Please upload an Excel file (.xlsx or .xls)."
      );

      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = event.target.result;

        // Read Excel file
        const workbook = XLSX.read(data, {
          type: "array",
        });

        // Get first sheet
        const sheetName = workbook.SheetNames[0];

        if (!sheetName) {
          alert(
            "The Excel file does not contain a worksheet."
          );
          return;
        }

        const worksheet = workbook.Sheets[sheetName];

        // Convert Excel to JSON
        const excelData = XLSX.utils.sheet_to_json(
          worksheet,
          {
            header: "A",
            defval: "",
          }
        );

        console.log("Excel Data:", excelData);

        // Column B contains email addresses
        const emails = excelData
          .slice(1)
          .map((item) =>
            String(item.B || "").trim()
          )
          .filter((email) => {
            return (
              email &&
              email.includes("@") &&
              email.includes(".")
            );
          });

        console.log("Excel Emails:", emails);
        console.log("Total Emails:", emails.length);

        // Save emails in context
        setmaildata((prev) => ({
          ...prev,
          file: file,
          filemails: emails,
        }));

        if (emails.length === 0) {
          alert(
            "No valid email addresses were found in Column B."
          );
        }
      } catch (error) {
        console.error(
          "Excel reading error:",
          error
        );

        alert(
          "Unable to read the Excel file. Please upload a valid Excel file."
        );
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <section className="min-h-screen bg-[#F7F5FC] px-4 py-10">

      <div className="mx-auto max-w-2xl rounded-2xl border border-[#E4DDF5] bg-white p-6 shadow-xl sm:p-8">

        {/* HEADER */}
        <div className="mb-8 border-b border-[#E8E2F3] pb-6">

          <h2 className="text-3xl font-bold text-[#34215C]">
            Create Email Campaign
          </h2>

          <p className="mt-2 text-sm text-[#756A8A]">
            Send personalized emails to multiple recipients
            with ease.
          </p>

        </div>

        <form
          onSubmit={handlesubmit}
          className="space-y-6"
        >

          {/* SUBJECT */}
          <div>

            <label
              htmlFor="subject"
              className="mb-2 block text-sm font-semibold text-[#49386B]"
            >
              Email Subject
            </label>

            <input
              type="text"
              id="subject"
              name="subject"
              value={maildata.subject}
              onChange={handlechange}
              placeholder="Enter your email subject"
              className="w-full rounded-lg border border-[#D9D0EC] bg-[#FAF9FD] px-4 py-3 text-sm text-[#34215C] outline-none transition placeholder:text-[#9A91AA] focus:border-[#6C4AB6] focus:bg-white focus:ring-2 focus:ring-[#E9E2F8]"
            />

          </div>

          {/* RECIPIENTS */}
          <div>

            <label
              htmlFor="recipients"
              className="mb-2 block text-sm font-semibold text-[#49386B]"
            >
              Recipient Email Addresses
            </label>

            <textarea
              id="recipients"
              name="recipients"
              value={maildata.recipients}
              onChange={handlechange}
              placeholder="Enter email addresses separated by commas"
              rows="4"
              className="w-full resize-y rounded-lg border border-[#D9D0EC] bg-[#FAF9FD] px-4 py-3 text-sm leading-6 text-[#34215C] outline-none transition placeholder:text-[#9A91AA] focus:border-[#6C4AB6] focus:bg-white focus:ring-2 focus:ring-[#E9E2F8]"
            />

            <p className="mt-2 text-xs text-[#756A8A]">
              Example: john@example.com, jane@example.com
            </p>

          </div>

          {/* MESSAGE */}
          <div>

            <label
              htmlFor="message"
              className="mb-2 block text-sm font-semibold text-[#49386B]"
            >
              Message
            </label>

            <textarea
              id="message"
              name="body"
              value={maildata.body}
              onChange={handlechange}
              placeholder="Write your email message here..."
              rows="8"
              className="w-full resize-y rounded-lg border border-[#D9D0EC] bg-[#FAF9FD] px-4 py-3 text-sm leading-6 text-[#34215C] outline-none transition placeholder:text-[#9A91AA] focus:border-[#6C4AB6] focus:bg-white focus:ring-2 focus:ring-[#E9E2F8]"
            />

          </div>

          {/* EXCEL UPLOAD */}
          <div>

            <label
              htmlFor="file"
              className="mb-2 block text-sm font-semibold text-[#49386B]"
            >
              Upload Recipient File
            </label>

            <input
              type="file"
              id="file"
              name="file"
              accept=".xlsx,.xls"
              onChange={handlefilechange}
              className="w-full rounded-lg border border-[#D9D0EC] bg-[#FAF9FD] px-4 py-3 text-sm text-[#34215C] outline-none transition file:mr-4 file:rounded-md file:border-0 file:bg-[#6C4AB6] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[#573795]"
            />

            <p className="mt-2 text-xs text-[#756A8A]">
              Upload an Excel file containing recipient
              names in Column A and email addresses in
              Column B.
            </p>

            <p className="mt-2 text-sm font-medium text-[#49386B]">
              Recipients Found:{" "}
              {maildata.filemails.length}
            </p>

          </div>

          {/* SEND BUTTON */}
          <button
            type="submit"
            disabled={status}
            className="w-full rounded-lg bg-[#6C4AB6] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#573795] focus:outline-none focus:ring-2 focus:ring-[#B8A5DE] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status ? "Sending..." : "Send Campaign"}
          </button>

        </form>
      </div>
    </section>
  );
};

export default Mailpage;