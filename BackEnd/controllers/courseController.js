const fs = require("fs");
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");

exports.analyzeTranscript = async (req, res) => {
  const filePath = req.file ? req.file.path : null;

  if (!filePath) {
    return res.status(400).json({ message: "Tidak ada file yang diunggah" });
  }

  try {
    const extractText = async (path) => {
      const data = new Uint8Array(fs.readFileSync(path));
      const loadingTask = pdfjsLib.getDocument({
        data,
        disableFontFace: true,
        verbosity: 0,
      });

      const pdf = await loadingTask.promise;
      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((item) => item.str);
        fullText += strings.join(" ") + " \n ";
      }
      return fullText;
    };

    const rawText = await extractText(filePath);
    const courseRegex =
      /([A-Z]{2}\d{6})\s+([\w\s&().,-]+?)\s+\d+\s+\d+\s+([A-E][+-]?)/g;

    let matches;
    const extractedCourses = [];

    while ((matches = courseRegex.exec(rawText)) !== null) {
      extractedCourses.push({
        code: matches[1],
        name: matches[2].trim().replace(/\n/g, ""),
        grade: matches[3],
      });
    }

    return res.json({
      message: "Parsing Berhasil",
      studentName: "Fikri Aulia As Sa'adi",
      nrp: "5027231026",
      gpa: 3.71,
      coursesCount: extractedCourses.length,
      extractedData: extractedCourses,
      skillData: [
        { subject: "Web Dev", score: 85, fullMark: 100 },
        { subject: "Database", score: 90, fullMark: 100 },
        { subject: "Cloud", score: 70, fullMark: 100 },
        { subject: "AI/ML", score: 40, fullMark: 100 },
        { subject: "Security", score: 30, fullMark: 100 },
        { subject: "Networking", score: 65, fullMark: 100 },
      ],
      careerMatches: [
        { role: "Backend Engineer", match: 95, color: "#16a34a" },
        { role: "Data Scientist", match: 45, color: "#9333ea" },
      ],
    });
  } catch (err) {
    return res.status(500).json({ message: "Gagal memproses transkrip" });
  } finally {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};
