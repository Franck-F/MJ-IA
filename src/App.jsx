import React, { useState, useEffect, useRef } from "react";

function App() {
  const [agent, setAgent] = useState("storyteller");
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState("partie-42");
  const [messages, setMessages] = useState([]); // State to store chat messages
  const [isLoading, setIsLoading] = useState(false);

  const chatContainerRef = useRef(null); // Ref for scrolling to bottom

  const orchestratorUrl = import.meta.env.VITE_ORCHESTRATOR_URL;

  useEffect(() => {
    // Scroll to the bottom of the chat container whenever messages update
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { id: Date.now(), sender: "user", text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput(""); // Clear input immediately

    setIsLoading(true);

    let payload = { agent, sessionId };
    if (agent === "thrower") payload.expression = userMessage.text;
    else if (agent === "rules-keeper") payload.question = userMessage.text;
    else payload.action = userMessage.text;

    try {
      const res = await fetch(orchestratorUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      let agentResponseText = "Le Maître du Jeu est silencieux...";
      if (data.story) {
        agentResponseText = data.story;
      } else if (data.rule) {
        agentResponseText = data.rule;
      } else if (data.roll) {
        agentResponseText = `Lancer de dés ! Expression: ${data.expression}, Résultat: ${data.result}, Détails: ${data.roll}`;
      } else {
        agentResponseText = JSON.stringify(data, null, 2); // Fallback for raw data
      }

      const agentMessage = { id: Date.now() + 1, sender: "agent", text: agentResponseText };
      setMessages((prevMessages) => [...prevMessages, agentMessage]);

    } catch (error) {
      console.error("Error fetching from orchestrator:", error);
      const errorMessage = { id: Date.now() + 1, sender: "agent", text: "La connexion avec le monde des esprits a échoué. Vérifiez la console." };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans flex flex-col items-center justify-center p-4 sm:p-6">
      <div id="animated-background">
        <div id="smoke-embers-container"></div>
      </div>
      <div className="w-full max-w-4xl mx-auto">
        <div id="large-smoke-overlay"></div>
        <div id="large-flame-overlay"></div>
        <div id="cavalier-animation-1"></div>
        <div id="cavalier-animation-2"></div>
        <div id="cavalier-animation-3"></div>
        <div id="dragon-animation-1"></div>
        <div id="dragon-animation-2"></div>
        <div id="sorcier-animation-1"></div>
        <div id="sorcier-animation-2"></div>
        <header className="text-center mb-8">
          <h1 className="font-heading text-11xl sm:text-7xl text-stone-dark font-bold tracking-wider" style={{textShadow: '2px 2px 4px #c0a981'}}>
            Maître du Jeu IA
          </h1>
          <p className="text-stone-dark text-xl mt-2">Votre compagnon d'aventure numérique</p>
        </header>

        <div className="bg-wood-dark p-8 rounded-lg shadow-xl border-2 border-iron-dark flex flex-col h-[80vh] relative overflow-hidden">

          {/* Agent Selection and Input */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end mb-6">
            <div className="flex flex-col">
              <label htmlFor="agent-select" className="font-medieval-heading text-base text-gold-accent mb-2 opacity-90">Choisir l'Agent</label>
              <select
                id="agent-select"
                value={agent}
                onChange={(e) => setAgent(e.target.value)}
                className="p-3 rounded-md bg-wood-dark border-2 border-iron-dark text-parchment focus:ring-2 focus:ring-gold-accent focus:border-gold-accent transition-all duration-200 shadow-md font-medieval-body"
              >
                <option value="storyteller">Conteur</option>
                <option value="rules-keeper">Gardien des règles</option>
                <option value="thrower">Lanceur</option>
              </select>
            </div>

            <div className="md:col-span-2 flex flex-col">
              <label htmlFor="user-input" className="font-medieval-heading text-base text-gold-accent mb-2 opacity-90">Votre Action</label>
              <input
                id="user-input"
                type="text"
                placeholder="Que faites-vous, aventurier ?"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="p-3 rounded-md bg-wood-dark border-2 border-iron-dark text-parchment w-full focus:ring-2 focus:ring-gold-accent focus:border-gold-accent transition-all duration-200 shadow-md placeholder-iron-light font-medieval-body"
              />
            </div>
          </div>

          {/* Chat History Display */}
          <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 rounded-md bg-parchment/90 mb-6 custom-scrollbar border-2 border-iron-dark shadow-inner text-wood-dark font-medieval-body">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex mb-4 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg shadow-md ${
                    msg.sender === "user"
                      ? "bg-dragon-red text-white"
                      : "bg-parchment text-stone-dark"
                  }`}
                >
                  <p className="font-sans text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="max-w-[70%] p-3 rounded-lg shadow-md bg-parchment text-stone-dark">
                  <p className="font-sans text-sm">Le Maître du Jeu réfléchit...</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-auto text-center">
            <button
              onClick={sendMessage}
              disabled={isLoading}
              className="bg-medieval-red hover:bg-medieval-red/90 text-gold-accent font-medieval-heading text-xl px-10 py-4 rounded-md shadow-lg border-2 border-iron-dark transform hover:scale-105 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-gold-accent/50 focus:ring-offset-2 focus:ring-offset-wood-dark"
            >
              {isLoading ? 'Envoi en cours...' : 'Envoyer au Maître'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;