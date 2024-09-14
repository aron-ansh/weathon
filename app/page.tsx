"use client";
import * as React from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedDarkAtom } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  SendHorizonal,
  Copy,
  Check,
  Code,
  Monitor,
  BookOpen,
  DollarSign,
  Shuffle,
  Info,
} from "lucide-react";
import { motion } from "framer-motion";

type Message = {
  text: string;
  sender: "user" | "ai";
};

// Define a type for pluginIds that allows indexing with numbers
type PluginIds = {
  [key: number]: string[];
};

const pluginIds: PluginIds = {
  1: ["plugin-1726271699"], // Coding and Technical
  2: ["plugin-1726271699"], // Coding and Technical
  3: ["plugin-1726286452"], // Soft Skills
  4: ["plugin-1726276852"], // Finance
  5: ["plugin-1712327325", "plugin-1713962163"], // Explore Random or Default
};

export default function Home() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [selectedCard, setSelectedCard] = React.useState<number | null>(null);
  const [selectedChatName, setSelectedChatName] = React.useState<string | null>(null); // State to store chat name
  const [pluginInfo, setPluginInfo] = React.useState<string | null>(null); // State to store plugin information
  const [suggestions, setSuggestions] = React.useState<string[]>([
    "Hello",
    "How are you?",
    "Tell me more",
    "Thanks!",
    "Goodbye",
  ]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [copiedMessage, setCopiedMessage] = React.useState<string | null>(null);

  // Fetch chat history based on chatid
  const fetchChatHistory = async (chatid: string) => {
    try {
      const response = await axios.post(`https://api-demo-bice.vercel.app/api/history`, {
        chatid
      });
      const history = response.data;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const historyMessages: Message[] = Object.values(history).flatMap((chat: any) => {
        const userMessage: Message = { text: chat.user.msg, sender: "user" };
        const botMessage: Message = { text: chat.bot.msg, sender: "ai" };
        return [userMessage, botMessage];
      });

      setMessages(historyMessages);
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
    }
  };

  React.useEffect(() => {
    const chatid = "souvikgupta";
    fetchChatHistory(chatid);
  }, []);

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      setMessages((prev) => [...prev, { text: inputValue, sender: "user" }]);
      setInputValue("");
      setLoading(true);

      try {
        const chatid = "souvikgupta";
        const selectedPluginIds = pluginIds[(selectedCard as number) || 5]; // Use default plugin IDs if none selected

        const response = await axios.post("https://api-demo-bice.vercel.app/api/home", {
          plugid: selectedPluginIds,
          query: inputValue,
          chatid
        });

        const { message, data, suggestion } = response.data;
        if (message === "Chat query submitted successfully") {
          setMessages((prev) => [
            ...prev,
            { text: data.answer, sender: "ai" },
          ]);
          setSuggestions(suggestion);
        } else {
          setMessages((prev) => [
            ...prev,
            { text: "Error: " + message, sender: "ai" },
          ]);
        }
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          { text: "Error: An error occurred. Please try again.", sender: "ai" },
        ]);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCardClick = (cardIndex: number) => {
    const cardNames = ["Coding", "Tech", "Soft Skills", "Finance", "Explore Random"];
    const pluginDescriptions = [
      "Coding and Technical Plugins",
      "Coding and Technical Plugins",
      "Soft Skills Plugins",
      "Finance Plugins",
      "Explore Random or Default Plugins"
    ];
    setSelectedCard(cardIndex);
    setSelectedChatName(cardNames[cardIndex - 1]); // Store selected card name
    setPluginInfo(pluginDescriptions[cardIndex - 1]); // Set plugin information
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedMessage(text);
      setTimeout(() => setCopiedMessage(null), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#0f0f0f] text-white">
      {selectedCard === null ? (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col justify-center items-center p-8"
        >
          <h1 className="text-3xl font-bold mb-6">Select Your Preferences</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-screen-lg">
            {[1, 2, 3, 4, 5].map((preference) => (
              <motion.div
                key={preference}
                whileHover={{ scale: 1.05 }}
                className="relative cursor-pointer"
                onClick={() => handleCardClick(preference)}
              >
                <Card className="bg-[#1e1e1e] text-white hover:bg-[#2b2b2b] border border-gray-700 transition-colors duration-300 relative">
                  <CardHeader>
                    <CardTitle>
                      {preference === 1 && <Code className="mr-2" />}
                      {preference === 2 && <Monitor className="mr-2" />}
                      {preference === 3 && <BookOpen className="mr-2" />}
                      {preference === 4 && <DollarSign className="mr-2" />}
                      {preference === 5 && <Shuffle className="mr-2" />}
                      {preference === 1
                        ? "Coding"
                        : preference === 2
                        ? "Tech"
                        : preference === 3
                        ? "Soft Skills"
                        : preference === 4
                        ? "Finance"
                        : "Explore Random"}
                    </CardTitle>
                    <CardDescription>
                      {preference === 1
                        ? "Details about coding"
                        : preference === 2
                        ? "Details about tech"
                        : preference === 3
                        ? "Details about soft skills"
                        : preference === 4
                        ? "Details about finance"
                        : "Explore various random topics"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      {preference === 1
                        ? "Explore various coding topics and best practices."
                        : preference === 2
                        ? "Learn about the latest tech trends and tools."
                        : preference === 3
                        ? "Improve your communication skills."
                        : preference === 4
                        ? "Get insights on personal finance and investments."
                        : "Discover random subjects and gain new perspectives."}
                    </p>
                  </CardContent>
                  <div className="absolute top-2 right-2 group">
                    <Info size={20} className="text-gray-500 cursor-pointer" />
                    <div className="absolute top-full right-0 hidden group-hover:block bg-gray-700 text-white p-2 rounded-md transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                      {preference === 1
                        ? "Information about coding."
                        : preference === 2
                        ? "Information about tech."
                        : preference === 3
                        ? "Information about soft skills."
                        : preference === 4
                        ? "Information about finance."
                        : "Information about random topics."}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 flex flex-col p-4 bg-[#1e1e1e]"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{selectedChatName} Chat</h2> {/* Display selected chat name */}
            <Button
              onClick={() => {
                setSelectedCard(null);
                setPluginInfo(null); // Reset plugin info when deselecting card
              }}
              className="text-white hover:text-gray-500"
            >
              X
            </Button>
          </div>
          {pluginInfo && (
            <div className="mb-4 p-2 bg-gray-800 rounded-md border border-gray-700">
              <strong>Active Plugin:</strong> {pluginInfo}
            </div>
          )}
          <div className="flex-1 flex flex-col space-y-4 overflow-y-auto p-4 border border-gray-700 rounded-lg bg-[#2e2e2e]">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-2 rounded-md ${
                  message.sender === "user"
                    ? "bg-blue-700 self-end"
                    : "bg-gray-800 max-w-3/4 self-start"
                }`}
              >
                {message.sender === "ai" ? (
                  <div className="flex flex-col relative">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        code({ node, className, children, ...props }) {
                          const language = /language-(\w+)/.exec(
                            className || ""
                          )?.[1];
                          const codeString = String(children).replace(/\n$/, "");

                          return (
                            <div className="relative">
                              <SyntaxHighlighter
                                language={language}
                                style={solarizedDarkAtom}
                              >
                                {codeString}
                              </SyntaxHighlighter>
                              <div className="absolute top-2 right-2 flex gap-2">
                                <button
                                  onClick={() => handleCopy(codeString)}
                                  className="text-gray-400 hover:text-gray-200"
                                >
                                  <Copy size={16} />
                                </button>
                                {copiedMessage === codeString && (
                                  <button className="text-green-400">
                                    <Check size={16} />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        },
                      }}
                    >
                      {message.text}
                    </ReactMarkdown>
                  </div>
                ) : (
                  message.text
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce delay-400"></div>
              </div>
            )}
          </div>
          <div className="mt-4">
            <div className="mb-2 flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="bg-gray-700 text-gray-300 hover:bg-gray-600"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
            <div className="flex">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-gray-800 text-white"
              />
              <Button
                onClick={handleSendMessage}
                className="ml-2 bg-blue-600 text-white hover:bg-blue-500"
              >
                <SendHorizonal size={16} />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
