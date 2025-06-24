"use client";
 

export default function FileToPdf() { 

   return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-xl text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">📁 File to PDF Converter</h1>
        <p className="text-lg text-gray-600 mb-6">
          This feature is currently under construction. We'll launch it soon!
        </p>
        <p className="text-sm text-gray-400">
          Meanwhile, feel free to explore other tools and sections of the site.
        </p>
      </div>
    </div>
  )
}
// import { useState } from "react";

// import html2pdf from "html2pdf.js";
// async function loadMammothFromCDN() {
//   if (typeof window !== "undefined" && !(window as any).mammoth) {
//     await new Promise((resolve, reject) => {
//       const script = document.createElement("script");
//       script.src = "https://unpkg.com/mammoth/mammoth.browser.min.js";
//       script.onload = () => resolve(true);
//       script.onerror = () => reject("Failed to load mammoth");
//       document.body.appendChild(script);
//     });
//   }
// }

// export default function FileToPdf() {
//   const [files, setFiles] = useState<File[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setFiles(Array.from(e.target.files));
//       setError(null);
//     }
//   };

// const generateContent = async () => {
//   try {
//     const container = document.createElement("div");
//     container.style.width = "100%";
//     container.style.backgroundColor = "#fff";
//     container.style.padding = "20px";
//     container.style.fontFamily = "Arial, sans-serif";
//     container.style.boxSizing = "border-box";

//     for (const file of files) {
//       const ext = file.name.split(".").pop()?.toLowerCase();

//       if (ext?.match(/jpg|jpeg|png|webp|gif/)) {
//         const img = document.createElement("img");
//         const url = URL.createObjectURL(file);
//         img.src = url;
//         img.style.width = "100%";
//         img.style.maxWidth = "100%";
//         img.style.marginBottom = "20px";
//         img.style.borderRadius = "8px";
//         await new Promise((resolve, reject) => {
//           img.onload = resolve;
//           img.onerror = () => reject(new Error(`Failed to load image: ${file.name}`));
//         });
//         container.appendChild(img);
//       } else if (ext === "docx") {
//         try {
//           const arrayBuffer = await file.arrayBuffer();

//           await loadMammothFromCDN(); // Load via CDN
//           const result = await (window as any).mammoth.convertToHtml({ arrayBuffer });

//           const docDiv = document.createElement("div");
//           docDiv.innerHTML = result.value;
//           docDiv.style.margin = "20px";
//           docDiv.style.lineHeight = "1.6";
//           docDiv.style.fontSize = "16px";
//           container.appendChild(docDiv);
//         } catch (err) {
//           console.error(`Error processing DOCX ${file.name}:`, err);
//           const para = document.createElement("p");
//           para.innerText = `⚠️ Error processing ${file.name}: ${
//             typeof err === "object" && err !== null && "message" in err
//               ? (err as { message?: string }).message
//               : "Unknown error"
//           }`;
//           para.style.margin = "20px";
//           para.style.color = "#e53e3e";
//           container.appendChild(para);
//         }
//       } else {
//         const para = document.createElement("p");
//         para.innerText = `📄 ${file.name} (Preview not supported)`;
//         para.style.margin = "20px";
//         para.style.fontSize = "18px";
//         para.style.color = "#555";
//         container.appendChild(para);
//       }
//     }

//     return container;
//   } catch (err) {
//     console.error("Error generating content:", err);
//     setError(
//       `Failed to generate content: ${
//         typeof err === "object" && err !== null && "message" in err
//           ? (err as { message?: string }).message
//           : "Unknown error"
//       }`
//     );
//     return null;
//   }
// };


//   const generatePDF = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const container = await generateContent();
//       if (!container) {
//         setError("Failed to generate PDF content.");
//         setLoading(false);
//         return;
//       }

//       await html2pdf()
//         .set({
//           margin: 10,
//           filename: "converted.pdf",
//           html2canvas: { scale: 2, useCORS: true },
//           jsPDF: { unit: "pt", format: "a4" },
//         })
//         .from(container)
//         .save();
//     } catch (err) {
//       console.error("PDF generation error:", err);
//       setError(
//         "Failed to generate PDF: " +
//           (typeof err === "object" && err !== null && "message" in err
//             ? (err as { message?: string }).message
//             : "Unknown error")
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
//       {/* ... your full JSX UI unchanged ... */}
//       {/* Keep rest of your JSX layout and design */}
//     </div>
//   );
// }
