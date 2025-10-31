import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  insights?: {
    type: 'financial' | 'workforce' | 'clinical' | 'strategic';
    title: string;
    description: string;
    impact?: string;
  }[];
}

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIAssistant({ isOpen, onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your PM0 AI Assistant. I can help you analyze financial performance, workforce metrics, identify cost savings, predict staffing needs, and provide strategic insights. What would you like to know?",
      timestamp: new Date(),
      suggestions: [
        'Show me budget variance analysis for Q1',
        'Which departments have high overtime?',
        'Predict staffing needs for next week',
        'Identify cost reduction opportunities',
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (message?: string) => {
    const textToSend = message || input;
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const response = generateResponse(textToSend);
      setMessages((prev) => [...prev, response]);
      setIsLoading(false);
    }, 1500);
  };

  const generateResponse = (query: string): Message => {
    const lowerQuery = query.toLowerCase();

    // Mock AI responses based on query patterns
    if (lowerQuery.includes('budget') || lowerQuery.includes('variance')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I've analyzed the budget variance for Q1 2025. Here's what I found:",
        timestamp: new Date(),
        insights: [
          {
            type: 'financial',
            title: 'Emergency Department Over Budget',
            description: 'ED spending is 12.5% over budget ($650K variance) primarily due to increased overtime and agency staffing.',
            impact: 'High - Immediate cost containment needed',
          },
          {
            type: 'financial',
            title: 'Surgery Under Budget',
            description: 'Surgery department is 3.1% under budget ($148K) due to lower-than-expected case volumes.',
            impact: 'Medium - Opportunity to increase revenue',
          },
          {
            type: 'strategic',
            title: 'Cost Optimization Opportunity',
            description: 'Optimizing ED scheduling and reducing agency use by 30% could save $420K annually.',
            impact: 'High - ROI of 340% with implementation cost of $125K',
          },
        ],
        suggestions: [
          'Show detailed ED overtime analysis',
          'Compare against peer organizations',
          'Generate cost reduction plan',
        ],
      };
    }

    if (lowerQuery.includes('overtime') || lowerQuery.includes('labor cost')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Here's the overtime analysis across departments:",
        timestamp: new Date(),
        insights: [
          {
            type: 'workforce',
            title: 'ICU Overtime Critical',
            description: 'ICU overtime is 22.1%, costing $285K/month. 3 nurses averaging 20+ hours OT weekly.',
            impact: 'Critical - Burnout risk and cost impact',
          },
          {
            type: 'workforce',
            title: 'ED Staffing Model Issue',
            description: 'ED overtime spiked 28% this month due to understaffing during peak hours (6 PM - 2 AM).',
            impact: 'High - Recommend adding 2.5 FTE evening shift',
          },
          {
            type: 'strategic',
            title: 'System-Wide Savings Opportunity',
            description: 'Implementing AI-driven scheduling could reduce overtime by 15% across all units, saving $1.8M annually.',
            impact: 'Very High - Payback period of 8 months',
          },
        ],
        suggestions: [
          'Show burnout risk by department',
          'Calculate cost of adding FTEs vs overtime',
          'View AI scheduling recommendations',
        ],
      };
    }

    if (lowerQuery.includes('staffing') || lowerQuery.includes('forecast') || lowerQuery.includes('predict')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I've generated staffing forecasts using predictive analytics:",
        timestamp: new Date(),
        insights: [
          {
            type: 'workforce',
            title: 'Next Week Volume Surge',
            description: 'Predicted 18% increase in patient volume Feb 8-10 based on seasonal patterns and local events.',
            impact: 'High - Recommend adding 12.5 FTE across ED and Med/Surg',
          },
          {
            type: 'workforce',
            title: 'Acuity Level Rising',
            description: 'Patient acuity score predicted to increase from 3.2 to 3.8, requiring higher nurse-to-patient ratios.',
            impact: 'Medium - May need additional specialized staff',
          },
          {
            type: 'strategic',
            title: 'Proactive Scheduling',
            description: 'With 95% confidence, model recommends scheduling adjustments now to avoid $75K in rush agency costs.',
            impact: 'Medium - Act within 48 hours for optimal results',
          },
        ],
        suggestions: [
          'Show detailed daily forecasts',
          'Calculate agency vs FTE cost comparison',
          'View historical accuracy metrics',
        ],
      };
    }

    if (lowerQuery.includes('turnover') || lowerQuery.includes('retention') || lowerQuery.includes('burnout')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Here's the employee engagement and retention analysis:",
        timestamp: new Date(),
        insights: [
          {
            type: 'workforce',
            title: 'High Burnout in ICU',
            description: '32% of ICU staff showing high burnout indicators (score ≥70). 5 high performers at elevated turnover risk.',
            impact: 'Critical - Potential loss of $375K in replacement costs',
          },
          {
            type: 'workforce',
            title: 'RN Turnover Above Industry',
            description: 'RN turnover rate at 18.5% vs industry average of 15.2%. Exit interviews cite workload and burnout.',
            impact: 'High - Annual cost impact: $1.2M',
          },
          {
            type: 'strategic',
            title: 'Retention Program ROI',
            description: 'Implementing targeted retention program (workload balancing, wellness, bonuses) could reduce turnover by 25% with ROI of 420%.',
            impact: 'Very High - Projected savings: $900K annually',
          },
        ],
        suggestions: [
          'Identify at-risk employees',
          'Show engagement survey results',
          'Generate retention action plan',
        ],
      };
    }

    // Default response
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: "I can help you analyze various aspects of your healthcare operations. Here are some things I can do:",
      timestamp: new Date(),
      insights: [
        {
          type: 'financial',
          title: 'Financial Analysis',
          description: 'Budget variance, revenue cycle metrics, service line profitability, cost reduction opportunities',
        },
        {
          type: 'workforce',
          title: 'Workforce Analytics',
          description: 'Labor costs, overtime analysis, productivity metrics, engagement and burnout detection',
        },
        {
          type: 'strategic',
          title: 'Predictive Insights',
          description: 'Staffing forecasts, volume predictions, turnover risk, ROI analysis for initiatives',
        },
        {
          type: 'clinical',
          title: 'Operational Intelligence',
          description: 'Cross-functional insights, anomaly detection, strategic recommendations',
        },
      ],
      suggestions: [
        'Analyze Q1 financial performance',
        'Show workforce productivity trends',
        'Identify cost savings opportunities',
        'Predict next month staffing needs',
      ],
    };
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'financial':
        return '💰';
      case 'workforce':
        return '👥';
      case 'clinical':
        return '🏥';
      case 'strategic':
        return '🎯';
      default:
        return '💡';
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'financial':
        return 'border-blue-500/50 bg-blue-500/10';
      case 'workforce':
        return 'border-green-500/50 bg-green-500/10';
      case 'clinical':
        return 'border-purple-500/50 bg-purple-500/10';
      case 'strategic':
        return 'border-orange-500/50 bg-orange-500/10';
      default:
        return 'border-gray-500/50 bg-gray-500/10';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-2xl h-[600px] flex flex-col bg-gray-900 border-2 border-purple-500/50 rounded-xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gradient-to-r from-purple-600/20 to-blue-600/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-xl">
              🤖
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">PM0 AI Assistant</h2>
              <p className="text-xs text-gray-400">Healthcare Operations Intelligence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                <div
                  className={`rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-100'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>

                {message.insights && (
                  <div className="mt-3 space-y-2">
                    {message.insights.map((insight, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border ${getInsightColor(insight.type)}`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-xl">{getInsightIcon(insight.type)}</span>
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-white mb-1">
                              {insight.title}
                            </h4>
                            <p className="text-xs text-gray-300 mb-1">{insight.description}</p>
                            {insight.impact && (
                              <p className="text-xs text-gray-400 italic">
                                Impact: {insight.impact}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {message.suggestions && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(suggestion)}
                        className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 text-xs text-gray-300 rounded-lg transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything about your operations..."
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all"
            >
              Send
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            💡 Tip: Ask about budgets, staffing, overtime, forecasts, or cost savings
          </p>
        </div>
      </div>
    </div>
  );
}

