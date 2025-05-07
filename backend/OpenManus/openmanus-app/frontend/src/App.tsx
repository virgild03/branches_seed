import { useState } from "react";

function App() {
  const [difficulte, setDifficulte] = useState("");
  const [theme, setTheme] = useState("");
  const [formatQ, setFormatQ] = useState("");
  const [question, setQuestion] = useState("");
  const [error, setError] = useState("");
  
  // Un state pour stocker les sorties dans un "terminal"
  const [terminalOutput, setTerminalOutput] = useState("");

  const handleGenerate = async () => {
    setQuestion("");
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:5000/generate-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          difficulte,
          theme,
          format: formatQ,
        }),
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setQuestion(data.question);
        // On ajoute le retour serveur dans le “terminal”
        setTerminalOutput((prev) => prev + "\n" + data.question);
      }
    } catch (err: any) {
      setError("Erreur de connexion au serveur : " + err.message);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Générateur de questions</h1>
      <div className="space-y-3">

        <div>
          <label className="mr-2">Difficulté :</label>
          <input
            className="border p-1"
            value={difficulte}
            onChange={(e) => setDifficulte(e.target.value)}
            placeholder="facile/moyen/difficile"
          />
        </div>

        <div>
          <label className="mr-2">Thème :</label>
          <input
            className="border p-1"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="ex: Java, Python..."
          />
        </div>

        <div>
          <label className="mr-2">Format :</label>
          <input
            className="border p-1"
            value={formatQ}
            onChange={(e) => setFormatQ(e.target.value)}
            placeholder="QCM, question ouverte, etc."
          />
        </div>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={handleGenerate}
        >
          Générer la question
        </button>
      </div>

      <div className="mt-4">
        {error && (
          <div className="bg-red-100 text-red-600 p-2 mb-2 rounded">
            Erreur : {error}
          </div>
        )}
        {question && (
          <div className="bg-green-100 p-2 rounded">
            <h2 className="font-bold">Question générée :</h2>
            <pre>{question}</pre>
          </div>
        )}
      </div>

      {/* La zone “terminal” pour afficher un historique de toutes les sorties */}
      <div className="mt-6 bg-gray-800 text-green-400 p-4 rounded h-48 overflow-auto font-mono">
        {terminalOutput
          ? terminalOutput
          : "Terminal: aucune sortie pour l'instant..."}
      </div>
    </div>
  );
}

export default App;
